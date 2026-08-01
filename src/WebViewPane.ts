import { EventEmitter, Uri, WebviewPanel } from "vscode";
import { Disposable } from "./dispose";
import type { ISlidePosition } from "./RevealContext";

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

    public setPosition(position: Readonly<ISlidePosition>) {
        return this.webviewPanel.webview.postMessage({
          command: 'setSlide',
          horizontal: position.horizontal,
          vertical: position.vertical,
          fragment: position.fragment,
        })
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
          if (response.ok === false) {
            throw new Error(`Preview server returned ${response.status} ${response.statusText}`.trim())
          }
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
           let initializing = true;
           let requestedPosition = null;
           let userInteractionUntil = 0;

           const readPosition = () => {
             if (window.Reveal && typeof window.Reveal.getIndices === 'function') {
               const indices = window.Reveal.getIndices();
               return {
                 horizontal: Number(indices.h || 0),
                 vertical: Number(indices.v || 0),
                 fragment: Number.isFinite(indices.f) ? Number(indices.f) : -1,
               };
             }

             const match = window.location.hash.match(/#\\/(\\d+)(?:\\/(\\d+))?(?:\\/(-?\\d+))?/);
             if (!match) return null;
             return {
               horizontal: Number(match[1]),
               vertical: Number(match[2] || 0),
               fragment: match[3] === undefined ? -1 : Number(match[3]),
             };
           };

           const markUserInteraction = () => {
             userInteractionUntil = performance.now() + 1000;
           };

           const postCurrentSlide = () => {
             const position = readPosition();
             if (!position) return;
             const matchesRequest = requestedPosition
               && requestedPosition.horizontal === position.horizontal
               && requestedPosition.vertical === position.vertical
               && (requestedPosition.fragment < 0 || requestedPosition.fragment === position.fragment);
             const origin = initializing ? 'initialization' : matchesRequest ? 'editor' : performance.now() <= userInteractionUntil ? 'user' : 'automatic';
             if (matchesRequest) requestedPosition = null;
             vscode.postMessage({
               command: 'slideChanged',
               ...position,
               origin,
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
             markUserInteraction();
             activeCodeBlock = findCodeBlock(event.target);
           }, true);
           document.addEventListener('keydown', (event) => {
             markUserInteraction();
             if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              executeCurrentCodeBlock();
              event.preventDefault();
             }
           });
           document.addEventListener('wheel', markUserInteraction, { capture: true, passive: true });
           document.addEventListener('touchstart', markUserInteraction, { capture: true, passive: true });

           if (window.Reveal && typeof window.Reveal.on === 'function') {
             window.Reveal.on('slidechanged', postCurrentSlide);
             window.Reveal.on('fragmentshown', postCurrentSlide);
             window.Reveal.on('fragmenthidden', postCurrentSlide);
           }

          window.addEventListener('message', (event) => {
            const message = event.data;
             if (message && message.command === 'setSlide') {
               requestedPosition = {
                 horizontal: Number(message.horizontal || 0),
                 vertical: Number(message.vertical || 0),
                 fragment: Number.isFinite(message.fragment) ? Number(message.fragment) : -1,
               };
               const fragmentHash = requestedPosition.fragment >= 0 ? '/' + requestedPosition.fragment : '';
               window.location.hash = '#/' + requestedPosition.horizontal + '/' + requestedPosition.vertical + fragmentHash;
             }
           });

          if (initialHash) {
            window.location.hash = initialHash;
          }

           setTimeout(() => {
             postCurrentSlide();
             initializing = false;
           }, 0);

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
