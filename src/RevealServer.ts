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
import { Logger } from './Logger'
import EventEmitter from "events"
import TypedEmitter from "typed-emitter"
interface RevealServerEvents {
  started: (uri: string) => void,
  stopped: () => void
  error: (error: Error) => void
  
}

export class RevealServer extends (EventEmitter as new () => TypedEmitter<RevealServerEvents>){
  private readonly app = new Koa()
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
  }

  public get isListening() {
    return this.server ? this.server.listening : false
  }

  public stop() {
    if (this.isListening && this.server) {
      this.server.close()
      this.emit("stopped")
    }
  }

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

  public start() {
    try {
      if (!this.isListening && this.getRootDir()) {
        this.configure()
        this.server = this.app.listen(0)
        this.emit("started", this.uri)
        return this.uri
      }
    } catch (err) {
      const error = new Error(`Cannot start server: ${err}`)
      this.emit("error", error)
      throw error
    }
  }

  private configure() {
    const app = this.app

    app.use(cors())
    // LOG REQUEST
    app.use(
      koalogger((str, args) => {
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

    this.server = app.listen()
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
}
