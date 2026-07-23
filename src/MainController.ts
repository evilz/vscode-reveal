/*
 * File: \src\MainController.ts
 * Project: vscode-reveal
 * Created Date: Wednesday October 23rd 2019
 * Author: Vincent Bourdon
 * -----
 * Last Modified: Tuesday, 8th March 2022 9:22:25 am
 * Modified By: Vincent Bourdon
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

/**
 * @summary Main controller that connect server, document, statusbar, iframe etc...
 * @author Vincent B. <evilznet@gmail.com>
 */
import {
  commands,
  ConfigurationChangeEvent,
  DiagnosticCollection,
  ExtensionContext,
  FileSystemWatcher,
  languages,
  Position,
  RelativePattern,
  TextDocument,
  TextDocumentChangeEvent,
  TextEditor,
  TextEditorSelectionChangeEvent,
  Uri,
  workspace,
  ViewColumn,
  window,
} from 'vscode'

import * as jetpack from 'fs-jetpack'
import path from 'path'

import { SHOW_REVEALJS } from './commands/showRevealJS'
import Logger from './Logger'
import { SlideTreeProvider } from './SlideExplorer'
import { StatusBarController } from './StatusBarController'
import WebViewPane from './WebViewPane'
import TextDecorator from './TextDecorator'
import { RevealContext, RevealContexts } from './RevealContext'
import { configPrefix, Configuration, ConfigurationDescription, getConfig } from './Configuration'
import { collectDiagnostics } from './FrontmatterDiagnostics'
import { getBatchExportPath } from './commands/exportHTMLFolder'
import { Disposable } from './dispose'

const isMarkdownFile = (d: TextDocument) => d.languageId === 'markdown'

export default class MainController extends Disposable {
  private readonly statusBarController: StatusBarController
  private readonly slidesExplorer: SlideTreeProvider
  private readonly textDecorator: TextDecorator
  private webViewPane?: WebViewPane
  public currentContext?: RevealContext
  private readonly revealContexts: RevealContexts
  private readonly assetWatchers = new Map<string, FileSystemWatcher>()
  private readonly diagnostics: DiagnosticCollection
  private readonly configByKey: Map<string, ConfigurationDescription>
  private readonly extensionPath: string

  get baseUri() {
    return this.currentContext?.baseUri
  }


  //#region VS CODE Event handlers
  public onDidChangeTextEditorSelection(event: TextEditorSelectionChangeEvent) {
    if (this.currentContext?.is(event.textEditor.document)) {
      const selection = event.selections.length > 0 ? event.selections[0] : event.textEditor.selection
      this.OnEditorEvent(event.textEditor, selection.active)
    }
  }

  private OnEditorEvent(editor: TextEditor, newPosition: Position) {
    if (isMarkdownFile(editor.document)) {
      this.currentContext = this.revealContexts.getOrAdd(editor)
      this.statusBarController.updateServerInfo(this.currentContext?.baseUri || null)
      this.updatePosition(newPosition)
      this.refresh()
    }
  }

  public onDidChangeActiveTextEditor(editor?: TextEditor) {
    if (editor) {
      this.logger.debug(`onDidChangeActiveTextEditor: ${editor.document.fileName}`)
      this.OnEditorEvent(editor, editor.selection.active)
    }
  }

  public onDidChangeTextDocument(e: TextDocumentChangeEvent) {
    if (this.currentContext?.is(e.document)) {
      this.logger.debug(`onDidChangeTextDocument: ${e.document.fileName}`)
      this.refresh()
    }
  }

  public onDidSaveTextDocument(document: TextDocument) {
    if (this.currentContext?.is(document)) {
      // ADD debug level
      this.logger.debug(`onDidSaveTextDocument: ${document.fileName}`)
      this.refresh()
    }
    // ADD debug level
    //this.logger.log(`onDidSaveTextDocument: ${e.fileName}`)
  }

  public onDidCloseTextDocument(document: TextDocument) {
    this.diagnostics.delete(document.uri)
    this.revealContexts.remove(document.uri)

    if (this.currentContext?.is(document)) {
      this.currentContext = undefined
      this.syncAssetWatchers()
    }

    this.logger.debug(`onDidCloseTextDocument ${document.uri}`)
  }

