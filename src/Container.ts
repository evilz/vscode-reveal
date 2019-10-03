/**
 * @summary Container is a main god object that connect server, document, statusbar, iframe
 * @author Vincent B. <evilznet@gmail.com>
 */
import {
  commands,
  ConfigurationChangeEvent,
  ExtensionContext,
  TextDocument,
  TextDocumentChangeEvent,
  TextEditor,
  TextEditorSelectionChangeEvent,
  Webview
} from 'vscode'

import * as http from 'http'

import * as jetpack from "fs-jetpack";
import * as path from 'path'

import { SHOW_REVEALJS } from './commands/showRevealJS'
import { Configuration, getDocumentOptions } from './Configuration'
import { extensionId } from './constants'
import { EditorContext } from './EditorContext'
import { ISlide } from './ISlide'
import { Logger } from './Logger'
import { RevealServer } from './RevealServer'
import { SlideTreeProvider } from './SlideExplorer'
import { StatusBarController } from './StatusBarController'

export default class Container {
  private readonly server: RevealServer
  private readonly statusBarController: StatusBarController
  private readonly slidesExplorer: SlideTreeProvider
  private editorContext: EditorContext | null
  private _configuration: Configuration
  private webView: Webview | null

  public onDidChangeTextEditorSelection(event: TextEditorSelectionChangeEvent) {
    if (this.editorContext === null) {
      return
    }
    if (event.textEditor !== this.editorContext.editor || event.selections.length === 0) {
      return
    }

    const end = event.selections[0].active
    this.editorContext.updatePosition(end)

    this.refreshWebView()
    // this.iframeProvider.update()
    this.editorContext.refresh() // dont change this order !!!!!!
    this.statusBarController.update()
    this.slidesExplorer.update()
  }

  public onDidChangeActiveTextEditor(editor: TextEditor | undefined): any {
    if (editor && editor.document.languageId === 'markdown') {
      this.editorContext = new EditorContext(editor, getDocumentOptions(this.configuration))
    }
    this.server.start()
    this.refreshWebView()
    this.statusBarController.update()
    this.slidesExplorer.update()
  }

  public onDidChangeTextDocument(e: TextDocumentChangeEvent) {
    console.log('onDidChangeTextDocument')
  }

  public onDidSaveTextDocument(e: TextDocument) {
    console.log('onDidSaveTextDocument')
  }

  public onDidCloseTextDocument(e: TextDocument) {
    console.log('onDidCloseTextDocument')
  }

  public onDidChangeConfiguration(e: ConfigurationChangeEvent) {
    if (!e.affectsConfiguration(extensionId)) {
      return
    }

    this._configuration = this.loadConfiguration()
    this.logger.LogLevel = this._configuration.logLevel
  }

  public constructor(private readonly loadConfiguration: () => Configuration, private readonly logger: Logger, private readonly extensionContext: ExtensionContext) {
    this._configuration = this.loadConfiguration()

    this.editorContext = null

    this.server = new RevealServer(
      this.logger,
      () => this.rootDir,
      () => this.slides,
      () => this.configuration,
      this.extensionContext.extensionPath,
      () => this.isInExport,
      () => this.exportPath
    )

    this.statusBarController = new StatusBarController(() => this.server.uri, () => this.slideCount)
    this.statusBarController.update()

    this.slidesExplorer = new SlideTreeProvider(() => this.slides)
    this.slidesExplorer.register()
  }

  private get rootDir() {
    if (this.editorContext) {
      return this.editorContext.dirname
    }
    return ''
  }

  public get configuration() {
    return this.editorContext !== null && this.editorContext.hasfrontConfig
      ? // tslint:disable-next-line:no-object-literal-type-assertion
      ({ ...this._configuration, ...this.editorContext.documentOptions } as Configuration)
      : this._configuration
  }

  public get isInExport() { return this.exportTimeout !== null }

  private exportTimeout: NodeJS.Timeout | null = null
  public export = async () =>  {
    
          if(this.exportTimeout !== null) {
            clearTimeout(this.exportTimeout)
          }
          await jetpack.removeAsync(this.exportPath)
          

          const promise = new Promise<string>((resolve) => { 
            this.exportTimeout = setTimeout(() => resolve(this.exportPath), 5000)
            
            })
            this.webView ? this.refreshWebView() : await commands.executeCommand(SHOW_REVEALJS)
            http.get(this.getUri(false) + "libs/reveal.js/3.8.0/plugin/notes/notes.html");
          
          return promise
      //   } catch (e) {
      //     return this.configuration.exportHTMLPath;
      //     console.error(e);

      // }
    
    
  }


  get slides(): ISlide[] {
    return this.editorContext === null ? [] : this.editorContext.slides
  }

  get slideCount(): number {
    return this.editorContext === null ? 0 : this.editorContext.slideCount
  }

  public getUri(withPosition = true): string | null {
    if (!this.server.isListening || this.editorContext === null) {
      return null
    }

    const serverUri = this.server.uri
    const slidepos = this.editorContext.position

    return withPosition ? `${serverUri}#/${slidepos.horizontal}/${slidepos.vertical}/${Date.now()}` : `${serverUri}`
  }

  public get exportPath():string {
    return path.isAbsolute(this.configuration.exportHTMLPath) 
            ? this.configuration.exportHTMLPath 
            : path.join(this.rootDir, this.configuration.exportHTMLPath)
  } 

  public isMarkdownFile() {
    return this.editorContext === null ? false : this.editorContext.isMarkdownFile
  }

  public goToSlide(topindex: number, verticalIndex: number) {
    if (this.editorContext !== null) {
      this.editorContext.goToSlide(topindex, verticalIndex)
    }

    this.refreshWebView()
  }

  public stopServer() {
    this.server.stop()
    this.statusBarController.update()
  }

  public refreshWebView(view?: Webview) {
    if (view) {
      this.webView = view
    }

    if (this.webView) {
      this.webView.html = `<style>html, body, iframe { height: 100% }</style>
      <iframe src="${this.getUri()}" frameBorder="0" style="width: 100%; height: 100%" />`
    }
  }
}
