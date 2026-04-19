import MainController from '../../MainController'
import Logger, { LogLevel } from '../../Logger'
import { defaultConfiguration } from '../../Configuration'
import { SHOW_REVEALJS } from '../../commands/showRevealJS'

const executeCommandMock = jest.fn()
const diagnosticDeleteMock = jest.fn()
const diagnosticSetMock = jest.fn()
const createDiagnosticCollectionMock = jest.fn(() => ({
  delete: diagnosticDeleteMock,
  set: diagnosticSetMock,
  clear: jest.fn(),
  dispose: jest.fn(),
}))

const watchers: Array<{ dispose: jest.Mock; onDidChange: jest.Mock; onDidCreate: jest.Mock; onDidDelete: jest.Mock }> = []
const createFileSystemWatcherMock = jest.fn(() => {
  const w = {
    dispose: jest.fn(),
    onDidChange: jest.fn(),
    onDidCreate: jest.fn(),
    onDidDelete: jest.fn(),
  }
  watchers.push(w)
  return w
})
const createWebviewPanelMock = jest.fn(() => ({}))

jest.mock('vscode', () => ({
  commands: { executeCommand: (...args: unknown[]) => (executeCommandMock as any)(...args) },
  languages: { createDiagnosticCollection: (name: unknown) => (createDiagnosticCollectionMock as any)(name) },
  workspace: { createFileSystemWatcher: (pattern: unknown, a: unknown, b: unknown, c: unknown) => (createFileSystemWatcherMock as any)(pattern, a, b, c) },
  window: { createWebviewPanel: (viewType: unknown, title: unknown, column: unknown, options: unknown) => (createWebviewPanelMock as any)(viewType, title, column, options) },
  RelativePattern: class RelativePattern {
    constructor(public base: string, public pattern: string) { }
  },
  ViewColumn: { Beside: 2 },
}))

const removeAsyncMock = jest.fn(() => Promise.resolve())
jest.mock('fs-jetpack', () => ({
  removeAsync: (target: unknown) => (removeAsyncMock as any)(target),
}))

const collectDiagnosticsMock = jest.fn(async () => [])
jest.mock('../../FrontmatterDiagnostics', () => ({
  collectDiagnostics: (context: unknown, configByKey: unknown) => (collectDiagnosticsMock as any)(context, configByKey),
}))

const getConfigMock = jest.fn(() => defaultConfiguration)
jest.mock('../../Configuration', () => {
  const real = jest.requireActual('../../Configuration')
  return {
    ...real,
    getConfig: () => getConfigMock(),
  }
})

const slideExplorerUpdateMock = jest.fn()
const slideExplorerRegisterMock = jest.fn()
const slideExplorerOnDidChangeTreeDataMock = jest.fn()
const slideExplorerSlidesGetterMock = jest.fn()
jest.mock('../../SlideExplorer', () => ({
  SlideTreeProvider: jest.fn().mockImplementation((slidesGetter: () => unknown[]) => {
    slideExplorerSlidesGetterMock.mockImplementation(slidesGetter)
    return {
      register: slideExplorerRegisterMock,
      onDidChangeTreeData: slideExplorerOnDidChangeTreeDataMock,
      update: slideExplorerUpdateMock,
    }
  }),
}))

const statusBarUpdateCountMock = jest.fn()
jest.mock('../../StatusBarController', () => ({
  StatusBarController: jest.fn().mockImplementation(() => ({
    updateCount: statusBarUpdateCountMock,
  })),
}))

const textDecoratorUpdateMock = jest.fn()
jest.mock('../../TextDecorator', () => jest.fn().mockImplementation(() => ({
  update: textDecoratorUpdateMock,
})))

const revealContextsGetOrAddMock = jest.fn()
const revealContextsRemoveMock = jest.fn()
const revealContextsCtorMock = jest.fn()
jest.mock('../../RevealContext', () => ({
  RevealContexts: jest.fn().mockImplementation((...args: unknown[]) => {
    revealContextsCtorMock(...args)
    return {
      getOrAdd: (...getArgs: unknown[]) => (revealContextsGetOrAddMock as any)(...getArgs),
      remove: (...removeArgs: unknown[]) => (revealContextsRemoveMock as any)(...removeArgs),
    }
  }),
}))

let receiveMessageListener: ((message: unknown) => void) | undefined
let disposeListener: (() => void) | undefined
const webViewPaneUpdateMock = jest.fn(() => Promise.resolve())
const webViewPaneCtorMock = jest.fn()
const goToSlideFromPaneMock = jest.fn()

jest.mock('../../WebViewPane', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    const pane = {
      title: '',
      onDidReceiveMessage: (cb: (message: unknown) => void) => {
        receiveMessageListener = cb
      },
      onDidDispose: (cb: () => void) => {
        disposeListener = cb
      },
      update: (uri: unknown, isExport: unknown) => (webViewPaneUpdateMock as any)(uri, isExport),
    }
    webViewPaneCtorMock()
    return pane
  }),
}))

const logger = new Logger(jest.fn(), LogLevel.Debug)

