import * as path from 'path'

const serverUri = 'http://localhost:1948/'
const parseMock = jest.fn()
const mergeConfigMock = jest.fn((workspace, document) => ({ ...workspace, ...document }))
const countLinesToSlideMock = jest.fn((...args: unknown[]) => {
  void args
  return 5
})

const serverStartMock = jest.fn(() => serverUri)
const serverStopMock = jest.fn()

jest.mock('../../SlideParser', () => ({
  __esModule: true,
  default: { parse: (...args: unknown[]) => parseMock(...args) },
}))

jest.mock('../../RevealServer', () => ({
  RevealServer: jest.fn().mockImplementation(() => ({
    uri: serverUri,
    start: () => serverStartMock(),
    stop: () => serverStopMock(),
    onDidStart: jest.fn(),
    onDidStop: jest.fn(),
    dispose: jest.fn(),
  })),
}))

jest.mock('../../Configuration', () => {
  const real = jest.requireActual('../../Configuration')
  return {
    ...real,
    mergeConfig: (workspaceConfig: unknown, documentConfig: unknown) => mergeConfigMock(workspaceConfig, documentConfig),
  }
})

jest.mock('../../utils', () => ({
  countLinesToSlide: (slides: unknown, horizontal: unknown, vertical: unknown) => countLinesToSlideMock(slides, horizontal, vertical),
}))

jest.mock('vscode', () => {
  const workspace = {
    workspaceFolders: undefined as unknown,
    getWorkspaceFolder: jest.fn(),
  }

  class Position {
    constructor(
      public line: number,
      public character: number,
    ) {}
    translate(deltaLine: number, deltaCharacter = 0) {
      return new Position(this.line + deltaLine, this.character + deltaCharacter)
    }
  }

  class Range {
    constructor(
      public start: Position,
      public end: Position,
    ) {}
  }

  class Selection {
    constructor(
      public anchor: Position,
      public active: Position,
    ) {}
  }

  class EventEmitter<T> {
    private listener: ((e: T) => void) | undefined
    get event() {
      return (cb: (e: T) => void) => {
        this.listener = cb
      }
    }
    fire(event: T) {
      this.listener?.(event)
    }
    dispose() {}
  }

  return { Position, Range, Selection, EventEmitter, workspace }
})

import type { FrontMatterResult } from 'front-matter'
import { Configuration, defaultConfiguration } from '../../Configuration'
import Logger, { LogLevel } from '../../Logger'
import { ISlide } from '../../ISlide'
import { RevealContext, RevealContexts } from '../../RevealContext'
import { Position, TextDocument, TextEditor, Uri, workspace } from 'vscode'

type MutableWorkspaceMock = {
  workspaceFolders: Array<{ uri: { fsPath: string } }> | undefined
  getWorkspaceFolder: jest.Mock
}
const workspaceMock = workspace as unknown as MutableWorkspaceMock

