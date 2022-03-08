import * as http from 'http'
import Koa from 'koa'
import cors from '@koa/cors'
import render from 'koa-ejs'
import koalogger from 'koa-logger'
import serve from 'koa-static-server'
import * as path from 'path'

import markdownit from './Markdown-it'

import { Configuration } from './Configuration'
import { exportHTML, IExportOptions } from './ExportHTML'
import { ISlide } from './ISlide'
import Logger from './Logger'
import {EventEmitter} from "vscode"
import {Disposable} from './dispose'

/** Http server to serve reveal presentation */
export class RevealServer extends Disposable{
  public readonly app = new Koa()
  private server: http.Server | null = null
  private readonly host = 'localhost'

  constructor(
    private readonly logger: Logger,
    private readonly getRootDir: () => string,
    private readonly getSlides: () => ISlide[],
    private readonly getConfiguration: () => Configuration,
    private readonly extensionPath: string,
    private readonly isInExport: () => boolean,
    private readonly getExportPath: () => string
  ) {
    super()
    this.configure()
  }

  readonly #onDidError = this._register(new EventEmitter<Error>());
	/**
	 * Fired when the server got an error.
	 */
	public readonly onDidError = this.#onDidError.event;

  readonly #onDidStart = this._register(new EventEmitter<string>());
	/**
	 * Fired when the server did start and send uri.
	 */
	public readonly onDidStart = this.#onDidStart.event;

  public start() {
    try {
      if (!this.isListening && this.getRootDir()) {
        this.server = this.app.listen(0)
        this.#onDidStart.fire(this.uri)
        return this.uri
      }
    } catch (err) {
      const error = new Error(`Cannot start server: ${err}`)
      this.#onDidError.fire(error)
      throw error
    }
  }
 
  /** True if server is currently listening*/
  public get isListening() {
    return this.server ? this.server.listening : false
  }

  readonly #onDidStop = this._register(new EventEmitter<void>());
	/** Fired when the server did stop. */
	public readonly onDidStop = this.#onDidStop.event;

  /** Stop listening */
  stop(): void {
    if (this.isListening && this.server) {
      this.server.close()
      this.#onDidStop.fire()
    }
  }

  /** Current uri for this server, empty is not listening */
  public get uri() {
    if (!this.isListening || this.server === null) {
      return ""
    }

    const addr = this.server.address()
    if (typeof addr === 'string') {
      return addr
    }
    if (addr === null) {
      return ''
    }
    return `http://${this.host}:${addr.port}/`
  }

  private configure() {
    const app = this.app

    app.use(cors())
    // LOG REQUEST
    app.use(
      koalogger((str) => {
        this.logger.log(str)
      })
    )

    // EXPORT
    app.use(this.exportMiddleware(exportHTML, () => this.isInExport()))

    // EJS VIEW engine
    render(app, {
      root: path.resolve(this.extensionPath, 'views'),
      layout: 'template.4.1.3',
      viewExt: 'ejs',
      cache: false,
      debug: true,
    })

    // MAIN FILE
    app.use(async (ctx, next) => {
      if (ctx.path !== '/') {
        return next()
      }

      const htmlSlides = this.getSlides().map((s) => ({
        ...s,
        html: markdownit.render(s.text),
        children: s.verticalChildren.map((c) => ({ ...c, html: markdownit.render(c.text) })),
      }))
      ctx.state = { slides: htmlSlides, ...this.getConfiguration(), rootUrl: this.uri }
      await ctx.render('reveal')
    })

    // STATIC LIBS
    const libsPAth = path.join(this.extensionPath, 'libs')
    app.use(serve({ rootDir: libsPAth, rootPath: '/libs' }))

    // STATIC RELATIVE TO MD FILE
    const rootDir = this.getRootDir()
    if (rootDir) {
      app.use(serve({ rootDir, rootPath: '/' }))
    }

    // ERROR HANDLER
    app.on('error', (err) => {
      this.logger.error(err)
    })
  }


  private readonly exportMiddleware = (exportfn: (ExportOptions) => Promise<void>, isInExport) => {
    return async (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, { path: string }>, next) => {
      await next()
      if (isInExport()) {
        const exportPath = this.getExportPath()
        const opts: IExportOptions =
          typeof ctx.body === 'string'
            ? { folderPath: exportPath, url: ctx.originalUrl.split('?')[0], srcFilePath: null, data: ctx.body }
            : { folderPath: exportPath, url: ctx.originalUrl.split('?')[0], srcFilePath: ctx.body.path, data: null }

        await exportfn(opts)
      }
    }
  }

  private readonly _onDidDispose = this._register(new EventEmitter<void>());
	/**
	 * Fired when the document is disposed of.
	 */
	public readonly onDidDispose = this._onDidDispose.event;

  /**
	 * Called by VS Code when there are no more references to the document.
	 *
	 * This happens when all editors for it have been closed.
	 */
	dispose(): void {
    this.stop()
    this.server = null
		this._onDidDispose.fire();
		super.dispose();
	}
}
