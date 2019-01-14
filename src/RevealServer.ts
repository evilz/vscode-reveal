import * as express from 'express'
import * as es6Renderer from 'express-es6-template-engine'
import { appendFile } from 'fs'
import * as fs from 'fs-extra'
import * as http from 'http'
import * as path from 'path'
import { TextEditor, Uri, window } from 'vscode'

import { Configuration } from './Configuration'
import { ExportMode, saveContent, saveIndex } from './ExportHTML'

// tslint:disable-next-line:no-submodule-imports
import md = require('reveal.js/plugin/markdown/markdown')
export class RevealServer {
  private app = express()
  private server: http.Server | null
  private staticDir = express.static
  private host: string = 'localhost'
  private revealBasePath = path.resolve(require.resolve('reveal.js'), '..', '..')

  constructor(
    private getRootDir: () => string | null,
    private getSlideContent: () => string | null,
    private getConfiguration: () => Configuration,
    private getMode: () => ExportMode,
    private exportFn: (req) => Promise<void>
  ) {}

  public get isListening() {
    return this.server ? this.server.listening : false
  }

  public stop() {
    if (this.isListening) {
      this.server!.close()
    }
  }

  public get uri() {
    return this.isListening ? Uri.parse(`http://${this.host}:${this.server!.address().port}/`) : null
  }
  public start() {
    try {
      if (!this.isListening) {
        this.configure()
        this.refresh()
        this.server = this.app.listen(0)
        console.log(`Reveal-server started, opening at http://${this.host}:${this.server.address().port}`)
      }
    } catch (err) {
      throw new Error(`Cannot start server: ${err}`)
    }
  }

  public refresh() {
    if (this.getRootDir()) {
      this.app.use('/', this.staticDir(this.getRootDir() || ''))
    }
  }

  public configure() {
    this.app.use(this.exportMiddleware())

    const libsPAth = path.join(__dirname, '..', '..', 'libs')
    this.app.use('/libs', express.static(libsPAth))

    this.app.get('/markdown.md', (req, res) => {
      res.send(this.getSlideContent())
    })
    // this.app.use('/markdown.md',express.static(this.context.editor.document.fileName))
    // const highlightPath = path.resolve(require.resolve('highlight.js'), '..', '..')
    // this.app.use(`/lib/css/`, this.staticDir(path.join(highlightPath, 'styles')))

    // this.app.get('/', this.renderMarkdownAsSlides)
    const viewsPath = path.resolve(__dirname, '..', '..', 'views')
    this.app.engine('marko', es6Renderer)
    this.app.set('views', viewsPath)
    this.app.set('view engine', 'marko')

    this.app.get('/', (req, res) => {
      res.render(
        'template',
        {
          locals: {
            ...this.getConfiguration(),
            author: '',
            controlsLayout: 'TODO',
            customHighlightTheme: null,
            customTheme: null,
            description: '',
            isDarkTheme: false,
            logoImg: null,
            logoPosition: 'left',
            math: `{mathjax: 'somefile', config: 'MATHCONFIG !!!!' }`,
            title: this.getConfiguration().title
          },
          partials: {
            // _codeFragHighlightStyle: 'partials/CodeFragHighlightStyle',
            // _logo: 'partials/Logo',
            // _notificationBarStyle: 'partials/NotificationBarStyle',
            // _reveal: 'partials/Reveal',
            // _revealCoreOverrides: 'partials/RevealCoreOverrides',
            // _styleDependencies: 'partials/StyleDependencies'
          }
        },
        (err, content) => {
          if (err) {
            res.send(err.message)
          } else {
            res.send(content)
          }
        }
      )
    })
  }

  private getExportFolderPath() {
    return this.getConfiguration().exportHTMLPath ? this.getConfiguration().exportHTMLPath : this.getRootDir()
  }

  private exportMiddleware = () => {
    return (req, res, next) => {
      if (this.getMode() === ExportMode.Export) {
        const send = res.send
        res.send = function(data) {
          saveIndex(this.getExportFolderPath, data)
          send.apply(res, arguments)
        }
        // saveContent(exportDir, rootDir, revealBasePath, req)
        this.exportFn(req)
      }
      next()
    }
  }
}
