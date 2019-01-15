/**
 * @summary Container is a main god object that connect server, document, statusbar, iframe
 * @author Vincent B. <evilznet@gmail.com>
 */
import {
  ConfigurationChangeEvent,
  Disposable,
  TextDocument,
  TextDocumentChangeEvent,
  TextEditor,
  TextEditorSelectionChangeEvent,
  Uri,
  Webview
} from 'vscode'

import { Configuration, getDocumentOptions } from './Configuration'
import { extensionId } from './constants'
import { EditorContext } from './EditorContext'
import { ExportMode, saveContent } from './ExportHTML'
import { ISlide } from './ISlide'
import { RevealServer } from './RevealServer'
import { SlideTreeProvider } from './SlideExplorer'
import { StatusBarController } from './StatusBarController'

import * as http from 'http'

export default class Container {
  private server: RevealServer
  private statusBarController: StatusBarController
  private slidesExplorer: SlideTreeProvider
  private editorContext: EditorContext | null
  private configuration: Configuration
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
    this.server.refresh()
    this.refreshWebView()
    this.statusBarController.update()
    this.slidesExplorer.update()
  }

  public onDidChangeTextDocument(e: TextDocumentChangeEvent) {
    console.log('onDidChangeTextDocument')
  }

  public onDidSaveTextDocument(e: TextDocument) {
    //   if (document === vscode!.window!.activeTextEditor!.document) {
    //     refreshAll()
    //   }
  }

  public onDidCloseTextDocument(e: TextDocument) {
    console.log('onDidCloseTextDocument')
  }

  public onDidChangeConfiguration(e: ConfigurationChangeEvent) {
    if (!e.affectsConfiguration(extensionId, null!)) {
      return
    }

    this.configuration = this.loadConfiguration()
  }

  public constructor(private loadConfiguration: () => Configuration) {
    this.configuration = this.loadConfiguration()

    this.editorContext = null

    this.server = new RevealServer(this.getRootDir, this.getSlideContent, this.getConfiguration, this.getExportMode, this.saveHtmlFn)

    this.statusBarController = new StatusBarController(() => this.server.uri, () => this.slideCount)
    this.statusBarController.update()

    this.slidesExplorer = new SlideTreeProvider(() => this.slides)
    this.slidesExplorer.register()
  }

  private getRootDir = () => {
    if (this.editorContext) {
      return this.editorContext.dirname
    }
    return null
  }
  private getSlideContent = () => {
    if (this.editorContext) {
      return this.editorContext.slideContent
    }
    return null
  }
  public getConfiguration = () => {
    return this.editorContext !== null && this.editorContext.hasfrontConfig
      ? // tslint:disable-next-line:no-object-literal-type-assertion
        ({ ...this.configuration, ...this.editorContext.documentOptions } as Configuration)
      : this.configuration
  }

  private exportMode = ExportMode.No
  private getExportMode = () => this.exportMode
  public setExportMode() {
    this.exportMode = ExportMode.Export
  }

  private saveHtmlFn = req => saveContent(this.getExportPath, this.getRootDir, null, req)

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

  public getExportPath() {
    return this.configuration.exportHTMLPath ? this.configuration.exportHTMLPath : this.getRootDir()
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
