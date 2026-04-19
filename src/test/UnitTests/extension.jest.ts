const SHOW_REVEALJS = 'test.showRevealJS'
const SHOW_REVEALJS_IN_BROWSER = 'test.showInBrowser'
const SHOW_REVEALJS_PRESENTER_VIEW = 'test.presenterView'
const STOP_REVEALJS_SERVER = 'test.stopServer'
const SHOW_SAMPLE = 'test.showSample'
const NEW_PRESENTATION = 'test.newPresentation'
const GO_TO_SLIDE = 'test.goToSlide'
const EXPORT_PDF = 'test.exportPdf'
const EXPORT_HTML = 'test.exportHtml'

const createOutputChannelMock = jest.fn(() => ({ appendLine: jest.fn() }))
const executeCommandMock = jest.fn()
const registerCommandMock = jest.fn((name: string, callback: (...args: unknown[]) => unknown) => ({ name, callback, dispose: jest.fn() }))
const onDidChangeTextEditorSelectionMock = jest.fn(() => ({ dispose: jest.fn() }))
const onDidChangeActiveTextEditorMock = jest.fn(() => ({ dispose: jest.fn() }))
const onDidChangeTextDocumentMock = jest.fn(() => ({ dispose: jest.fn() }))
const onDidSaveTextDocumentMock = jest.fn(() => ({ dispose: jest.fn() }))
const onDidCloseTextDocumentMock = jest.fn(() => ({ dispose: jest.fn() }))
const onDidChangeConfigurationMock = jest.fn(() => ({ dispose: jest.fn() }))

const showRevealJSInBrowserMock = jest.fn(() => jest.fn())
const showRevealJSPresenterViewMock = jest.fn(() => jest.fn())
const exportPDFMock = jest.fn(() => jest.fn())
const exportHTMLMock = jest.fn(() => jest.fn())
const showSampleMock = jest.fn()
const createPresentationFromTemplateMock = jest.fn()
const languageCompletionMock = jest.fn(() => [{ dispose: jest.fn() }])

const getConfigMock = jest.fn(() => ({ logLevel: 2, slideExplorerEnabled: true }))
const getConfigurationDescriptionMock = jest.fn(() => ['config-desc'])

const mainControllerInstance = {
  currentContext: {
    startServer: jest.fn(() => 'http://localhost:1948'),
    configuration: { browserPath: '/custom/browser' },
  },
  showWebViewPane: jest.fn(),
  stopServer: jest.fn(),
  goToSlide: jest.fn(),
  onDidChangeTextEditorSelection: jest.fn(),
  onDidChangeActiveTextEditor: jest.fn(),
  onDidChangeTextDocument: jest.fn(),
  onDidSaveTextDocument: jest.fn(),
  onDidCloseTextDocument: jest.fn(),
  onDidChangeConfiguration: jest.fn(),
  refresh: jest.fn(),
  exportAsync: jest.fn(),
  shouldOpenFilemanagerAfterHTMLExport: jest.fn(() => true),
}

const MainControllerMock = jest.fn(() => mainControllerInstance)

jest.mock('vscode', () => ({
  commands: {
    executeCommand: (command: string, ...rest: unknown[]) => (executeCommandMock as any)(command, ...rest),
    registerCommand: (name: string, callback: (...args: unknown[]) => unknown) => (registerCommandMock as any)(name, callback),
  },
  window: {
    createOutputChannel: (name: string) => (createOutputChannelMock as any)(name),
    activeTextEditor: undefined,
    onDidChangeTextEditorSelection: (listener: unknown) => (onDidChangeTextEditorSelectionMock as any)(listener),
    onDidChangeActiveTextEditor: (listener: unknown) => (onDidChangeActiveTextEditorMock as any)(listener),
  },
  workspace: {
    onDidChangeTextDocument: (listener: unknown) => (onDidChangeTextDocumentMock as any)(listener),
    onDidSaveTextDocument: (listener: unknown) => (onDidSaveTextDocumentMock as any)(listener),
    onDidCloseTextDocument: (listener: unknown) => (onDidCloseTextDocumentMock as any)(listener),
    onDidChangeConfiguration: (listener: unknown) => (onDidChangeConfigurationMock as any)(listener),
  },
}))

