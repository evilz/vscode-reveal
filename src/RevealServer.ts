import * as http from 'http'
import Koa from 'koa'
import cors from '@koa/cors'
import render from 'koa-ejs'
import koalogger from 'koa-logger'
import serve from 'koa-static-server'
import * as path from 'path'

import markdownit from './Markdown-it'

import { exportHTML, IExportOptions } from './ExportHTML'
import {Disposable} from './dispose'
import { RevealContext } from './RevealContext'

/** Http server to serve reveal presentation */
export class RevealServer extends Disposable{
  public readonly app = new Koa()
  private server: http.Server | null = null
  private readonly host = 'localhost'

  public isInExport = false
  

  constructor(private readonly context:RevealContext) {
    super()
    this.configure()
  }

  public start() {
    try {
      if (!this.isListening) {
        this.server = this.app.listen(0)
        this.context.logger.info(`SERVER started`)
      }
    } catch (err) {
      const error = new Error(`Cannot start server: ${err}`)
      this.context.logger.error(`SERVER: Cannot start server: ${err}`)
      throw error
    }
    return this.uri
  }
 
  /** True if server is currently listening*/
  public get isListening() {
    return this.server ? this.server.listening : false
  }

  /** Stop listening */
  stop(): void {
    if (this.isListening && this.server) {
      this.server.close()
      this.context.logger.debug(`SERVER: stopped`)
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
    const context = this.context
   
    app.use(cors())
    // LOG REQUEST
    app.use(
      koalogger((str) => {
        context.logger.debug(str)
      })
    )
    
    // EXPORT
    app.use(this.exportMiddleware(exportHTML, () => context.isInExport))

    // EJS VIEW engine
    render(app, {
      root: path.resolve(context.extensionPath, 'views'),
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

      const htmlSlides = context.slides.map((s) => ({
        ...s,
        html: markdownit.render(s.text),
        children: s.verticalChildren.map((c) => ({ ...c, html: markdownit.render(c.text) })),
      }))
      ctx.state = { slides: htmlSlides, ...context.configuration, rootUrl: this.uri }
      await ctx.render('reveal')
    })

    // STATIC LIBS
    const libsPAth = path.join(context.extensionPath, 'libs')
    app.use(serve({ rootDir: libsPAth, rootPath: '/libs' }))

    // STATIC RELATIVE TO MD FILE
    if (context.dirname) {
      app.use(serve({ rootDir:context.dirname, rootPath: '/' }))
    }

    // ERROR HANDLER
    app.on('error', (err) => {
      context.logger.error(err)
    })
  }


  private readonly exportMiddleware = (exportfn: (ExportOptions) => Promise<void>, isInExport) => {

    const {exportPath} = this.context

    return async (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, { path: string }>, next) => {
      await next()
      if (isInExport()) {
        const opts: IExportOptions =
          typeof ctx.body === 'string'
            ? { folderPath: exportPath, url: ctx.originalUrl.split('?')[0], srcFilePath: null, data: ctx.body }
            : { folderPath: exportPath, url: ctx.originalUrl.split('?')[0], srcFilePath: ctx.body.path, data: null }

        await exportfn(opts)
      }
    }
  }

	dispose(): void {
    this.stop()
    this.server = null
		super.dispose();
	}
}
