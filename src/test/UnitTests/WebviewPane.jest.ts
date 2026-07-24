import WebviewPane from '../../WebViewPane'
import { Event, WebviewPanel } from 'vscode'

afterEach(() => {
  jest.restoreAllMocks()
})


const mockFetch = (html: string) => {
  if (!global.fetch) {
    ;(global as unknown as { fetch: typeof fetch }).fetch = (() => Promise.resolve({ text: async () => '' } as unknown as Response)) as typeof fetch
  }

  return jest.spyOn(global, 'fetch').mockResolvedValue({
    text: jest.fn().mockResolvedValue(html),
  } as unknown as Response)
}

test('Set title of webviewpane', () => {
  const onDidDispose = jest.fn() as Event<void>
  const onDidReceiveMessage = jest.fn() as Event<unknown>
  const webviewPanel = { title: 'test', onDidDispose: onDidDispose, webview: { html: '', onDidReceiveMessage, asWebviewUri: (uri: { toString(): string }) => uri } } as unknown as WebviewPanel
  const pane = new WebviewPane(webviewPanel)
  pane.title = 'new title'

  expect(webviewPanel.title).toBe('new title')
})

test('Dispose should trigger onDidDispose', () => {
  const onDidDispose = jest.fn() as Event<void>
  const onDidReceiveMessage = jest.fn() as Event<unknown>
  const dispose = jest.fn() as () => unknown
  const webviewPanel = { title: 'test', onDidDispose: onDidDispose, dispose: dispose, webview: { html: '', onDidReceiveMessage, asWebviewUri: (uri: { toString(): string }) => uri } } as unknown as WebviewPanel
  const pane = new WebviewPane(webviewPanel)

  const onDidDisposeFn = jest.fn()
  pane.onDidDispose(onDidDisposeFn)

  pane.dispose()

  expect(onDidDispose).toHaveBeenCalledTimes(1)
  expect(onDidDisposeFn).toHaveBeenCalledTimes(1)
})

test('Update should trigger onDidUpdate', async () => {
  const onDidDispose = jest.fn() as Event<void>
  const onDidReceiveMessage = jest.fn() as Event<unknown>
  const dispose = jest.fn() as () => unknown
  const webviewPanel = { title: 'test', onDidDispose: onDidDispose, dispose: dispose, webview: { html: '', onDidReceiveMessage, asWebviewUri: (uri: { toString(): string }) => uri } } as unknown as WebviewPanel
  const pane = new WebviewPane(webviewPanel)
  mockFetch('<html><head></head><body>hello</body></html>')

  const onDidUpdate = jest.fn()
  pane.onDidUpdate(onDidUpdate)
  await pane.update('http://localhost:1234/#/1/2')

  expect(onDidUpdate).toHaveBeenCalledTimes(1)
})

test('Update injects bridge script for slide sync and preserves hash with query params', async () => {
  const onDidDispose = jest.fn() as Event<void>
  const onDidReceiveMessage = jest.fn() as Event<unknown>
  const asWebviewUri = jest.fn((uri: { path: string }) => ({ toString: () => `vscode-webview://remote/${uri.path}` }))
  const webviewPanel = { title: 'test', onDidDispose: onDidDispose, webview: { html: '', onDidReceiveMessage, asWebviewUri } } as unknown as WebviewPanel
  const pane = new WebviewPane(webviewPanel)

  mockFetch('<html><head></head><body><div>hello</div></body></html>')

  await pane.update('http://localhost:1234/?print-pdf#/2/1', true)

  expect(asWebviewUri).toHaveBeenCalled()
  expect(webviewPanel.webview.html).toContain('<base href="vscode-webview://remote/http://localhost:1234/?print-pdf">')
  expect(webviewPanel.webview.html).toContain("command: 'slideChanged'")
  expect(webviewPanel.webview.html).toContain("message.command === 'setSlide'")
  expect(webviewPanel.webview.html).toContain('window.location.hash = initialHash')
  expect(webviewPanel.webview.html).toContain("command: 'exportComplete'")
})
