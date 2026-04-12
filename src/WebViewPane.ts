import { EventEmitter, WebviewPanel } from "vscode";
import { Disposable } from "./dispose";

export default class WebviewPane
    extends Disposable {

    constructor(private webviewPanel:WebviewPanel) {
        super()
        this.webviewPanel.onDidDispose(() => { this.dispose() })
        this.webviewPanel.webview.onDidReceiveMessage((message: unknown) => {
          this.#onDidReceiveMessage.fire(message)
        })
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

    readonly #onDidReceiveMessage = this._register(new EventEmitter<unknown>());
	/**
	 * Fired when a message is received from the webview.
	 */
	public readonly onDidReceiveMessage = this.#onDidReceiveMessage.event;


    /** Set title of web pane */
    public set title(title:string) {
        this.webviewPanel.title = title;
    }
    
    public async update(url:string) {
        const parsedUrl = new URL(url)
        const slideHash = parsedUrl.hash || '#/'
        parsedUrl.hash = ''

        const response = await fetch(parsedUrl.toString())
        const html = await response.text()
        const htmlWithBase = this.injectBaseHref(html, parsedUrl.toString())
        this.webviewPanel.webview.html = this.injectBridgeScript(htmlWithBase, slideHash)
        this.#onDidUpdate.fire()
    }

    private injectBaseHref(html: string, baseUrl: string) {
      const baseTag = `<base href="${baseUrl}">`
      if (html.includes('<head>')) {
        return html.replace('<head>', `<head>\n${baseTag}`)
      }
      return `${baseTag}${html}`
    }

    private injectBridgeScript(html: string, slideHash: string) {
      const script = `
      <script>
        (function () {
          const vscode = acquireVsCodeApi();
          const initialHash = ${JSON.stringify(slideHash)};

          const postCurrentSlide = () => {
            const match = window.location.hash.match(/#\\/(\\d+)\\/(\\d+)/);
            if (!match) return;
            vscode.postMessage({
              command: 'slideChanged',
              horizontal: Number(match[1]),
              vertical: Number(match[2]),
              hash: window.location.hash,
            });
          };

          window.addEventListener('hashchange', postCurrentSlide);

          if (window.Reveal && typeof window.Reveal.on === 'function') {
            window.Reveal.on('slidechanged', postCurrentSlide);
          }

          window.addEventListener('message', (event) => {
            const message = event.data;
            if (message && message.command === 'setSlide' && typeof message.hash === 'string') {
              window.location.hash = message.hash;
            }
          });

          if (initialHash) {
            window.location.hash = initialHash;
          }

          setTimeout(postCurrentSlide, 0);
        }());
      </script>
      `

      if (html.includes('</body>')) {
        return html.replace('</body>', `${script}\n</body>`)
      }
      return `${html}\n${script}`
    }
  
    public dispose() {
        this.#onDidDispose.fire();
        super.dispose();
    }
}