  public onDidChangeConfiguration(e: ConfigurationChangeEvent) {
    if (!e.affectsConfiguration(configPrefix)) {
      return
    }
    this.config = getConfig()
  }

  //#endregion


  public constructor(
    private readonly logger: Logger,
    extensionContext: ExtensionContext,
    configDesc: ConfigurationDescription[],
    private config: Configuration,
    currentEditor: TextEditor | undefined
  ) {
    super()
    this.extensionPath = extensionContext.extensionPath
    this.statusBarController = this._register(new StatusBarController())
    this.textDecorator = this._register(new TextDecorator(configDesc))
    this.revealContexts = this._register(new RevealContexts(
      logger,
      () => this.config,
      extensionContext.extensionPath,
      this.isInExport,
      this.onExportError,
      (uri, context) => {
        if (this.currentContext === context) {
          this.statusBarController.updateServerInfo(uri || null)
        }
      },
      (context) => {
        if (this.currentContext === context) {
          this.statusBarController.updateServerInfo(null)
        }
      }
    ))
    this.diagnostics = this._register(languages.createDiagnosticCollection('vscode-revealjs'))
    this.configByKey = new Map(configDesc.map((d) => [d.label, d]))

    if (currentEditor && isMarkdownFile(currentEditor.document)) {
      this.currentContext = this.revealContexts.getOrAdd(currentEditor)
    }

    this.slidesExplorer = this._register(new SlideTreeProvider(() => (this.currentContext ? this.currentContext.slides : [])))
    this.slidesExplorer.register()
    this._register(this.slidesExplorer.onDidChangeTreeData(() => this.logInfo(`SlideTreeProvider`, `updated`)))
  }

  //#region Log helpers
  private logInfo = (component: string, message: string) => {
    this.logger.info(`"${component.toUpperCase()}": ${message}`)
  }
  private logError = (component: string, message: string) => {
    this.logger.error(`"${component.toUpperCase()}": ${message}`)
  }
  //#endregion

  private exportState: {
    resolve: (path: string) => void
    reject: (error: Error) => void
    path: string
  } | null = null
  public isInExport = () => this.exportState !== null

  private readonly onExportError = (error: unknown) => {
    if (!this.exportState) return

    const normalizedError = error instanceof Error ? error : new Error(String(error))
    this.exportState.reject(new Error(`HTML export failed: ${normalizedError.message}`))
    this.exportState = null
  }

  public shouldOpenFilemanagerAfterHTMLExport = () => this.currentContext?.configuration.openFilemanagerAfterHTMLExport ?? false


  public exportAsync = async () => {
    if (!this.currentContext) {
      throw new Error('No active markdown context to export')
    }

    if (this.exportState) {
      this.exportState.reject(new Error('A previous HTML export was interrupted by a new export request'))
      this.exportState = null
    }

    await jetpack.removeAsync(this.currentContext.exportPath)
    const exportPath = this.currentContext.exportPath

    const promise = new Promise<string>((resolve, reject) => {
      this.exportState = { resolve, reject, path: exportPath }
    })

    if (this.webViewPane) {
      this.refreshWebViewPane()
    } else {
      await commands.executeCommand(SHOW_REVEALJS)
    }

    return promise
  }

  public exportFolderAsync = async (folder: Uri, files: readonly Uri[]) => {
    const originalContext = this.currentContext
    const exported: string[] = []

    try {
      for (const uri of files) {
        const document = await workspace.openTextDocument(uri)
        const context = this.createExportContext(document)
        try {
          context.refresh()
          context.configuration.exportHTMLPath = getBatchExportPath(
            folder.fsPath,
            context.configuration.exportHTMLPath,
            document.fileName,
          )
          this.currentContext = context

          await this.exportAsync()
          exported.push(context.exportPath)
        } finally {
          context.dispose()
        }
      }
      return exported
    } finally {
      this.currentContext = originalContext
      if (this.webViewPane && originalContext) this.refreshWebViewPane()
    }
  }

  private createExportContext(document: TextDocument) {
    const editor = {
      document,
      selection: new Position(0, 0),
      selections: [],
      revealRange: () => {},
    } as unknown as TextEditor
    return new RevealContext(editor, this.logger, () => this.config, this.extensionPath, this.isInExport, this.onExportError)
  }