describe('RevealContext', () => {
  const makeEditor = () => ({
    document: {
      fileName: '/workspace/slides/main.md',
      uri: { scheme: 'file', toString: () => 'doc-uri' },
      getText: jest.fn(() => '# slide'),
    },
    revealRange: jest.fn(),
    selection: undefined,
  })

  const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    LogLevel: LogLevel.Error,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    workspaceMock.workspaceFolders = undefined
    workspaceMock.getWorkspaceFolder.mockReturnValue(undefined)
  })

  test('computes asset paths and uri helpers', () => {
    const editor = makeEditor()
    const context = new RevealContext(
      editor as unknown as TextEditor,
      logger as unknown as Logger,
      () => ({ ...defaultConfiguration, exportHTMLPath: 'dist' }),
      '/ext',
      () => false,
    )
    const slidesDir = path.dirname(editor.document.fileName)

    expect(context.dirname).toBe(slidesDir)
    expect(context.exportPath).toBe(path.resolve(slidesDir, 'dist'))
    expect(context.baseUri).toBe(serverUri)

    const cssPath = context.resolveLocalAssetPath('styles/custom', true)
    const absoluteCssPath = path.join(path.sep, 'tmp', 'file.css')
    const absolutePath = context.resolveLocalAssetPath(absoluteCssPath)
    const externalPath = context.resolveLocalAssetPath('https://example.com/a.css')
    const dataPath = context.resolveLocalAssetPath('data:text/plain,hello')
    const queryPath = context.resolveLocalAssetPath('theme.css?v=1#hash')

    expect(cssPath).toBe(path.resolve(slidesDir, 'styles', 'custom.css'))
    expect(absolutePath).toBe(absoluteCssPath)
    expect(externalPath).toBeNull()
    expect(dataPath).toBeNull()
    expect(queryPath).toBe(path.resolve(slidesDir, 'theme.css'))

    context.configuration = {
      ...defaultConfiguration,
      customTheme: 'styles/site',
      css: ['a.css', ' ', 'http://cdn/style.css', 'a.css', 'data:text/plain,hello'],
    }

    expect(context.getReferencedAssetPaths()).toEqual([path.join(slidesDir, 'init.js'), path.join(slidesDir, 'init.esm.js'), path.resolve(slidesDir, 'styles', 'site.css'), path.resolve(slidesDir, 'a.css')])
  })

  test('uses workspace folder as base dir for untitled documents and tolerates unresolved virtual documents', () => {
    const workspaceDir = path.join(path.sep, 'workspace', 'project-a')
    workspaceMock.workspaceFolders = [{ uri: { fsPath: workspaceDir } }]

    const untitledEditor = {
      document: {
        fileName: 'Untitled-1',
        uri: { scheme: 'untitled' },
        getText: jest.fn(() => '# slide'),
      },
      revealRange: jest.fn(),
      selection: undefined,
    }
    const untitledContext = new RevealContext(
      untitledEditor as unknown as TextEditor,
      logger as unknown as Logger,
      () => ({ ...defaultConfiguration, exportHTMLPath: 'dist' }),
      '/ext',
      () => false
    )

    expect(untitledContext.dirname).toBe(workspaceDir)
    expect(untitledContext.exportPath).toBe(path.resolve(workspaceDir, 'dist'))
    expect(untitledContext.resolveLocalAssetPath('styles/site.css')).toBe(path.resolve(workspaceDir, 'styles', 'site.css'))
    expect(untitledContext.getReferencedAssetPaths()).toContain(path.join(workspaceDir, 'init.js'))

    const virtualEditor = {
      document: {
        fileName: 'generated',
        uri: { scheme: 'git' },
        getText: jest.fn(() => '# slide'),
      },
      revealRange: jest.fn(),
      selection: undefined,
    }
    const virtualContext = new RevealContext(
      virtualEditor as unknown as TextEditor,
      logger as unknown as Logger,
      () => ({ ...defaultConfiguration, exportHTMLPath: 'dist' }),
      '/ext',
      () => false
    )

    expect(virtualContext.dirname).toBeNull()
    expect(virtualContext.resolveLocalAssetPath('styles/site.css')).toBeNull()
    expect(virtualContext.getReferencedAssetPaths()).toEqual([])
    expect(() => virtualContext.exportPath).toThrow('Cannot resolve a relative HTML export path for this virtual document')

    const absoluteExportPath = path.join(path.sep, 'tmp', 'virtual-export')
    virtualContext.configuration.exportHTMLPath = absoluteExportPath
    expect(virtualContext.exportPath).toBe(absoluteExportPath)
  })

  test('refresh updates configuration, updates position, goToSlide and lifecycle methods', () => {
    const editor = makeEditor()
    const context = new RevealContext(
      editor as unknown as TextEditor,
      logger as unknown as Logger,
      () => ({ ...defaultConfiguration, logLevel: LogLevel.Warning }),
      '/ext',
      () => false,
    )

    parseMock
      .mockReturnValueOnce({
        frontmatter: { attributes: { logLevel: LogLevel.Debug }, frontmatter: true, bodyBegin: 3 },
        slides: [{}, {}],
        parseError: undefined,
      })
      .mockReturnValueOnce({
        frontmatter: { attributes: { logLevel: LogLevel.Debug }, frontmatter: true, bodyBegin: 3 },
        slides: [{ verticalChildren: ['v'] }],
        parseError: undefined,
      })
      .mockReturnValueOnce({
        frontmatter: undefined,
        slides: [{}, { verticalChildren: [1, 2] }],
        parseError: undefined,
      })

    const refreshed = context.refresh()
    expect(refreshed.slides).toHaveLength(2)
    expect(mergeConfigMock).toHaveBeenCalled()
    expect(logger.LogLevel).toBe(LogLevel.Debug)

    context.refresh()
    expect(mergeConfigMock).toHaveBeenCalledTimes(1)

    context.updatePosition(new Position(2, 1))

    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(12345)
    expect(context.uriWithPosition).toBe(`${serverUri}#/1/2/12345`)
    nowSpy.mockRestore()

    context.slides = [{}, {}] as unknown as ISlide[]
    context.frontmatter = { frontmatter: true, bodyBegin: 4 } as unknown as FrontMatterResult<Configuration>
    context.goToSlide(1, 0)
    expect(countLinesToSlideMock).toHaveBeenCalledWith(context.slides, 1, 0)
    expect(editor.selection).toBeDefined()
    expect(editor.revealRange).toHaveBeenCalled()

    expect(context.is({ uri: editor.document.uri } as unknown as TextDocument)).toBe(true)
    expect(context.startServer()).toBe(serverUri)
    context.stopServer()
    expect(serverStopMock).toHaveBeenCalled()

    const onDispose = jest.fn()
    context.onDidDispose(onDispose)
    context.dispose()
    expect(onDispose).toHaveBeenCalled()
  })
})

describe('RevealContexts', () => {
  test('adds, reuses and removes contexts', () => {
    const logger = { info: jest.fn(), debug: jest.fn(), LogLevel: LogLevel.Error }
    const contexts = new RevealContexts(
      logger as unknown as Logger,
      () => defaultConfiguration,
      '/ext',
      () => false,
      () => {},
      () => {},
      () => {},
    )

    const editor = {
      document: {
        fileName: '/workspace/slides/main.md',
        uri: { scheme: 'file', toString: () => 'doc-uri' },
        getText: jest.fn(() => ''),
      },
      revealRange: jest.fn(),
    }

    const context = contexts.getOrAdd(editor as unknown as TextEditor)
    const sameContext = contexts.getOrAdd(editor as unknown as TextEditor)
    expect(context).toBe(sameContext)

    contexts.remove(editor.document.uri as unknown as Uri)
    expect(logger.info).toHaveBeenCalledWith('CONTEXT: doc-uri disposed')

    contexts.remove('unknown-uri' as unknown as Uri)
  })
})
