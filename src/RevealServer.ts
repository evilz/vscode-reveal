import * as http from 'http'
import * as Koa from 'koa'
import * as render from 'koa-ejs'
import * as koalogger from 'koa-logger'
import * as serve from 'koa-static-server'
import * as path from 'path'

import markdownit from './Markdown-it'

import { Configuration } from './Configuration'
import { exportHTML, IExportOptions } from "./ExportHTML";
import { ISlide } from './ISlide';
import { Logger } from './Logger'


export class RevealServer {
  private readonly app = new Koa();
  private server: http.Server | null
  private readonly host = 'localhost'

  constructor(
    private readonly logger: Logger,
    private readonly getRootDir: () => string,
    private readonly getSlides: () => ISlide[],
    private readonly getConfiguration: () => Configuration,
    private readonly extensionPath: string,
    private readonly isInExport: () => boolean,
    private readonly getExportPath: () => string
  ) { }

  public get isListening() {
    return this.server ? this.server.listening : false
  }

  public stop() {
    if (this.isListening && this.server) {
      this.server.close()
    }
  }

  public get uri() {
    if (!this.isListening || this.server === null) {
      return null
    }

    const addr = this.server.address()
    return typeof addr === 'string' ? addr : `http://${this.host}:${addr.port}/`
  }
  public start() {
    try {

      if (!this.isListening && this.getRootDir()) {
        this.configure()
        this.server = this.app.listen(0)
      }
    } catch (err) {
      throw new Error(`Cannot start server: ${err}`)
    }
  }

  private configure() {

    const app = this.app

    // LOG REQUEST
    app.use(koalogger((str, args) => {this.logger.log(str)}))

    // EXPORT
    app.use(this.exportMiddleware(exportHTML, () => this.isInExport()))

    // EJS VIEW engine
    render(app, {
      root: path.resolve(this.extensionPath, 'views'),
      layout: 'template',
      viewExt: 'ejs',
      cache: false,
      debug: true
    });

    
    // MAIN FILE
    app.use( async (ctx, next) => {

      if(ctx.path !== '/') { return next()}
      

      const markdown = markdownit(this.getConfiguration())
      const htmlSlides = this.getSlides().map(s => (
        {
          ...s,
          html: markdown.render(s.text),
          children: s.verticalChildren.map(c => ( {...c, html:  markdown.render(c.text) }))
        }))
      ctx.state = { slides: htmlSlides, ...this.getConfiguration() }
      await ctx.render('reveal');
    });

    
    // STATIC LIBS
    const libsPAth = path.join(this.extensionPath, 'libs')
    app.use(serve({ rootDir:libsPAth,  rootPath: '/libs' }))

    
     // STATIC RELATIVE TO MD FILE
     const rootDir = this.getRootDir()
     if (rootDir) {
       app.use(serve({rootDir, rootPath : '/' }))
     }
 

    // ERROR HANDLER
    app.on('error', err => {
      this.logger.error(err)
    })

    this.server = app.listen();
  }


  private readonly exportMiddleware = (exportfn: (ExportOptions)=>Promise<void>, isInExport) => {

    
  

    return async (ctx: Koa.Context, next) => {
      await next()
      if (isInExport()) {

        const exportPath = this.getExportPath()
        const opts:IExportOptions = typeof ctx.body === "string"
                                   ? { folderPath: exportPath, url: ctx.originalUrl.split('?')[0], srcFilePath: null    , data: ctx.body }
                                   : { folderPath: exportPath, url: ctx.originalUrl.split('?')[0], srcFilePath: ctx.body.path, data: null }

        await exportfn(opts)

      }
     
    }
  }
}
