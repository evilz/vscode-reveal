/*
 * File: \src\MainController.ts
 * Project: vscode-reveal
 * Created Date: Wednesday October 23rd 2019
 * Author: Vincent Bourdon
 * -----
 * Last Modified: Tuesday, 8th March 2022 9:22:25 am
 * Modified By: Vincent Bourdon
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */


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
} from 'vscode'

import * as jetpack from 'fs-jetpack'
import * as path from 'path'

import { SHOW_REVEALJS } from './commands/showRevealJS'
import ConfigurationProvider, { ConfigurationDescription, IDocumentOptions } from './Configuration'
import { countLinesToSlide, extensionId } from './utils'
import { ISlide } from './ISlide'
import  Logger  from './Logger'
import { RevealServer } from './RevealServer'
import { SlideTreeProvider } from './SlideExplorer'
import { StatusBarController } from './StatusBarController'
import SlideParser from './SlideParser'
import WebViewPane from './WebViewPane'
import { FrontMatterResult } from 'front-matter'
import TextDecorator from './TextDecorator'

interface ISlidePosition {
  horizontal: number
  vertical: number
}

interface RevealContext {
  editor : TextEditor
  server: RevealServer
}

const isMarkdownFile = (d:TextDocument) => d.languageId === 'markdown'

export default class MainController {
  //readonly #server: RevealServer
  readonly #statusBarController: StatusBarController
  readonly #slidesExplorer: SlideTreeProvider
  readonly #configurationProvider: ConfigurationProvider
  readonly #slideParser: SlideParser
  readonly #TextDecorator: TextDecorator

  #webViewPane?:WebViewPane
  #frontMatterResult?:FrontMatterResult<IDocumentOptions>
  
  //#currentEditor?:TextEditor;
  #currentContext?:RevealContext
  #revealContexts: Map<string,RevealContext>

  #slides: ISlide[] = []
  #position: ISlidePosition = { horizontal: 0, vertical: 0 }

