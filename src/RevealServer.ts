import * as http from 'http'

import express from 'express'
import { config, engine } from 'express-edge'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'

import * as path from 'path'

import markdownit from './Markdown-it'

import { exportHTML, IExportOptions } from './ExportHTML'
import { Disposable } from './dispose'
import { RevealContext } from './RevealContext'

/** Http server to serve reveal presentation */
export class RevealServer extends Disposable {

  //public readonly app = new Koa()
  public readonly app = express()

  private server: http.Server | null = null
  private readonly host = 'localhost'

  public isInExport = false


  constructor(private readonly context: RevealContext) {
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

    // Configure Edge if need to
    //config({   cache: process.env.NODE_ENV === 'production' });

    app.set('view engine', 'ejs');

    //app.use(engine);
    app.set('views', path.resolve(context.extensionPath, 'views'));

    app.use(compression())
    app.use(cors())
    // LOG REQUEST
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream: {
        write: (str) => context.logger.info(str)
      }
    }))

    // EXPORT
    app.use(this.exportMiddleware(exportHTML, context.isInExport)

    // MAIN FILE
    app.use((req, res, next) => {
      if (req.path !== '/') {
        next()
      }
      else {
        const htmlSlides = context.slides.map((s) => ({
          ...s,
          html: markdownit.render(s.text),
          children: s.verticalChildren.map((c) => ({ ...c, html: markdownit.render(c.text) })),
        }))
        res.render('index', { slides: htmlSlides, ...context.configuration, rootUrl: this.uri })
      }
    })



    // STATIC LIBS
    const libsPAth = path.join(context.extensionPath, 'libs')
    app.use('/libs', express.static(libsPAth));
    //app.use(serve({ rootDir: libsPAth, rootPath: '/libs' }))

    // STATIC RELATIVE TO MD FILE
    if (context.dirname) {
      app.use('/', express.static(context.dirname));
      // app.use(serve({ rootDir: context.dirname, rootPath: '/' }))
    }

    // ERROR HANDLER
    app.use(function (err, req, res, next) {
      context.logger.error(err.stack)
      res.status(500).send(err.stack);
    });

    // app.on('error', (err) => {
    //   context.logger.error(err)
    // })
  }


  private readonly exportMiddleware = (exportfn: (ExportOptions) => Promise<void>, isInExport) => {

    const { exportPath } = this.context


    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {

      if (isInExport()) {
        const oldWrite = res.write
        const oldEnd = res.end;

        const chunks: any[] = [];

        res.write = (chunk, cb) => {
          chunks.push(chunk);
          return oldWrite.apply(res, [chunk, cb]);
        };

        res.end = async (chunk, ...args) => {
          if (chunk) {
            chunks.push(chunk);
          }
          const body = Buffer.concat(chunks).toString('utf8');

          const opts: IExportOptions = { folderPath: exportPath, url: req.originalUrl.split('?')[0], srcFilePath: null, data: body }

          return exportfn(opts).then(
            () => oldEnd.apply(res, [chunk, ...args])
          )
          // console.log(req.path, body);
          // return oldEnd.apply(res, [chunk, ...args]);
        };

        next()

      }
      else {
        next()
      }

    }

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