  // debounce parse and refresh
  #refreshTimeout: NodeJS.Timeout | null = null
  refresh(wait = 500) {
    if (!this.currentContext) return

    if (this.#refreshTimeout) {
      clearTimeout(this.#refreshTimeout)
    }
    this.#refreshTimeout = setTimeout(async () => {
      const context = this.currentContext
      if (!context) return

      this.logger.info(`REFRESH START!`)
      const { slides } = context.refresh()
      this.syncAssetWatchers()
      const diagnostics = await collectDiagnostics(context, this.configByKey)
      this.diagnostics.set(context.editor.document.uri, diagnostics)

      this.refreshWebViewPane()
      this.slidesExplorer.update()
      this.statusBarController.updateCount(slides.length)
      this.textDecorator.update(context.editor)
      this.logger.info(`REFRESH DONE!`)
    }, wait)
  }

  private syncAssetWatchers() {
    const watchedPaths = new Set(this.currentContext?.getReferencedAssetPaths() ?? [])

    for (const [assetPath, watcher] of this.assetWatchers.entries()) {
      if (!watchedPaths.has(assetPath)) {
        watcher.dispose()
        this.assetWatchers.delete(assetPath)
      }
    }

    for (const assetPath of watchedPaths) {
      if (this.assetWatchers.has(assetPath)) {
        continue
      }

      const watcher = workspace.createFileSystemWatcher(
        new RelativePattern(path.dirname(assetPath), path.basename(assetPath)),
        false,
        false,
        false
      )
      const onAssetChanged = () => {
        this.logger.debug(`onDidChangeAsset: ${assetPath}`)
        this.refresh(50)
      }

      watcher.onDidChange(onAssetChanged)
      watcher.onDidCreate(onAssetChanged)
      watcher.onDidDelete(onAssetChanged)
      this.assetWatchers.set(assetPath, watcher)
    }
  }

  updatePosition(cursorPosition: Position) {
    if (!this.currentContext) return
    this.currentContext.updatePosition(cursorPosition)
  }

  public goToSlide(topindex: number, verticalIndex: number) {
    if (this.currentContext) this.currentContext.goToSlide(topindex, verticalIndex)
  }

  /**
   * Create Web view pane if not exists
   * @returns return false if pane already exists
   */
  public showWebViewPane() {
    if (this.webViewPane) {
      this.refreshWebViewPane()
      return false
    } else {
      const webviewPanel = window.createWebviewPanel('RevealJS', 'Reveal JS presentation', ViewColumn.Beside, { enableScripts: true })
      this.webViewPane = this._register(new WebViewPane(webviewPanel))
      this._register(this.webViewPane.onDidReceiveMessage((message) => {
        if (!message || typeof message !== 'object') return

        const command = 'command' in message ? message.command : undefined
        if (command === 'exportComplete') {
          if (this.exportState) {
            this.exportState.resolve(this.exportState.path)
            this.exportState = null
          }
          return
        }

        if (command !== 'slideChanged') return

        const horizontal = 'horizontal' in message ? Number(message.horizontal) : Number.NaN
        const vertical = 'vertical' in message ? Number(message.vertical) : Number.NaN
        if (!Number.isFinite(horizontal) || !Number.isFinite(vertical)) return
        this.goToSlide(horizontal, vertical)
      }))
      this._register(this.webViewPane.onDidDispose(() => {
        this.logInfo('WebView', 'disposed')
        this.webViewPane = undefined
      }))
      this.refreshWebViewPane()
      return true
    }
  }

  private refreshWebViewPane() {
    if (this.webViewPane && this.currentContext) {
      this.startServer()
      this.webViewPane.title = this.currentContext.configuration.title
      void this.webViewPane.update(this.currentContext.uriWithPosition, this.isInExport())
    }
  }

  /** Start server on an available port */
  public startServer() {
    this.currentContext?.startServer()
  }

  /** Stop server from listening */
  public stopServer() {
    this.currentContext?.stopServer()
  }

  public dispose() {
    if (this.#refreshTimeout) {
      clearTimeout(this.#refreshTimeout)
      this.#refreshTimeout = null
    }

    for (const watcher of this.assetWatchers.values()) {
      watcher.dispose()
    }
    this.assetWatchers.clear()

    if (this.exportState) {
      this.exportState.reject(new Error('HTML export was interrupted because the extension was disposed'))
      this.exportState = null
    }

    this.currentContext = undefined
    super.dispose()
  }
}
