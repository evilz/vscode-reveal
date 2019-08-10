import * as express from 'express'
import * as es6Renderer from 'express-es6-template-engine'
import * as http from 'http'
import * as path from 'path'

import { Configuration } from './Configuration'

export class RevealServer {
  private readonly app = express()
  private server: http.Server | null
  private readonly host = 'localhost'

  constructor(
    private readonly getRootDir: () => string | null,
    private readonly getSlideContent: () => string | null,
    private readonly getConfiguration: () => Configuration,
    private readonly isInExport: () => boolean,
    private readonly exportFn: (url: string, data: string) => void
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
      const rootDir = this.getRootDir()
      if (!this.isListening && this.getRootDir()) {
        this.configure()
        this.refresh(rootDir)
        this.server = this.app.listen(0)
      }
    } catch (err) {
      throw new Error(`Cannot start server: ${err}`)
    }
  }

  private refresh(rootDir) {
    this.app.use('/', express.static(rootDir))
    //this.app.use('/', gzip(rootDir, {
    //  enableBrotli: true,
    //  orderPreference: ['br']
    //}))
  }

  private configure() {
    this.app.use(this.exportMiddleware(this.exportFn, () => this.isInExport()))

    const libsPAth = path.join(__dirname, '..', '..', 'libs')
    this.app.use('/libs', express.static(libsPAth))
    this.app.get('/markdown.md', (req, res) => {
      res.send(this.getSlideContent())
    })

    const viewsPath = path.resolve(__dirname, '..', '..', 'views')
    this.app.engine('marko', es6Renderer)
    this.app.set('views', viewsPath)
    this.app.set('view engine', 'marko')

    this.app.get('/', (req, res) => {
      res.render(
        'template',
        {
          locals: {
            ...this.getConfiguration()
          },
          partials: {}
        },
        (err, content) => {
          if (err) {
            res.send(err.message)
          } else {
            // save here
            res.send(content)
          }
        }
      )
    })
  }

  private readonly exportMiddleware = (exportfn, isInExport) => {
    return (req, res, next) => {
      const _exportfn = exportfn
      const _isInExport = isInExport

      console.log('req', req)
      if (_isInExport()) {
        req.headers['if-modified-since'] = undefined
        req.headers['if-none-match'] = undefined

        const oldSend = res.send
        const oldEnd = res.end

        const chunks: any[] = []
        let innerBody: string | null = null

        // tslint:disable-next-line: only-arrow-functions
        res.send = function (body) {
          // console.log('send ', typeof body, body && body.length, req.path)
          innerBody = body
          oldSend.apply(res, arguments)
        }

        // tslint:disable-next-line:only-arrow-functions
        res.end = async function (chunk) {
          // console.log('end ', typeof chunk, chunk && chunk.length, req.path)
          if (chunk) {
            chunks.push(chunk)
          }

          // console.log(req.path, body)
          try {
            if (innerBody) {
              if (innerBody.length === 0) {
                throw new Error('inner body of 0 for ' + req.originalUrl)
              }
              _exportfn(req.originalUrl.split('?')[0], innerBody)
              innerBody = null
            } else {
              const body = Buffer.concat(chunks).toString('utf8')
              if (body.length === 0) {
                throw new Error('inner body of 0 for ' + req.originalUrl)
              }
              _exportfn(req.originalUrl.split('?')[0], body)
            }
          } catch (error) {
            console.error(`can get body of ${req.path}: ${error}`)
          }

          oldEnd.apply(res, arguments)
        }
      }
      next()
    }
  }
}
