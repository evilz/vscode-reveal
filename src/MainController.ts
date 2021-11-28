/**
 * @summary Main controller that connect server, document, statusbar, iframe etc...
 * @author Vincent B. <evilznet@gmail.com>
 */
import {
  commands,
  ConfigurationChangeEvent,
  ExtensionContext,
  Position,
  Range,
  Selection,
  TextDocument,
  TextDocumentChangeEvent,
  TextEditor,
  TextEditorSelectionChangeEvent,
  WebviewPanel,
  window,
} from 'vscode'


import * as jetpack from 'fs-jetpack'
import * as path from 'path'

import { SHOW_REVEALJS } from './commands/showRevealJS'
import ConfigurationProvider, { ConfigurationDescription, IDocumentOptions } from './Configuration'
import { countLinesToSlide, extensionId } from './utils'
import { ISlide } from './ISlide'
import { Logger } from './Logger'
import { RevealServer } from './RevealServer'
import { SlideTreeProvider } from './SlideExplorer'
import { StatusBarController } from './StatusBarController'
import SlideParser from './SlideParser'
import WebViewPane from './WebViewPane'
import { FrontMatterResult } from 'front-matter'
import TextDecorator from './TextDecorator'
import { config } from 'process'

interface ISlidePosition {
  horizontal: number
  vertical: number
}

const isMarkdownFile = (d:TextDocument) => d.languageId === 'markdown'

export default class MainController {
  readonly #server: RevealServer
  readonly #statusBarController: StatusBarController
  readonly #slidesExplorer: SlideTreeProvider
  readonly #configurationProvider: ConfigurationProvider
  readonly #slideParser: SlideParser
  readonly #TextDecorator: TextDecorator

  #webViewPane?:WebViewPane
  #frontMatterResult?:FrontMatterResult<IDocumentOptions>
  
  #currentEditor?:TextEditor;

  #slides: ISlide[] = []
  #position: ISlidePosition = { horizontal: 0, vertical: 0 }

