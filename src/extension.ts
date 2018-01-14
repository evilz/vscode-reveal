'use strict'
import open = require('open')
import * as vscode from 'vscode'
import {
  EXPORT_HTML,
  EXPORT_PDF,
  exportHTML,
  exportPDF,
  GO_TO_SLIDE,
  goToSlide,
  SHOW_REVEALJS,
  SHOW_REVEALJS_IN_BROWSER,
  showRevealJS,
  showRevealJSInBrowser,
  STOP_REVEALJS_SERVER,
  stopRevealJSServer
} from './Commands'
import IframeContentProvider from './IframeContentProvider'
import { RevealServerState } from './Models'
import { SlideTreeProvider } from './SlideExplorer'
import { StatusBarController } from './StatusBarController'
import { VSCodeRevealContext } from './VSCodeRevealContext'
import { VSCodeRevealContexts } from './VSCodeRevealContexts'

export function activate(context: vscode.ExtensionContext) {
  const registerCommand = (command: string, callback: (...args: any[]) => any, thisArg?: any) => {
    const disposable = vscode.commands.registerCommand(command, callback, thisArg)
    context.subscriptions.push(disposable)
  }

  const contexts = new VSCodeRevealContexts()
  const getContext = contexts.getContext.bind(contexts)

  // -- IframeContentProvider --
  const iframeProvider = new IframeContentProvider(getContext)
  iframeProvider.register()

  // -- Status --
  const statusBarController = new StatusBarController(getContext)
  statusBarController.update()

  // -- TreeExplorer --
  const slidesExplorer = new SlideTreeProvider(getContext)
  slidesExplorer.register()

  const refreshAll = () => {
    contexts.getContext().refresh()
    statusBarController.update()
    slidesExplorer.update()
    iframeProvider.update()
  }

  console.log('"vscode-reveal" is now active')

  // COMMANDS
  registerCommand(SHOW_REVEALJS, showRevealJS(getContext, iframeProvider))
  registerCommand(SHOW_REVEALJS_IN_BROWSER, showRevealJSInBrowser(contexts.getContext))
  registerCommand(STOP_REVEALJS_SERVER, stopRevealJSServer(contexts.getContext, statusBarController))
  registerCommand(GO_TO_SLIDE, goToSlide(contexts.getContext))
  registerCommand(EXPORT_PDF, exportPDF(contexts.getContext))
  registerCommand(EXPORT_HTML, exportHTML(contexts.getContext))

  // ON SELECTION CHANGE
  vscode.window.onDidChangeTextEditorSelection(e => {
    iframeProvider.update()
    contexts.getContext().refresh() // dont change this order !!!!!!
    statusBarController.update()
    slidesExplorer.update()
  })

  // ON TAB CHANGE
  vscode.window.onDidChangeActiveTextEditor(
    editor => {
      if (editor) {
        refreshAll()
      }
    },
    this,
    context.subscriptions
  )

  // ON CHANGE TEXT
  // vscode.workspace.onDidChangeTextDocument(
  //   e => {
  //     // refreshAll()
  //   },
  //   this,
  //   context.subscriptions
  // )

  // ON SAVE
  vscode.workspace.onDidSaveTextDocument(
    document => {
      if (document === vscode.window.activeTextEditor.document) {
        refreshAll()
      }
    },
    this,
    context.subscriptions
  )
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('"vscode-reveal" is now deactivated')
}
