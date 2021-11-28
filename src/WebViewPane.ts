import EventEmitter from "events"
import TypedEmitter from "typed-emitter"
import { WebviewPanel } from "vscode";

interface WebviewPaneEvents {
    disposed: () => void,
    updated: () => void
    
  }

export default class WebviewPane 
    extends (EventEmitter as new () => TypedEmitter<WebviewPaneEvents>){

    constructor(private webview:WebviewPanel) {
        super()
        this.webview.onDidDispose(() => { this.emit("disposed") })
    }
    

    public set title(title:string) {
        this.webview.title = title;
    }
    
    public update(url:string) {
        this.webview.webview.html = `
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


        this.emit("updated")
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
        const d = this.webview.dispose()
        this.emit("disposed")
        return d
    }
}