  get configuration() { return this.#configurationProvider.configuration }
  get filename() { return this.#currentEditor?.document.fileName }

  get dirname() { return this.filename ? path.dirname(this.filename) : '' }
  
  get ServerUri() { return this.#server.uri }

  //#### connect vs code event
  public onDidChangeTextEditorSelection(event: TextEditorSelectionChangeEvent) {
    if (event.textEditor !== this.#currentEditor || event.selections.length === 0) { return }

    const end = event.selections[0].active
    this.updatePosition(end)
    this.refresh()
  }

  

  public onDidChangeActiveTextEditor(editor: TextEditor | undefined) {
    if (editor && isMarkdownFile( editor.document)) {
      this.#currentEditor = editor
      this.updatePosition(editor.selection.active)
      this.refresh()
      // ADD debug level
      //this.logger.log(`onDidChangeActiveTextEditor: ${editor.document.fileName}`)
    }
  }

  public async onDidChangeTextDocument(e: TextDocumentChangeEvent) {
    if (e.document=== this.#currentEditor?.document) {
       // ADD debug level
      //this.logger.log(`onDidChangeTextDocument: ${e.document.fileName}`)
      this.refresh()
    }
  }

  public onDidSaveTextDocument(e: TextDocument) {
     // ADD debug level
    //this.logger.log(`onDidSaveTextDocument: ${e.fileName}`)
  }

  public onDidCloseTextDocument(e: TextDocument) {
    if (e === this.#currentEditor?.document) {
      this.#currentEditor = undefined
      this.stopServer()
      this.#webViewPane?.dispose()
    }
     // ADD debug level
    //this.logger.log(`onDidCloseTextDocument ${e.fileName}`)
  }

  public onDidChangeConfiguration(e: ConfigurationChangeEvent) {
    if (!e.affectsConfiguration(extensionId)) { return }
    this.#configurationProvider.reloadWorkspaceConfig()
  }


  public constructor(
    private readonly logger: Logger,
    private readonly extensionContext: ExtensionContext,
    private readonly configDesc: ConfigurationDescription[],
    currentEditor: TextEditor | undefined
  ) {

    this.#currentEditor = currentEditor

    this.#configurationProvider = new ConfigurationProvider()
    this.#configurationProvider.on("updated", () => {
      this.#log("configurationProvider", `configuration updated`)
      this.refresh()
    } )

    this.#statusBarController = new StatusBarController()
    this.#statusBarController.on("updatedServerInfo", () => this.#log("StatusBarController", `updatedServerInfo`))
    this.#statusBarController.on("updatedSlideCount", () => this.#log("StatusBarController", `updatedSlideCount`))

    this.#server = new RevealServer(
      this.logger,
      () => this.dirname,
      () => this.#slides,
      () => this.configuration,
      this.extensionContext.extensionPath,
      () => this.isInExport,
      () => this.exportPath,
    )

    this.#slideParser = new SlideParser()
    this.#slideParser.on("parsed", (front, slides) => {
      this.#log(`SlideParser`, `frontmatter:${front.bodyBegin > 1} - slides:${slides.length}`)
      this.#slides = slides
      this.#configurationProvider.documentConfig = front.attributes}
    )

    this.#TextDecorator = new TextDecorator(configDesc)

    

    this.#server.on("started", uri => {
      this.#log(`Server`,`started on ${uri}`)
      this.#statusBarController.updateServerInfo(uri)
    })
    this.#server.on("stopped", () => {
      this.#log(`Server`, `stopped`)
      this.#statusBarController.updateServerInfo(null)
    })
    this.#server.on("error", (err) => this.#logError(`Server`, `${err.message}`))

    this.#slidesExplorer = new SlideTreeProvider(() => this.#slides)
    this.#slidesExplorer.register()
    this.#slidesExplorer.onDidChangeTreeData( ()=>  this.#log(`SlideTreeProvider`, `updated`))

  }

  #log(component: string, message: string) {
    this.logger.log(`"${component.toUpperCase()}": ${message}`)
  }
  #logError(component: string, message: string) { this.logger.error(`"${component.toUpperCase()}": ${message}`) }

  // active export during 5 seconds
  #exportTimeout: NodeJS.Timeout | null = null
  public get isInExport() { return this.#exportTimeout !== null }

  public export = async () => {
    if (this.#exportTimeout !== null) {
      clearTimeout(this.#exportTimeout)
    }
    await jetpack.removeAsync(this.exportPath)

    const promise = new Promise<string>((resolve) => {
      this.#exportTimeout = setTimeout(() => resolve(this.exportPath), 5000)
    })
    this.#webViewPane
     ? this.refreshWebViewPane() 
     : await commands.executeCommand(SHOW_REVEALJS)
   

    return promise
  }

  // debounce parse and refresh
  #refreshTimeout: NodeJS.Timeout | null = null
  refresh(wait = 500) {
    if(!this.#currentEditor) return

    if(this.#refreshTimeout) { clearTimeout(this.#refreshTimeout) }
    this.#refreshTimeout = setTimeout(() => {
        if(!this.#currentEditor) return

        this.logger.log(`REFRESH START!`)
        const {frontmatter,slides} = this.#slideParser.parse(this.#currentEditor.document.getText())
        this.#slides = slides
        this.#frontMatterResult = frontmatter
        this.#configurationProvider.documentConfig = frontmatter.attributes

        this.refreshWebViewPane()
        this.#slidesExplorer.update()
        this.#statusBarController.updateCount(this.#slides.length)
        this.#TextDecorator.update(this.#currentEditor)
        this.logger.log(`REFRESH DONE!`)
    }, wait)
  }

  updatePosition(cursorPosition: Position) {
    if(!this.#currentEditor) return
    const start = new Position(0, 0)
    const range = new Range(start, cursorPosition)
    const {slides} =this.#slideParser.parse(this.#currentEditor.document.getText(range), false)
    const currentSlide = slides[slides.length - 1]

    this.#position = currentSlide.verticalChildren
      ? { horizontal: slides.length - 1, vertical: currentSlide.verticalChildren.length }
      : { horizontal: slides.length - 1, vertical: 0 }
  }

  get uri() { 
    const {horizontal,vertical} = this.#position
    return `${this.#server.uri}#/${horizontal}/${vertical}/${Date.now()}`
  }

  public get exportPath(): string {
    return path.isAbsolute(this.configuration.exportHTMLPath)
      ? this.configuration.exportHTMLPath
      : path.join(this.dirname, this.configuration.exportHTMLPath)
  }

  
  public goToSlide(topindex: number, verticalIndex: number) {
    if(!this.#currentEditor) return

    const linesCount = countLinesToSlide(this.#slides, topindex, verticalIndex) + (this.#frontMatterResult?.frontmatter ? this.#frontMatterResult.bodyBegin : 0)

    const position = new Position(linesCount, 0)
    this.#currentEditor.selections = [new Selection(position, position)]
    this.#currentEditor.revealRange(new Range(position, position.translate(20)))
  }


  stopServer = () => this.#server.stop()

  public showWebViewPane(webviewPanel:WebviewPanel ){
    if(!this.#webViewPane){
      this.#webViewPane = new WebViewPane(webviewPanel)
      this.refreshWebViewPane()
    }
  }

  private refreshWebViewPane(){
    if(this.#webViewPane){
      this.#server.start()
      this.#webViewPane.title = this.configuration.title
      this.#webViewPane.update(this.uri)
      this.#webViewPane.on("disposed", ()=> this.#webViewPane = undefined)
  }

  
}
}