jest.mock('../../commands/showRevealJS', () => ({
  SHOW_REVEALJS,
}))

jest.mock('../../commands/showRevealJSInBrowser', () => ({
  SHOW_REVEALJS_IN_BROWSER,
  SHOW_REVEALJS_PRESENTER_VIEW,
  showRevealJSInBrowser: (startServer: unknown, getBrowserPath: unknown) => (showRevealJSInBrowserMock as any)(startServer, getBrowserPath),
  showRevealJSPresenterView: (startServer: unknown, getBrowserPath: unknown) => (showRevealJSPresenterViewMock as any)(startServer, getBrowserPath),
}))

jest.mock('../../commands/stopRevealJSServer', () => ({
  STOP_REVEALJS_SERVER,
}))

jest.mock('../../commands/goToSlide', () => ({
  GO_TO_SLIDE,
}))

jest.mock('../../commands/exportPDF', () => ({
  EXPORT_PDF,
  exportPDF: (startServer: unknown, getBrowserPath: unknown) => (exportPDFMock as any)(startServer, getBrowserPath),
}))

jest.mock('../../commands/exportHTML', () => ({
  EXPORT_HTML,
  exportHTML: (logger: unknown, exportAsync: unknown, shouldOpen: unknown) => (exportHTMLMock as any)(logger, exportAsync, shouldOpen),
}))

jest.mock('../../commands/showSample', () => ({
  SHOW_SAMPLE,
  showSample: (...args: unknown[]) => showSampleMock(...args),
}))

jest.mock('../../commands/newPresentation', () => ({
  NEW_PRESENTATION,
  createPresentationFromTemplate: (...args: unknown[]) => createPresentationFromTemplateMock(...args),
}))

jest.mock('../../CompletionItemProvider', () => ({
  __esModule: true,
  default: (configDesc: unknown) => (languageCompletionMock as any)(configDesc),
}))

jest.mock('../../MainController', () => ({
  __esModule: true,
  default: function (logger: unknown, context: unknown, configDesc: unknown, config: unknown, editor: unknown) {
    return (MainControllerMock as any)(logger, context, configDesc, config, editor)
  },
}))

jest.mock('../../Configuration', () => ({
  getConfig: () => (getConfigMock as any)(),
  getConfigurationDescription: (properties: unknown) => (getConfigurationDescriptionMock as any)(properties),
}))

import { activate } from '../../extension'

describe('extension activate', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('registers commands, subscriptions and refresh timer', () => {
    const context = {
      extension: {
        packageJSON: {
          displayName: 'RevealJS',
          contributes: { configuration: { properties: {} } },
        },
      },
      extensionPath: '/tmp/extension',
      subscriptions: [],
    }

    activate(context as any)

    expect(createOutputChannelMock).toHaveBeenCalledWith('RevealJS')
    expect(MainControllerMock).toHaveBeenCalled()
    expect(executeCommandMock).toHaveBeenCalledWith('setContext', 'slideExplorerEnabled', true)

    expect(registerCommandMock).toHaveBeenCalledWith(SHOW_REVEALJS, expect.any(Function))
    expect(registerCommandMock).toHaveBeenCalledWith(SHOW_REVEALJS_IN_BROWSER, expect.any(Function))
    expect(registerCommandMock).toHaveBeenCalledWith(SHOW_REVEALJS_PRESENTER_VIEW, expect.any(Function))
    expect(registerCommandMock).toHaveBeenCalledWith(STOP_REVEALJS_SERVER, expect.any(Function))
    expect(registerCommandMock).toHaveBeenCalledWith(SHOW_SAMPLE, expect.any(Function))
    expect(registerCommandMock).toHaveBeenCalledWith(NEW_PRESENTATION, expect.any(Function))
    expect(registerCommandMock).toHaveBeenCalledWith(GO_TO_SLIDE, expect.any(Function))
    expect(registerCommandMock).toHaveBeenCalledWith(EXPORT_PDF, expect.any(Function))
    expect(registerCommandMock).toHaveBeenCalledWith(EXPORT_HTML, expect.any(Function))

    jest.advanceTimersByTime(500)
    expect(mainControllerInstance.refresh).toHaveBeenCalledWith(0)
    expect((context as any).subscriptions.length).toBeGreaterThan(0)
  })
})
