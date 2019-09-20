import * as http from 'http'
import * as Koa from 'koa'
import * as render from 'koa-ejs'
import * as koalogger from 'koa-logger'
import * as Router from 'koa-router'
import * as koastatic from 'koa-static'
import * as path from 'path'
// import revealCnverter from './showdown-reveal'

import * as md from'markdown-it'

import { Configuration } from './Configuration'
import { exportHTML, ExportOptions } from "./ExportHTML";
import { ISlide } from './ISlide';

const markdown = md({
  html: true,
  linkify: true,
  typographer: true
})
.use(require('markdown-it-multimd-table'), {enableMultilineRows: true,enableRowspan: true})
.use(require('markdown-it-attrs'), {
  // optional, these are default options
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: []  // empty array = all attributes are allowed
})
.use(require('markdown-it-imsize'))
.use(require('markdown-it-task-lists'),{label: true, labelAfter: true})
.use(require("markdown-it-block-embed"))
.use(require('markdown-it-github-headings'))
.use(require('markdown-it-container'), 'block');
// .use(require('markdown-it-span'));


export class RevealServer {
  private readonly app = new Koa();
  private server: http.Server | null
  private readonly host = 'localhost'

  constructor(
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
    app.use(koalogger())
    app.use(this.exportMiddleware(exportHTML, () => this.isInExport()))

    // For static media or else
    const rootDir = this.getRootDir()
    if (rootDir) {
      app.use(koastatic(rootDir));
    }

    render(app, {
      root: path.resolve(this.extensionPath, 'views'),
      layout: 'template',
      viewExt: 'ejs',
      cache: false,
      debug: true
    });

    const router = new Router();
    router.get('/', async (ctx, next) => {

      
      const htmlSlides = this.getSlides().map(s => (
        {
          // html: revealCnverter.makeHtml(s.text),
          ...s,
          html: markdown.render(s.text),
          children: s.verticalChildren.map(c => ( {...c, html:  markdown.render(c.text) }))
        }))

      ctx.state = { slides: htmlSlides, ...this.getConfiguration() }
      await ctx.render('reveal');
    });

    const libsPAth = path.join(this.extensionPath, 'libs')
    router.get('/libs', koastatic(libsPAth));

    // TODO : make middleware
    //   this.app.get('/markdown.md', (req, res) => {
    //     res.send(this.getSlideContent())
    //   })

    app.use(router.routes());

    // Error Handling
    app.on('error', err => {
      // todo use logger 
      console.error('server error', err)
    })

    this.server = app.listen();
  }


  private readonly exportMiddleware = (exportfn: (ExportOptions)=>Promise<void>, isInExport) => {

    
  

    return async (ctx: Koa.Context, next) => {
      await next()
      if (isInExport()) {
        // req.headers['if-modified-since'] = undefined
        // req.headers['if-none-match'] = undefined

        const exportPath = this.getExportPath()
        const opts:ExportOptions = typeof ctx.body === "string"
                                   ? { folderPath: exportPath, url: ctx.originalUrl.split('?')[0], srcFilePath: null    , data: ctx.body }
                                   : { folderPath: exportPath, url: ctx.originalUrl.split('?')[0], srcFilePath: ctx.body.path, data: null }

        await exportfn(opts)

      }
     
    }
  }
}
