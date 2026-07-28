import { EventEmitter, Uri, WebviewPanel } from "vscode";
import { Disposable } from "./dispose";

export default class WebviewPane
    extends Disposable {

    #updateAbortController: AbortController | undefined
    #updateGeneration = 0

    constructor(private webviewPanel:WebviewPanel) {
        super()
        this.webviewPanel.onDidDispose(() => { this.dispose() })
        this._register(this.webviewPanel.webview.onDidReceiveMessage((message: unknown) => {
          this.#onDidReceiveMessage.fire(message)
        }))
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
    
    public async update(url:string, exportId?: number): Promise<boolean> {
        this.#updateAbortController?.abort()
        const abortController = new AbortController()
        this.#updateAbortController = abortController
        const generation = ++this.#updateGeneration
        const parsedUrl = new URL(url)
        const slideHash = parsedUrl.hash || '#/'
        parsedUrl.hash = ''

        try {
          const response = await fetch(parsedUrl.toString(), { signal: abortController.signal })
          const html = await response.text()
          if (abortController.signal.aborted || generation !== this.#updateGeneration) return false

          const webviewUri = this.webviewPanel.webview.asWebviewUri(Uri.parse(parsedUrl.toString())).toString()
          const htmlWithBase = this.injectBaseHref(html, webviewUri)
          this.webviewPanel.webview.html = this.injectBridgeScript(htmlWithBase, slideHash, exportId)
          this.#onDidUpdate.fire()
          return true
        } catch (error) {
          if (abortController.signal.aborted || generation !== this.#updateGeneration) return false
          throw error
        } finally {
          if (this.#updateAbortController === abortController) this.#updateAbortController = undefined
        }
    }

    private injectBaseHref(html: string, baseUrl: string) {
      const baseTag = `<base href="${baseUrl}">`
      const headMatch = /<head>/i.exec(html)
      if (headMatch) {
        return html.replace(headMatch[0], `${headMatch[0]}\n${baseTag}`)
      }
      return `${baseTag}${html}`
    }

    private injectBridgeScript(html: string, slideHash: string, exportId?: number) {
      const script = `
      <script>
        (function () {
          const vscode = acquireVsCodeApi();
          const initialHash = ${JSON.stringify(slideHash)};
          let activeCodeBlock = null;

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

          const findCodeBlock = (target) => {
            if (!(target instanceof Element)) return null;
            return target.closest('.codeblock, pre');
          };

          const getCurrentCodeBlock = () => {
            if (activeCodeBlock instanceof Element && document.contains(activeCodeBlock)) {
              return activeCodeBlock;
            }
            return document.querySelector('.slides section.present .codeblock, .slides section.present pre');
          };

          const executeCurrentCodeBlock = () => {
            const codeBlock = getCurrentCodeBlock();
            const code = codeBlock?.querySelector('code');
            const text = code?.textContent?.trim();
            if (!text) return;
            vscode.postMessage({
              command: 'executeCodeBlock',
              text,
            });
          };

          window.addEventListener('hashchange', postCurrentSlide);
          document.addEventListener('pointerdown', (event) => {
            activeCodeBlock = findCodeBlock(event.target);
          }, true);
          document.addEventListener('keydown', (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              executeCurrentCodeBlock();
              event.preventDefault();
            }
          });

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

          if (${typeof exportId === 'number'}) {
            const postExportComplete = () => {
              vscode.postMessage({ command: 'exportComplete', exportId: ${JSON.stringify(exportId)} });
            };

            if (document.readyState === 'complete') {
              postExportComplete();
            } else {
              window.addEventListener('load', postExportComplete, { once: true });
            }
          }
        }());
      </script>
      `

      if (html.includes('</body>')) {
        return html.replace('</body>', `${script}\n</body>`)
      }
      return `${html}\n${script}`
    }
  
    public dispose() {
        this.#updateAbortController?.abort()
        this.#onDidDispose.fire();
        super.dispose();
    }
}
