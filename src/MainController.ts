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
  TextDocument,
  TextDocumentChangeEvent,
  TextEditor,
  TextEditorSelectionChangeEvent,
  ViewColumn,
  window,
} from 'vscode'

import * as jetpack from 'fs-jetpack'

import { SHOW_REVEALJS } from './commands/showRevealJS'
import Logger from './Logger'
import { SlideTreeProvider } from './SlideExplorer'
import { StatusBarController } from './StatusBarController'
import WebViewPane from './WebViewPane'
import TextDecorator from './TextDecorator'
import { RevealContext, RevealContexts } from './RevealContext'
import { configPefix, Configuration, ConfigurationDescription, getConfig } from './Configuration'

const isMarkdownFile = (d: TextDocument) => d.languageId === 'markdown'

export default class MainController {
  readonly #statusBarController: StatusBarController
  readonly #slidesExplorer: SlideTreeProvider
  readonly #TextDecorator: TextDecorator

  #webViewPane?: WebViewPane

  public currentContext?: RevealContext
  readonly #revealContexts: RevealContexts

  get ServerUri() {
    return this.currentContext?.server.uri
  }

  //#### connect vs code event
  public onDidChangeTextEditorSelection(event: TextEditorSelectionChangeEvent) {
    if (this.currentContext !== undefined && this.currentContext.is(event.textEditor.document)) {
      const selection = event.selections.length > 0 ? event.selections[0] : event.textEditor.selection
      this.OnEditorEvent(event.textEditor, selection.active)
    }
  }

  private OnEditorEvent(editor: TextEditor | undefined, newPosition: Position) {
    if (editor && isMarkdownFile(editor.document)) {
      this.currentContext = this.#revealContexts.getOrAdd(editor)
      this.updatePosition(newPosition)
      this.refresh()
    }
  }

  public onDidChangeActiveTextEditor(editor?: TextEditor) {
    if (editor !== undefined) {
      this.logger.debug(`onDidChangeActiveTextEditor: ${editor.document.fileName}`)
      this.OnEditorEvent(editor, editor.selection.active)
    }
  }

  public onDidChangeTextDocument(e: TextDocumentChangeEvent) {
    if (this.currentContext?.is(e.document)) {
      this.logger.debug(`onDidChangeTextDocument: ${e.document.fileName}`)
      this.refresh()
    }
  }

  public onDidSaveTextDocument(document: TextDocument) {
    if (this.currentContext?.is(document)) {
      // ADD debug level
      this.logger.debug(`onDidSaveTextDocument: ${document.fileName}`)
      this.refresh()
    }
    // ADD debug level
    //this.logger.log(`onDidSaveTextDocument: ${e.fileName}`)
  }

  public onDidCloseTextDocument(document: TextDocument) {
    if (this.currentContext?.is(document)) {
      this.currentContext = undefined
      this.#revealContexts.remove(document.uri)
      this.logger.debug(`onDidCloseTextDocument ${document.uri}`)
    }
  }

  public onDidChangeConfiguration(e: ConfigurationChangeEvent) {
    if (!e.affectsConfiguration(configPefix)) {
      return
    }
    this.config = getConfig()
  }

  public constructor(
    private readonly logger: Logger,
    private readonly extensionContext: ExtensionContext,
    private readonly configDesc: ConfigurationDescription[],
    private config: Configuration,
    currentEditor: TextEditor | undefined
  ) {
    this.#statusBarController = new StatusBarController()
    this.#TextDecorator = new TextDecorator(configDesc)
    this.#revealContexts = new RevealContexts(
      logger,
      () => this.config,
      extensionContext.extensionPath,
      () => this.isInExport
    )

    if (currentEditor && isMarkdownFile(currentEditor.document)) {
      this.currentContext = this.#revealContexts.getOrAdd(currentEditor)
    }

    this.#slidesExplorer = new SlideTreeProvider(() => (this.currentContext ? this.currentContext.slides : []))
    this.#slidesExplorer.register()
    this.#slidesExplorer.onDidChangeTreeData(() => this.#logInfo(`SlideTreeProvider`, `updated`))
  }

  #logInfo(component: string, message: string) {
    this.logger.info(`"${component.toUpperCase()}": ${message}`)
  }
  #logError(component: string, message: string) {
    this.logger.error(`"${component.toUpperCase()}": ${message}`)
  }

  // active export during 5 seconds
  #exportTimeout: NodeJS.Timeout | null = null
  public get isInExport() {
    return this.#exportTimeout !== null
  }

  public shouldOpenFilemanagerAfterHTMLExport() {
    if (this.currentContext) {
      return this.currentContext.configuration.openFilemanagerAfterHTMLExport
    }
    return false
  }

  public exportAsync = async () => {
    if (this.#exportTimeout !== null) {
      clearTimeout(this.#exportTimeout)
    }
    if (this.currentContext !== undefined) { await jetpack.removeAsync(this.currentContext.exportPath) }

    const promise = new Promise<string>((resolve) => {
      this.#exportTimeout = setTimeout(() => resolve(this.currentContext == undefined ? '' : this.currentContext.exportPath), 5000)
    })
    this.#webViewPane ? this.refreshWebViewPane() : await commands.executeCommand(SHOW_REVEALJS)

    return promise
  }

  // debounce parse and refresh
  #refreshTimeout: NodeJS.Timeout | null = null
  refresh(wait = 500) {
    if (!this.currentContext) return

    if (this.#refreshTimeout) {
      clearTimeout(this.#refreshTimeout)
    }
    this.#refreshTimeout = setTimeout(() => {
      if (!this.currentContext) return

      this.logger.info(`REFRESH START!`)
      const { slides } = this.currentContext.refresh()

      this.refreshWebViewPane()
      this.#slidesExplorer.update()
      this.#statusBarController.updateCount(slides.length)
      this.#TextDecorator.update(this.currentContext.editor)
      this.logger.info(`REFRESH DONE!`)
    }, wait)
  }

  updatePosition(cursorPosition: Position) {
    if (!this.currentContext) return
    this.currentContext.updatePosition(cursorPosition)
  }

  public goToSlide(topindex: number, verticalIndex: number) {
    if (this.currentContext) this.currentContext.goToSlide(topindex, verticalIndex)
  }

  /**
   * Create Web view pane if not exists
   * @returns return false if pane already exists
   */
  public showWebViewPane() {
    if (this.#webViewPane) {
      this.refreshWebViewPane()
      return false
    } else {
      const webviewPanel = window.createWebviewPanel('RevealJS', 'Reveal JS presentation', ViewColumn.Beside, { enableScripts: true })
      this.#webViewPane = new WebViewPane(webviewPanel)
      this.#webViewPane.onDidDispose(() => {
        this.#logInfo('WebView', 'disposed')
        this.#webViewPane = undefined
      })
      this.refreshWebViewPane()
      return true
    }
  }

  private refreshWebViewPane() {
    if (this.#webViewPane && this.currentContext != undefined) {
      this.startServer()
      this.#webViewPane.title = this.currentContext.configuration.title
      this.#webViewPane.update(this.currentContext.uri)
    }
  }

  /** Start server on an available port */
  public startServer() {
    this.currentContext?.startServer()
  }

  /** Stop server from listening */
  public stopServer() {
    this.currentContext?.server.stop()
  }
}
