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

  await pane.update('http://localhost:1234/?print-pdf#/2/1', 42)

  expect(asWebviewUri).toHaveBeenCalled()
  expect(webviewPanel.webview.html).toContain('<base href="vscode-webview://remote/http://localhost:1234/?print-pdf">')
  expect(webviewPanel.webview.html).toContain("command: 'slideChanged'")
  expect(webviewPanel.webview.html).toContain("command: 'executeCodeBlock'")
  expect(webviewPanel.webview.html).toContain("event.metaKey || event.ctrlKey")
  expect(webviewPanel.webview.html).toContain("message.command === 'setSlide'")
  expect(webviewPanel.webview.html).toContain("origin = initializing ? 'initialization'")
  expect(webviewPanel.webview.html).toContain('window.location.hash.match(/#\\/(\\d+)')
  expect(webviewPanel.webview.html).toContain('window.location.hash = initialHash')
  expect(webviewPanel.webview.html).toContain("command: 'exportComplete'")
  expect(webviewPanel.webview.html).toContain('exportId: 42')
  const bridgeScript = /<script>([\s\S]+)<\/script>/.exec(webviewPanel.webview.html)?.[1]
  expect(() => new Function(bridgeScript ?? '')).not.toThrow()
})

test('Update ignores a superseded fetch that completes after a newer refresh', async () => {
  const onDidDispose = jest.fn() as Event<void>
  const onDidReceiveMessage = jest.fn() as Event<unknown>
  const webviewPanel = { title: 'test', onDidDispose, webview: { html: '', onDidReceiveMessage, asWebviewUri: (uri: { toString(): string }) => uri } } as unknown as WebviewPanel
  const pane = new WebviewPane(webviewPanel)
  let resolveFirst: (response: Response) => void = () => undefined
  let resolveSecond: (response: Response) => void = () => undefined
  const firstResponse = new Promise<Response>((resolve) => { resolveFirst = resolve })
  const secondResponse = new Promise<Response>((resolve) => { resolveSecond = resolve })
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => firstResponse).mockImplementationOnce(() => secondResponse)

  const firstUpdate = pane.update('http://localhost:1234/#/1')
  const secondUpdate = pane.update('http://localhost:1234/#/2')
  resolveSecond({ text: async () => '<html><head></head><body>new</body></html>' } as Response)
  await expect(secondUpdate).resolves.toBe(true)
  resolveFirst({ text: async () => '<html><head></head><body>old</body></html>' } as Response)
  await expect(firstUpdate).resolves.toBe(false)

  expect(webviewPanel.webview.html).toContain('new')
  expect(webviewPanel.webview.html).not.toContain('old')
})

test('Failed server render keeps the last valid webview HTML', async () => {
  const onDidDispose = jest.fn() as Event<void>
  const onDidReceiveMessage = jest.fn() as Event<unknown>
  const webview = { html: '<html>last valid</html>', onDidReceiveMessage, asWebviewUri: (uri: { toString(): string }) => uri }
  const webviewPanel = { title: 'test', onDidDispose, webview } as unknown as WebviewPanel
  const pane = new WebviewPane(webviewPanel)
  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: false,
    status: 500,
    statusText: 'Internal Server Error',
    text: async () => '<html>broken render</html>',
  } as Response)

  await expect(pane.update('http://localhost:1234/#/1/0')).rejects.toThrow('Preview server returned 500 Internal Server Error')
  expect(webview.html).toBe('<html>last valid</html>')
})

test('Set position navigates the existing webview without replacing its HTML', async () => {
  const onDidDispose = jest.fn() as Event<void>
  const onDidReceiveMessage = jest.fn() as Event<unknown>
  const postMessage = jest.fn().mockResolvedValue(true)
  const webview = { html: '<html>existing</html>', onDidReceiveMessage, postMessage, asWebviewUri: (uri: { toString(): string }) => uri }
  const webviewPanel = { title: 'test', onDidDispose, webview } as unknown as WebviewPanel
  const pane = new WebviewPane(webviewPanel)

  await expect(pane.setPosition({ horizontal: 2, vertical: 1, fragment: 3 })).resolves.toBe(true)

  expect(postMessage).toHaveBeenCalledWith({ command: 'setSlide', horizontal: 2, vertical: 1, fragment: 3 })
  expect(webview.html).toBe('<html>existing</html>')
})
