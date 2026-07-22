import * as http from 'http'
import * as fs from 'fs'
import express from 'express'
import ejs from 'ejs'
import cors from 'cors'
import morgan from 'morgan'
import * as path from 'path'
import markdownit, { setDiagramRenderingConfig } from './Markdown-it'
import { exportHTML, IExportOptions } from './ExportHTML'
import { Disposable } from './dispose'
import { RevealContext } from './RevealContext'
import { EventEmitter } from 'vscode'

export const jsonForScript = (value: unknown): string => JSON.stringify(value)
  .replace(/</g, '\\u003c')
  .replace(/\u2028/g, '\\u2028')
  .replace(/\u2029/g, '\\u2029')

const isOfflineMode = (value: unknown): boolean => value === true || value === 'true'

/** Http server to serve reveal presentation */
export class RevealServer extends Disposable {
  public readonly app = express()

  private readonly _onDidStart = this._register(new EventEmitter<string>())
  public readonly onDidStart = this._onDidStart.event

  private readonly _onDidStop = this._register(new EventEmitter<void>())
  public readonly onDidStop = this._onDidStop.event

  private server: http.Server | null = null
  private readonly host = 'localhost'

  constructor(private readonly context: RevealContext) {
    super()
    this.configure()
  }

  /**
   * If the server is not listening, start the server and log the server's status.
   * @returns The uri of the server.
   */
  public start() {
    try {
      if (!this.isListening) {
        this.server = this.app.listen(0)
        this.server?.on('listening', () => {
          this.context.logger.info('SERVER started at ' + this.uri)
          this._onDidStart.fire(this.uri)
        })
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
  public stop(): void {
    if (this.isListening && this.server) {
      this.server.close()
      this.context.logger.debug(`SERVER: stopped`)
      this._onDidStop.fire()
    }
  }

  /** Current uri for this server, empty is not listening */
  public get uri() {
    if (!this.isListening || this.server === null) {
      return ''
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

  private loadInitScript(): { init: string | null; initModule: boolean } {
    const baseDir = this.context.dirname
    if (!baseDir) return { init: null, initModule: false }

    const initModulePath = path.join(baseDir, 'init.esm.js')
    if (fs.existsSync(initModulePath)) {
      return { init: 'init.esm.js', initModule: true }
    }

    const initPath = path.join(baseDir, 'init.js')
    return fs.existsSync(initPath)
      ? { init: fs.readFileSync(initPath, 'utf8'), initModule: false }
      : { init: null, initModule: false }
  }

  private loadHtmlFragmentContent(): string | null {
    const configuredFragmentPath = this.context.configuration.htmlFragment
    if (!configuredFragmentPath) return null

    const htmlFragmentPath = this.context.resolvePresentationFilePath(configuredFragmentPath)
    if (!htmlFragmentPath) {
      this.context.logger.error(`HTML fragment path must stay inside the presentation directory: ${configuredFragmentPath}`)
      return null
    }

    try {
      if (!fs.statSync(htmlFragmentPath).isFile()) {
        this.context.logger.error(`HTML fragment path is not a regular file: ${htmlFragmentPath}`)
        return null
      }
      return fs.readFileSync(htmlFragmentPath, 'utf8')
    } catch {
      this.context.logger.error(`HTML fragment file not found or unreadable: ${htmlFragmentPath}`)
      return null
    }
  }

  /** The function configures the express app to serve the presentation */
  private configure() {
    const app = this.app
    const context = this.context

    //disable cache
    app.set('etag', false)
    app.use((req, res, next) => {
      res.set('Cache-Control', 'no-store')
      next()
    })

    // Set EJS as view
    app.set('view engine', 'ejs')
    app.engine('ejs', ejs.__express)
    app.set('views', path.resolve(context.extensionPath, 'views'))
    app.use(cors())
    // LOG REQUEST
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: { write: (str) => context.logger.info(str) } }))

    // EXPORT
    app.use(this.exportMiddleware(exportHTML, context.isInExport))

    // STATIC LIBS
    const libsPAth = path.join(context.extensionPath, 'libs')
    app.use('/libs', express.static(libsPAth, { cacheControl: false, etag: false, immutable: false }))

    // STATIC RELATIVE TO MD FILE if file is saved
    if (context.dirname) {
      app.use('/', express.static(context.dirname, { cacheControl: false, etag: false, immutable: false }))
    }

    // MAIN FILE
    app.use((req, res, next) => {
      if (req.path !== '/') {
        next()
      } else {
        const offline = isOfflineMode(context.configuration.offline)
        const { init, initModule } = this.loadInitScript()
        const htmlFragmentContent = this.loadHtmlFragmentContent()

        setDiagramRenderingConfig({
          enabled: !offline && context.configuration.diagramServerEnabled,
          serverBaseUrl: context.configuration.diagramServerUrl,
        })

        const htmlSlides = context.slides.map((s) => ({
          ...s,
          html: markdownit.render(s.text),
          children: s.verticalChildren.map((c) => ({ ...c, html: markdownit.render(c.text) })),
        }))
        res.render('index', { slides: htmlSlides, ...context.configuration, offline, rootUrl: this.uri, init, initModule, jsonForScript, htmlFragmentContent })
      }
    })

    // ERROR HANDLER
    app.use(function (err, req, res, _next) {
      context.logger.error(err.stack)
      res.status(500).send(err.stack)
    })
  }

  /* A middleware function that is used to export the presentation to a folder. */
  private readonly exportMiddleware = (exportfn: (opts: IExportOptions) => Promise<void>, isInExport: () => boolean) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (isInExport()) {
        const { exportPath } = this.context
        this.context.logger.debug('in export')
        const oldWrite = res.write
        const oldEnd = res.end

        const chunks: Buffer[] | string[] = []

        res.write = (chunk, ...args) => {
          if (typeof chunk === 'string') {
            ;(chunks as string[]).push(chunk)
          } else {
            ;(chunks as Buffer[]).push(chunk)
          }
          // @ts-ignore
          return oldWrite.apply(res, [chunk, ...args])
        }
        // @ts-ignore
        res.end = async (chunk, ...args) => {
          this.context.logger.info(`${req.originalUrl.split('?')[0]} - ${chunks.length}`)
          if (chunk) {
            if (typeof chunk === 'string') {
              ;(chunks as string[]).push(chunk)
            } else {
              ;(chunks as Buffer[]).push(chunk)
            }
          }
          try {
            let body: string | Buffer
            if (chunks.length > 0 && typeof chunks[0] === 'string') {
              body = ''.concat(...(chunks as string[]))
            } else {
              body = Buffer.concat(chunks as Buffer[])
            }

            const opts: IExportOptions = { folderPath: exportPath, url: req.originalUrl.split('?')[0], srcFilePath: null, data: body }
            await exportfn(opts)
          } catch (error) {
            this.context.logger.error(`Export error: ${error}`)
            this.context.onExportError(error)
          }

          // @ts-ignore
          return oldEnd.apply(res, [chunk, ...args])
        }
      }
      next()
    }
  }

  dispose(): void {
    this.stop()
    this.server = null
    super.dispose()
  }
}
