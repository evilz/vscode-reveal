import WebviewPane from "../../WebViewPane"
import {Event, WebviewPanel} from "vscode"

test('Set title of webviewpane', () => {

    const onDidDispose = jest.fn( ) as Event<void>
    const onDidReceiveMessage = jest.fn() as Event<unknown>
    const webviewPanel = {title: "test" , onDidDispose: onDidDispose, webview: { html: "", onDidReceiveMessage } }  as unknown as WebviewPanel 
    const pane = new WebviewPane( webviewPanel )
    pane.title = "new title"
  
    expect(webviewPanel.title).toBe("new title")
  })


  test('Dispose should trigger onDidDispose', () => {

    const onDidDispose = jest.fn( ) as Event<void>
    const onDidReceiveMessage = jest.fn() as Event<unknown>
    const dispose = jest.fn() as (()=>unknown)
    const webviewPanel = {title: "test" , onDidDispose: onDidDispose, dispose : dispose, webview: { html: "", onDidReceiveMessage } }  as unknown as WebviewPanel 
    const pane = new WebviewPane( webviewPanel )
  
    const onDidDisposeFn = jest.fn()
    pane.onDidDispose(onDidDisposeFn)

    pane.dispose()
    
    expect(onDidDispose).toHaveBeenCalledTimes(1)
    expect(onDidDisposeFn).toHaveBeenCalledTimes(1)
  })


  test('Update should trigger onDidUpdate', async () => {

    const onDidDispose = jest.fn( ) as Event<void>
    const onDidReceiveMessage = jest.fn() as Event<unknown>
    const dispose = jest.fn() as (()=> unknown)
    const webviewPanel = {title: "test" , onDidDispose: onDidDispose, dispose : dispose, webview: {html:"", onDidReceiveMessage} }  as unknown as WebviewPanel 
    const pane = new WebviewPane( webviewPanel )
    ;(global as unknown as { fetch: jest.Mock }).fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue('<html><head></head><body>hello</body></html>')
    })
  
    const onDidUpdate = jest.fn()
    pane.onDidUpdate(onDidUpdate)
    await pane.update("http://localhost:1234/#/1/2")
    
    expect(onDidUpdate).toHaveBeenCalledTimes(1)
  })

  test('Update should handle fetch errors', async () => {
    const onDidDispose = jest.fn( ) as Event<void>
    const onDidReceiveMessage = jest.fn() as Event<unknown>
    const dispose = jest.fn() as (()=> unknown)
    const webviewPanel = {title: "test" , onDidDispose: onDidDispose, dispose : dispose, webview: {html:"", onDidReceiveMessage} }  as unknown as WebviewPanel 
    const pane = new WebviewPane( webviewPanel )
    ;(global as unknown as { fetch: jest.Mock }).fetch = jest.fn().mockRejectedValue(new Error('network'))
  
    await expect(pane.update("http://localhost:1234/#/1/2")).resolves.toBeUndefined()
    expect(webviewPanel.webview.html).toBe("")
  })
