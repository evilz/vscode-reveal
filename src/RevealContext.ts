import { FrontMatterResult } from 'front-matter'
import fs from 'fs'
import path from 'path'
import { isDeepStrictEqual } from 'util'
import { EventEmitter, Position, Range, Selection, TextDocument, TextEditor, Uri, workspace } from 'vscode'
import { Configuration, mergeConfig } from './Configuration'
import { Disposable } from './dispose'
import { ISlide } from './ISlide'
import Logger from './Logger'
import { RevealServer } from './RevealServer'
import slideParser, { SlideParserError } from './SlideParser'
import { countLinesToSlide } from './utils'

interface ISlidePosition {
  horizontal: number
  vertical: number
}

export class RevealContext extends Disposable {
  readonly #server: RevealServer

  public slides: ISlide[] = []
  public frontmatter?: FrontMatterResult<Configuration>
  public parseError?: SlideParserError
  public configuration: Configuration
  private position: ISlidePosition = { horizontal: 0, vertical: 0 }

  constructor(
    public editor: TextEditor,
    public logger: Logger,
    public getConfiguration: () => Configuration,
    public extensionPath: string,
    public isInExport: () => boolean,
    public onExportError: (error: unknown) => void = () => {},
  ) {
    super()
    this.editor = editor
    this.configuration = getConfiguration()
    this.#server = new RevealServer(this)
    this._register(this.#server)
  }

  private get docUri() {
    return this.editor.document.uri
  }

  private getText(range?: Range) {
    return this.editor.document.getText(range)
  }

  public get dirname(): string | null {
    const uri = this.editor.document.uri as Uri | undefined
    const uriScheme = uri && typeof uri === 'object' ? uri.scheme : undefined

    if ((uriScheme === 'file' || uriScheme === 'vscode-remote' || !uriScheme) && this.editor.document.fileName) {
      return path.dirname(this.editor.document.fileName)
    }

    if (uriScheme === 'untitled' && uri) {
      const workspaceFolder = workspace.getWorkspaceFolder(uri) ?? workspace.workspaceFolders?.[0]
      return workspaceFolder?.uri.fsPath ?? null
    }

    return null
  }

  get uriWithPosition() {
    const { horizontal, vertical } = this.position
    return `${this.#server.uri}#/${horizontal}/${vertical}/${Date.now()}`
  }

  get baseUri() {
    return this.#server.uri
  }

  public get exportPath(): string {
    if (path.isAbsolute(this.configuration.exportHTMLPath)) return this.configuration.exportHTMLPath
    const baseDir = this.dirname
    if (!baseDir) {
      throw new Error('Cannot resolve a relative HTML export path for this virtual document. Configure an absolute revealjs.exportHTMLPath or save the document first.')
    }
    return path.resolve(baseDir, this.configuration.exportHTMLPath)
  }

  public resolveLocalAssetPath(assetPath: string | null | undefined, appendCssIfMissing = false): string | null {
    if (!assetPath) return null

    const trimmed = assetPath.trim()
    if (!trimmed) return null
    if (/^(https?:)?\/\//i.test(trimmed) || /^data:/i.test(trimmed)) return null

    const [cleanedPath] = trimmed.split(/[?#]/)
    const baseDir = this.dirname
    let resolvedPath: string | null = cleanedPath
    if (!path.isAbsolute(cleanedPath)) {
      resolvedPath = baseDir ? path.resolve(baseDir, cleanedPath) : null
    }
    if (!resolvedPath) return null
    if (appendCssIfMissing && !path.extname(resolvedPath)) {
      return `${resolvedPath}.css`
    }
    return resolvedPath
  }

  public resolvePresentationFilePath(filePath: string | null | undefined): string | null {
    if (!filePath) return null

    const trimmed = filePath.trim()
    if (!trimmed || path.isAbsolute(trimmed)) return null

    const baseDir = this.dirname
    if (!baseDir) return null
    const basePath = path.resolve(baseDir)
    const resolvedPath = path.resolve(basePath, trimmed)
    const relativePath = path.relative(basePath, resolvedPath)
    if (relativePath === '..' || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
      return null
    }

    try {
      const realBasePath = fs.realpathSync(basePath)
      let existingPath = resolvedPath
      while (!fs.existsSync(existingPath)) {
        const parentPath = path.dirname(existingPath)
        if (parentPath === existingPath) return null
        existingPath = parentPath
      }

      const realExistingPath = fs.realpathSync(existingPath)
      const realRelativePath = path.relative(realBasePath, realExistingPath)
      if (realRelativePath === '..' || realRelativePath.startsWith(`..${path.sep}`) || path.isAbsolute(realRelativePath)) {
        return null
      }
      return path.resolve(realExistingPath, path.relative(existingPath, resolvedPath))
    } catch {
      return null
    }
  }

  public getReferencedAssetPaths(): string[] {
    const paths = new Set<string>()
    const baseDir = this.dirname
    if (baseDir) {
      paths.add(path.join(baseDir, 'init.js'))
      paths.add(path.join(baseDir, 'init.esm.js'))
    }

    const customThemePath = this.resolveLocalAssetPath(this.configuration.customTheme, true)
    if (customThemePath) {
      paths.add(customThemePath)
    }

    const htmlFragmentPath = this.resolvePresentationFilePath(this.configuration.htmlFragment)
    if (htmlFragmentPath) {
      paths.add(htmlFragmentPath)
    }

    const cssAssetPaths = Array.isArray(this.configuration.css) ? this.configuration.css : []
    for (const cssAssetPath of cssAssetPaths) {
      const resolvedPath = this.resolveLocalAssetPath(cssAssetPath)
      if (resolvedPath) {
        paths.add(resolvedPath)
      }
    }

    return [...paths]
  }

  public refresh() {
    const { frontmatter, slides, parseError } = slideParser.parse(this.getText(), this.configuration)
    this.slides = slides
    this.parseError = parseError
    if (!isDeepStrictEqual(frontmatter, this.frontmatter)) {
      this.frontmatter = frontmatter
      this.configuration = mergeConfig(this.getConfiguration(), frontmatter?.attributes)
      this.logger.LogLevel = this.configuration.logLevel
    }

    this.logger.debug(`CONTEXT: ${this.docUri} - Refreshed`)
    return { frontmatter, slides, parseError }
  }

  updatePosition(cursorPosition: Position) {
    const start = new Position(0, 0)
    const range = new Range(start, cursorPosition)
    const { slides } = slideParser.parse(this.getText(range), this.configuration, false)
    const currentSlide = slides[slides.length - 1]

    this.position = currentSlide.verticalChildren ? { horizontal: slides.length - 1, vertical: currentSlide.verticalChildren.length } : { horizontal: slides.length - 1, vertical: 0 }
  }

  is(document: TextDocument) {
    return this.editor.document.uri == document.uri
  }

  goToSlide(topindex: number, verticalIndex: number) {
    const linesCount = countLinesToSlide(this.slides, topindex, verticalIndex) + (this.frontmatter?.frontmatter ? this.frontmatter.bodyBegin : 0)

    const position = new Position(linesCount, 0)
    this.editor.selection = new Selection(position, position) //selections = [new Selection(position, position)]
    this.editor.revealRange(new Range(position, position.translate(20)))
  }

  startServer() {
    return this.#server.start()
  }

  stopServer() {
    this.#server.stop()
  }

  public get onDidStartServer() {
    return this.#server.onDidStart
  }

  public get onDidStopServer() {
    return this.#server.onDidStop
  }

  private readonly _onDidDispose = this._register(new EventEmitter<void>())
  /**
   * Fired when the document is disposed of.
   */
  public readonly onDidDispose = this._onDidDispose.event

  /**
   * Called by VS Code when there are no more references to the document.
   *
   * This happens when all editors for it have been closed.
   */
  dispose(): void {
    this._onDidDispose.fire()
    super.dispose()
  }
}

export class RevealContexts {
  private readonly innerMap = new Map<Uri, RevealContext>()

  constructor(
    private readonly logger: Logger,
    private readonly getConfiguration: () => Configuration,
    private readonly extensionPath: string,
    private readonly isInExport: () => boolean,
    private readonly onExportError: (error: unknown) => void,
    private readonly onServerStart: (uri: string, context: RevealContext) => void,
    private readonly onServerStop: (context: RevealContext) => void,
  ) {
    this.logger = logger
  }

  getOrAdd(editor: TextEditor) {
    if (this.innerMap.has(editor.document.uri)) return this.innerMap.get(editor.document.uri)
    const context = new RevealContext(editor, this.logger, this.getConfiguration, this.extensionPath, this.isInExport, this.onExportError)

    context.onDidDispose(() => this.logger.info(`CONTEXT: ${editor.document.uri} disposed`))
    context.onDidStartServer((uri) => this.onServerStart(uri, context))
    context.onDidStopServer(() => this.onServerStop(context))

    this.innerMap.set(editor.document.uri, context)
    return context
  }

  remove(uri) {
    const context = this.innerMap.get(uri)
    if (context) {
      this.innerMap.delete(uri)
      context.dispose()
    }
  }
}
