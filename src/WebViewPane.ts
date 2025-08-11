import { EventEmitter, WebviewPanel } from "vscode";
import { Disposable } from "./dispose";

export default class WebviewPane
    extends Disposable {

    constructor(private webviewPanel:WebviewPanel) {
        super()
        this.webviewPanel.onDidDispose(() => { this.dispose() })
    }

    readonly #onDidDispose = this._register(new EventEmitter<void>());
	/**
	 * Fired when the WebView is disposed.
	 */
	public readonly onDidDispose = this.#onDidDispose.event;

    readonly #onDidUpdate = this._register(new EventEmitter<void>());
	/**
	 * Fired when the WebView is update.
	 */
	public readonly onDidUpdate = this.#onDidUpdate.event;


    /** Set title of web pane */
    public set title(title:string) {
        this.webviewPanel.title = title;
    }
    
    public update(url:string) {
        this.webviewPanel.webview.html = `
        <!doctype html>
        <html lang="en">
        <head>
              <style>html, body, iframe { height: 100% }</style>
        </head>
        <body>
              <iframe id="revealIframe" src="${url}" frameBorder="0" style="width: 100%; height: 100%" />
        </body>
        </html>
              `;


        this.#onDidUpdate.fire()
    }
 // Code without iframe
      // const uri = this.getUri(false)
      // if (uri !== null) {
      //   http.get(uri, (res) => {
      //     res.setEncoding('utf8')
      //     let body = ''
      //     res.on('data', (data) => {
      //       body += data
      //     })
      //     res.on('end', () => {
      //       if (this.webviewPanel) {
      //         this.webviewPanel.webview.html = body
      //       }
      //     })
      //   })
      // }

      // Handle messages from the webview
      // this.webviewPanel.webview.onDidReceiveMessage((message) => {
      //   switch (message.command) {
      //     case 'getSlides':
      //       window.showInformationMessage(message.text)
      //       window.showInformationMessage(message.slides.length.toString())
      //       return
      //   }
      // }, null)
  
    public dispose() {
        this.#onDidDispose.fire();
        super.dispose();
    }
}