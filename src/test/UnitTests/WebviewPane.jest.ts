import WebviewPane from "../../WebViewPane"
import {Event, WebviewPanel} from "vscode"

test('Set title of webviewpane', () => {

    const onDidDispose = jest.fn( ) as Event<void>
    const webviewPanel = {title: "test" , onDidDispose: onDidDispose  }  as WebviewPanel 
    const pane = new WebviewPane( webviewPanel )
    pane.title = "new title"
  
    expect(webviewPanel.title).toBe("new title")
  })


  test('Dispose should trigger onDidDispose', () => {

    const onDidDispose = jest.fn( ) as Event<void>
    const dispose = jest.fn() as (()=>unknown)
    const webviewPanel = {title: "test" , onDidDispose: onDidDispose, dispose : dispose }  as WebviewPanel 
    const pane = new WebviewPane( webviewPanel )
  
    const onDidDisposeFn = jest.fn()
    pane.onDidDispose(onDidDisposeFn)

    pane.dispose()
    
    expect(onDidDispose).toHaveBeenCalledTimes(1)
    expect(onDidDisposeFn).toHaveBeenCalledTimes(1)
  })


  test('Update should trigger onDidUpdate', () => {

    const onDidDispose = jest.fn( ) as Event<void>
    const dispose = jest.fn() as (()=> unknown)
    const webviewPanel = {title: "test" , onDidDispose: onDidDispose, dispose : dispose, webview: {html:""} }  as WebviewPanel 
    const pane = new WebviewPane( webviewPanel )
  
    const onDidUpdate = jest.fn()
    pane.onDidUpdate(onDidUpdate)
    pane.update("some uri")
    
    expect(onDidUpdate).toHaveBeenCalledTimes(1)
  })