'use strict'

import { commands, ExtensionContext, window, workspace } from 'vscode'
import { getChromePath } from './BrowserHelper'
import { EXPORT_HTML, exportHTML } from './commands/exportHTML'
import { EXPORT_PDF, exportPDF } from './commands/exportPDF'
import { GO_TO_SLIDE } from './commands/goToSlide'
import { SHOW_REVEALJS, showRevealJS } from './commands/showRevealJS'
import { SHOW_REVEALJS_IN_BROWSER, showRevealJSInBrowser } from './commands/showRevealJSInBrowser'
import { STOP_REVEALJS_SERVER } from './commands/stopRevealJSServer'
import { loadConfiguration } from './Configuration'
import { extensionId } from './constants'
import Container from './Container'

export function activate(context: ExtensionContext) {
  const registerCommand = (command: string, callback: (...args: any[]) => any, thisArg?: any) => {
    const disposable = commands.registerCommand(command, callback, thisArg)
    context.subscriptions.push(disposable)
  }

  const container = new Container(() => loadConfiguration(() => workspace.getConfiguration(extensionId) as any))

  container.onDidChangeActiveTextEditor(window.activeTextEditor)

  const getBrowser = () => {
    const fromConf = container.configuration.browserPath
    return fromConf === null ? getChromePath() : fromConf
  }

  console.log('"vscode-reveal" is now active')
  commands.executeCommand('setContext', 'slideExplorerEnabled', container.configuration.slideExplorerEnabled)
  // COMMANDS

  // move this directly in command file
  // registerCommand(SHOW_REVEALJS, showRevealJS(() => container.isMarkdownFile(), container.iframeProvider))
  registerCommand(SHOW_REVEALJS, showRevealJS(view => container.refreshWebView(view)))
  registerCommand(SHOW_REVEALJS_IN_BROWSER, showRevealJSInBrowser(() => container.getUri(), getBrowser))
  registerCommand(STOP_REVEALJS_SERVER, () => container.stopServer())

  registerCommand(GO_TO_SLIDE, arg => container.goToSlide(arg.horizontal, arg.vertical))
  registerCommand(EXPORT_PDF, exportPDF(() => container.getUri(false), getBrowser))
  registerCommand(EXPORT_HTML, exportHTML(() => container.startExport(), () => container.configuration.openFilemanagerAfterHTMLExport))

  // ON SELECTION CHANGE
  window.onDidChangeTextEditorSelection(e => container.onDidChangeTextEditorSelection(e))

  // ON TAB CHANGE
  window.onDidChangeActiveTextEditor(e => container.onDidChangeActiveTextEditor(e))

  // ON CHANGE TEXT
  workspace.onDidChangeTextDocument(e => container.onDidChangeTextDocument(e))

  // ON SAVE
  workspace.onDidSaveTextDocument(e => container.onDidSaveTextDocument(e))

  workspace.onDidCloseTextDocument(e => container.onDidCloseTextDocument(e))

  workspace.onDidChangeConfiguration(e => container.onDidChangeConfiguration(e))
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('"vscode-reveal" is now deactivated')
}
