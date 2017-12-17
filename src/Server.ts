import * as express from 'express'
import * as http from 'http'
// import * as url from 'url'; tobe used for pdf print
import * as path from 'path'
import { TextEditor, Uri } from 'vscode'
import { IRevealJsOptions, ISlidifyOptions, RevealServerState } from './Models'

// tslint:disable-next-line:no-submodule-imports
import md = require('reveal.js/plugin/markdown/markdown')

export class RevealServer {
  public state = RevealServerState.Stopped
  public uri?: Uri

  private app = express()
  private server: http.Server
  private staticDir = express.static
  private host: string = 'localhost'

  constructor(private renderHtml: (() => string), fileName: string) {
    const rootDir = path.dirname(fileName)
    this.initExpressServer(rootDir)
  }

  public stop() {
    if (this.state === RevealServerState.Started) {
      this.server.close()
      this.state = RevealServerState.Stopped
      console.log(`Reveal-server Stopped`)
    }
  }

  public start() {
    if (this.state === RevealServerState.Stopped) {
      this.server = this.app.listen(0)
      this.state = RevealServerState.Started
      console.log(
        `Reveal-server started, opening at http://${this.host}:${this.server.address().port}`
      )
    }
    this.uri = Uri.parse(`http://${this.host}:${this.server.address().port}/`)
  }

  private initExpressServer = (rootDir: string) => {
    const revealBasePath = path.resolve(require.resolve('reveal.js'), '..', '..')

    const staticDirs = ['css', 'js', 'images', 'plugin', 'lib']
    for (const dir of staticDirs) {
      this.app.use('/' + dir, this.staticDir(path.join(revealBasePath, dir)))
    }

    this.app.use('/', this.staticDir(rootDir))

    const highlightPath = path.resolve(require.resolve('highlight.js'), '..', '..')
    this.app.use(`/lib/css/`, this.staticDir(path.join(highlightPath, 'styles')))

    this.app.get('/', this.renderMarkdownAsSlides)
  }

  private renderMarkdownAsSlides: express.RequestHandler = (req, res) => {
    // Look for print-pdf option
    // if (~req.url.indexOf('?print-pdf')) {
    //    req.url = req.url.replace('?print-pdf', '');
    // }
    const html = this.renderHtml()
    res.send(html)
  }
}