const editor = {
  document: { languageId: 'markdown', fileName: 'slides.md', uri: 'doc-uri' },
  selection: { active: { line: 0, character: 0 } },
  selections: [],
}

const makeContext = () => ({
  baseUri: '/base',
  exportPath: '/tmp/export',
  configuration: { ...defaultConfiguration, title: 'Deck', openFilemanagerAfterHTMLExport: true },
  uriWithPosition: 'http://localhost:1948/#/1',
  editor,
  slides: [{}, {}],
  frontmatter: {},
  is: jest.fn(() => true),
  refresh: jest.fn(() => ({ slides: [{}, {}] })),
  getReferencedAssetPaths: jest.fn(() => ['/assets/a.png']),
  updatePosition: jest.fn(),
  goToSlide: goToSlideFromPaneMock,
  startServer: jest.fn(),
  stopServer: jest.fn(),
})

describe('MainController coverage', () => {
  const flush = async () => {
    await Promise.resolve()
    await Promise.resolve()
  }

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    watchers.length = 0
    receiveMessageListener = undefined
    disposeListener = undefined
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('event handlers update and refresh context for markdown editor', () => {
    const context = makeContext()
    revealContextsGetOrAddMock.mockReturnValue(context)
    const main = new MainController(logger, { extensionPath: '/ext' } as any, [], defaultConfiguration, undefined)

    main.onDidChangeActiveTextEditor(editor as any)
    main.onDidChangeTextEditorSelection({ textEditor: editor, selections: [{ active: { line: 3, character: 1 } }] } as any)
    main.onDidChangeTextEditorSelection({ textEditor: editor, selections: [] } as any)

    expect(context.updatePosition).toHaveBeenCalled()
    jest.runOnlyPendingTimers()

    return flush().then(() => {
      expect(context.refresh).toHaveBeenCalled()
      expect(slideExplorerUpdateMock).toHaveBeenCalled()
      expect(statusBarUpdateCountMock).toHaveBeenCalledWith(2)
      expect(textDecoratorUpdateMock).toHaveBeenCalledWith(editor)
      expect(diagnosticSetMock).toHaveBeenCalledWith('doc-uri', [])
    })
  })

  test('ignores non-markdown and unrelated document changes', () => {
    const context = makeContext()
    context.is.mockReturnValue(false)
    revealContextsGetOrAddMock.mockReturnValue(context)
    const main = new MainController(logger, { extensionPath: '/ext' } as any, [], defaultConfiguration, undefined)

    main.onDidChangeActiveTextEditor({ ...editor, document: { ...editor.document, languageId: 'plaintext' } } as any)
    main.onDidChangeTextDocument({ document: editor.document } as any)
    main.onDidSaveTextDocument(editor.document as any)

    expect(context.refresh).not.toHaveBeenCalled()
  })

  test('configuration change updates config only for reveal prefix', () => {
    const main = new MainController(logger, { extensionPath: '/ext' } as any, [], defaultConfiguration, undefined)
    main.onDidChangeConfiguration({ affectsConfiguration: () => false } as any)
    main.onDidChangeConfiguration({ affectsConfiguration: () => true } as any)
    expect(getConfigMock).toHaveBeenCalledTimes(1)
  })

  test('closing active document clears state and watchers', () => {
    const context = makeContext()
    revealContextsGetOrAddMock.mockReturnValue(context)
    const main = new MainController(logger, { extensionPath: '/ext' } as any, [], defaultConfiguration, editor as any)

    ;(main as any).syncAssetWatchers()
    expect(watchers).toHaveLength(1)
    context.getReferencedAssetPaths.mockReturnValue([])

    main.onDidCloseTextDocument(editor.document as any)

    expect(diagnosticDeleteMock).toHaveBeenCalledWith('doc-uri')
    expect(revealContextsRemoveMock).toHaveBeenCalledWith('doc-uri')
    expect(watchers[0].dispose).toHaveBeenCalled()
    expect(main.currentContext).toBeUndefined()
  })

  test('showWebViewPane handles panel reuse and message events', async () => {
    const context = makeContext()
    revealContextsGetOrAddMock.mockReturnValue(context)
    const main = new MainController(logger, { extensionPath: '/ext' } as any, [], defaultConfiguration, editor as any)

    expect(main.showWebViewPane()).toBe(true)
    expect(main.showWebViewPane()).toBe(false)
    expect(webViewPaneCtorMock).toHaveBeenCalledTimes(1)

    receiveMessageListener?.(null)
    receiveMessageListener?.({ command: 'noop' })
    receiveMessageListener?.({ command: 'slideChanged', horizontal: 'x', vertical: 1 })
    receiveMessageListener?.({ command: 'slideChanged', horizontal: 2, vertical: 1 })
    expect(goToSlideFromPaneMock).toHaveBeenCalledWith(2, 1)

    const exportPromise = main.exportAsync()
    await flush()
    receiveMessageListener?.({ command: 'exportComplete' })
    await expect(exportPromise).resolves.toBe('/tmp/export')

    disposeListener?.()
    expect((main as any).webViewPane).toBeUndefined()
  })

  test('exportAsync error and interruption paths, plus helper methods', async () => {
    const context = makeContext()
    revealContextsGetOrAddMock.mockReturnValue(context)
    const main = new MainController(logger, { extensionPath: '/ext' } as any, [], defaultConfiguration, editor as any)

    expect(main.shouldOpenFilemanagerAfterHTMLExport()).toBe(true)
    main.startServer()
    main.stopServer()
    expect(context.startServer).toHaveBeenCalled()
    expect(context.stopServer).toHaveBeenCalled()

    const first = main.exportAsync()
    await flush()
    const second = main.exportAsync()
    await flush()
    await expect(first).rejects.toThrow('interrupted by a new export request')

    ;(main as any).onExportError('boom')
    await expect(second).rejects.toThrow('HTML export failed: boom')

    const noContextMain = new MainController(logger, { extensionPath: '/ext' } as any, [], defaultConfiguration, undefined)
    expect(noContextMain.baseUri).toBeUndefined()
    expect(noContextMain.shouldOpenFilemanagerAfterHTMLExport()).toBe(false)
    ;(noContextMain as any).onExportError(new Error('ignored'))
    await expect(noContextMain.exportAsync()).rejects.toThrow('No active markdown context to export')
  })

  test('asset watcher callbacks trigger quick refresh and goToSlide/updatePosition no-op when context missing', () => {
    const context = makeContext()
    revealContextsGetOrAddMock.mockReturnValue(context)
    const main = new MainController(logger, { extensionPath: '/ext' } as any, [], defaultConfiguration, editor as any)

    ;(main as any).syncAssetWatchers()
    const changeCb = watchers[0].onDidChange.mock.calls[0][0]
    const createCb = watchers[0].onDidCreate.mock.calls[0][0]
    const deleteCb = watchers[0].onDidDelete.mock.calls[0][0]
    changeCb()
    createCb()
    deleteCb()
    jest.runOnlyPendingTimers()
    expect(context.refresh).toHaveBeenCalled()

    main.goToSlide(1, 2)
    expect(goToSlideFromPaneMock).toHaveBeenCalledWith(1, 2)

    main.onDidCloseTextDocument(editor.document as any)
    main.updatePosition({ line: 1, character: 1 } as any)
    main.goToSlide(9, 9)
    expect(goToSlideFromPaneMock).toHaveBeenCalledTimes(1)
  })

  test('exportAsync opens reveal command when pane does not exist', async () => {
    const context = makeContext()
    revealContextsGetOrAddMock.mockReturnValue(context)
    const main = new MainController(logger, { extensionPath: '/ext' } as any, [], defaultConfiguration, editor as any)

    const promise = main.exportAsync()
    await flush()
    expect(executeCommandMock).toHaveBeenCalledWith(SHOW_REVEALJS)
    ;(main as any).onExportError(new Error('fail'))
    await expect(promise).rejects.toThrow('HTML export failed: fail')
  })

  test('change and save document refresh when context matches, plus tree callback logging path', async () => {
    const context = makeContext()
    revealContextsGetOrAddMock.mockReturnValue(context)
    const main = new MainController(logger, { extensionPath: '/ext' } as any, [], defaultConfiguration, editor as any)

    const treeCallback = slideExplorerOnDidChangeTreeDataMock.mock.calls[0][0]
    treeCallback()

    main.onDidChangeTextDocument({ document: editor.document } as any)
    main.onDidSaveTextDocument(editor.document as any)
    jest.runOnlyPendingTimers()
    await flush()

    expect(context.refresh).toHaveBeenCalled()
  })

  test('calls injected config getter and logError helper branch', () => {
    const main = new MainController(logger, { extensionPath: '/ext' } as any, [], defaultConfiguration, undefined)
    const getConfigFn = revealContextsCtorMock.mock.calls[0][1] as () => unknown
    expect(getConfigFn()).toBe(defaultConfiguration)
    ;(main as any).logError('webview', 'failed')
  })

  test('covers remaining guard branches for refresh and message parsing', () => {
    const context = makeContext()
    revealContextsGetOrAddMock.mockReturnValue(context)
    const main = new MainController(logger, { extensionPath: '/ext' } as any, [], defaultConfiguration, editor as any)

    expect(slideExplorerSlidesGetterMock()).toEqual(context.slides)
    main.onDidCloseTextDocument(editor.document as any)
    expect(slideExplorerSlidesGetterMock()).toEqual([])

    main.refresh()

    const activeMain = new MainController(logger, { extensionPath: '/ext' } as any, [], defaultConfiguration, editor as any)
    activeMain.refresh(1)
    activeMain.onDidCloseTextDocument(editor.document as any)
    jest.runOnlyPendingTimers()

    activeMain.showWebViewPane()
    receiveMessageListener?.({})
    receiveMessageListener?.({ command: 'exportComplete' })
    receiveMessageListener?.({ command: 'slideChanged', vertical: 1 })
    receiveMessageListener?.({ command: 'slideChanged', horizontal: 1 })
    disposeListener?.()
  })
})
