import * as express from 'express'
import * as http from 'http'
// import * as url from 'url'; tobe used for pdf print
import * as path from 'path'
import * as fs from 'fs-extra'
import { TextEditor, Uri, window } from 'vscode'
import { IRevealJsOptions, ISlidifyOptions, RevealServerState } from './Models'

// tslint:disable-next-line:no-submodule-imports
import md = require('reveal.js/plugin/markdown/markdown')
import { VSCodeRevealContext } from './VSCodeRevealContext'
import { renderRevealHtml } from './Template'
import { saveIndex, saveContent } from './ExportHTML'

export class RevealServer {
  public state = RevealServerState.Stopped
  public uri?: Uri

  private app = express()
  private server: http.Server
  private staticDir = express.static
  private host: string = 'localhost'

  private rootDir = ''
  private revealBasePath = ''

  constructor(private context: VSCodeRevealContext) {
    this.rootDir = path.dirname(this.context.editor.document.fileName)
    this.revealBasePath = path.resolve(require.resolve('reveal.js'), '..', '..')
    this.initExpressServer()
  }

  public stop() {
    if (this.state === RevealServerState.Started) {
      this.server.close()
      this.state = RevealServerState.Stopped
      console.log(`Reveal-server Stopped`)
    }
  }

  public start() {
    try {
      if (this.state === RevealServerState.Stopped) {
        this.server = this.app.listen(0)
        this.state = RevealServerState.Started
        console.log(`Reveal-server started, opening at http://${this.host}:${this.server.address().port}`)
      }
      this.uri = Uri.parse(`http://${this.host}:${this.server.address().port}/`)
    } catch (err) {
      window.showErrorMessage(`Cannot start server: ${err}`)
    }
  }

  private initExpressServer = () => {
    this.app.use(this.exportMiddleware())

    const staticDirs = ['css', 'js', 'images', 'plugin', 'lib']
    for (const dir of staticDirs) {
      this.app.use('/' + dir, this.staticDir(path.join(this.revealBasePath, dir)))
    }

    this.app.use('/', this.staticDir(this.rootDir))

    const highlightPath = path.resolve(require.resolve('highlight.js'), '..', '..')
    this.app.use(`/lib/css/`, this.staticDir(path.join(highlightPath, 'styles')))

    this.app.get('/', this.renderMarkdownAsSlides)
  }

  private renderMarkdownAsSlides: express.RequestHandler = (req, res) => {
    const { title, extensionOptions, slideContent } = this.context
    const html = renderRevealHtml(title, extensionOptions, slideContent)
    res.send(html)
  }

  private exportMiddleware = () => (req, res, next) => {
    if (this.context.IsInExportMode) {
      const send = res.send
      // tslint:disable-next-line:no-this-assignment
      const { rootDir, revealBasePath } = this
      res.send = function(data) {
        saveIndex(rootDir, data)
        send.apply(res, arguments)
      }
      saveContent(rootDir, revealBasePath, req)
    }
    next()
  }
}