  get configuration() { return this.#configurationProvider.configuration }
  get filename() { return this.#currentContext?.editor?.document.fileName }

  get dirname() { return this.filename ? path.dirname(this.filename) : '' }
  
  get ServerUri() { return this.#currentContext?.server.uri }

  //#### connect vs code event
  public onDidChangeTextEditorSelection(event: TextEditorSelectionChangeEvent) {
    const selection = event.selections.length > 0 ? event.selections[0] : event.textEditor.selection; 
    this.OnEditorEvent(event.textEditor,selection.active)

    // if (event.textEditor.document.fileName !== this.#currentContext?.editor.document.fileName 
    //   || event.selections.length === 0) { return }

    // const end = event.selections[0].active
    // this.updatePosition(end)
    // this.refresh()
  }


  private OnEditorEvent(editor: TextEditor | undefined, newPosition: Position ){
    if (editor && isMarkdownFile( editor.document)) {
      if(!this.#revealContexts.has(editor.document.fileName)){
        this.createContext(editor)
        this.#currentContext = this.#revealContexts.get(editor.document.fileName)
      }
      this.updatePosition(newPosition)
      this.refresh()
    }
  }
  

  public onDidChangeActiveTextEditor(editor: TextEditor | undefined) {
    if(editor === undefined) return
    this.OnEditorEvent(editor,editor.selection.active)

    // if (editor && isMarkdownFile( editor.document)) {

    //   if(!this.#revealContexts.has(editor.document.fileName)){
       
    //     this.createContext(editor)

    //      }
         

    //   this.#currentContext = this.#revealContexts.get(editor.document.fileName)
    //   this.updatePosition(editor.selection.active)
    //   this.refresh()
      // ADD debug level
      //this.logger.log(`onDidChangeActiveTextEditor: ${editor.document.fileName}`)
    
  }

  public async onDidChangeTextDocument(e: TextDocumentChangeEvent) {
    if (e.document.fileName=== this.#currentContext?.editor?.document.fileName) {
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
    if (e.fileName === this.#currentContext?.editor.document.fileName) {
      
      this.#currentContext.server.dispose()
      this.#currentContext = undefined
      this.#revealContexts.delete(e.fileName)
      this.#webViewPane?.dispose() // TODO: check if this is not a bug
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

    this.#revealContexts = new Map<string,RevealContext>()
    
    //this.#currentEditor = currentEditor

    this.#configurationProvider = new ConfigurationProvider()
    this.#configurationProvider.onDidUpdate(() => {
    this.#log("configurationProvider", `configuration updated`)
      this.refresh()
    } )

    this.#statusBarController = new StatusBarController()
    this.#statusBarController.onDidUpdateServerInfo(() => this.#log("StatusBarController", `updatedServerInfo`))
    this.#statusBarController.onDidUpdatedSlideCount(() => this.#log("StatusBarController", `updatedSlideCount`))

    // this.#server = new RevealServer(
    //   this.logger,
    //   () => this.dirname,
    //   () => this.#slides,
    //   () => this.configuration,
    //   this.extensionContext.extensionPath,
    //   () => this.isInExport,
    //   () => this.exportPath,
    // )

    this.#slideParser = new SlideParser()
    this.#slideParser.onDidParse(e => {
      this.#log(`SlideParser`, `frontmatter:${e.frontmatter.bodyBegin > 1} - slides:${e.slides.length}`)
      this.#slides = e.slides
      this.#configurationProvider.documentConfig = e.frontmatter.attributes}
    )

    this.#TextDecorator = new TextDecorator(configDesc)

    this.#currentContext?.server.onDidStart( uri => {
      this.#log(`Server`,`started on ${uri}`)
      this.#statusBarController.updateServerInfo(uri)
    })

    this.#currentContext?.server.onDidStop(() => {
      this.#log(`Server`, `stopped`)
      this.#statusBarController.updateServerInfo(null)
    })

    this.#currentContext?.server.onDidError( (err) => this.#logError(`Server`, `${err.message}`))

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
    if(!this.#currentContext) return

    if(this.#refreshTimeout) { clearTimeout(this.#refreshTimeout) }
    this.#refreshTimeout = setTimeout(() => {
        if(!this.#currentContext) return

        this.logger.log(`REFRESH START!`)
        const {frontmatter,slides} = this.#slideParser.parse(this.#currentContext.editor.document.getText(), this.configuration)
        this.#slides = slides
        this.#frontMatterResult = frontmatter
        this.#configurationProvider.documentConfig = frontmatter.attributes

        this.refreshWebViewPane()
        this.#slidesExplorer.update()
        this.#statusBarController.updateCount(this.#slides.length)
        this.#TextDecorator.update(this.#currentContext.editor)
        this.logger.log(`REFRESH DONE!`)
    }, wait)
  }

  updatePosition(cursorPosition: Position) {
    if(!this.#currentContext) return
    const start = new Position(0, 0)
    const range = new Range(start, cursorPosition)
    const {slides} =this.#slideParser.parse(this.#currentContext.editor.document.getText(range), this.configuration, false)
    const currentSlide = slides[slides.length - 1]

    this.#position = currentSlide.verticalChildren
      ? { horizontal: slides.length - 1, vertical: currentSlide.verticalChildren.length }
      : { horizontal: slides.length - 1, vertical: 0 }
  }

  get uri() {
    const {horizontal,vertical} = this.#position
    return `${this.#currentContext?.server.uri}#/${horizontal}/${vertical}/${Date.now()}`
  }

  public get exportPath(): string {
    return path.isAbsolute(this.configuration.exportHTMLPath)
      ? this.configuration.exportHTMLPath
      : path.join(this.dirname, this.configuration.exportHTMLPath)
  }

  
  public goToSlide(topindex: number, verticalIndex: number) {
    if(!this.#currentContext) return

    const linesCount = countLinesToSlide(this.#slides, topindex, verticalIndex) + (this.#frontMatterResult?.frontmatter ? this.#frontMatterResult.bodyBegin : 0)

    const position = new Position(linesCount, 0)
    this.#currentContext.editor.selections = [new Selection(position, position)]
    this.#currentContext.editor.revealRange(new Range(position, position.translate(20)))
  }

  public showWebViewPane(webviewPanel:WebviewPanel ){
    if(!this.#webViewPane){
      this.#webViewPane = new WebViewPane(webviewPanel)
      this.refreshWebViewPane()
    }
  }

  private refreshWebViewPane(){
    if(this.#webViewPane){
      this.startServer()
      this.#webViewPane.title = this.configuration.title
      this.#webViewPane.update(this.uri)
      this.#webViewPane.onDidDispose(()=> {
        this.#log("WebView", "disposed")
        this.#webViewPane = undefined
      })
  }}

  /** Start server on an available port */
  public startServer(){
    this.#currentContext?.server.start()
    return this.#currentContext?.server.uri;
  }

  /** Stop server from listening */
  public stopServer() { 
    this.#currentContext?.server.stop()
  }


  private createContext(editor){
    if(editor){
      const context = { editor:editor, server:new RevealServer(
        this.logger,
        () => this.dirname,
        () => this.#slides,
        () => this.configuration,
        this.extensionContext.extensionPath,
        () => this.isInExport,
        () => this.exportPath,
      ) }

      this.#revealContexts.set(editor.document.fileName, context)

    }
  }

  
}

