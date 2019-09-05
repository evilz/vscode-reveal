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
import { Logger } from './Logger'

export function activate(context: ExtensionContext) {
  const registerCommand = (command: string, callback: (...args: any[]) => any, thisArg?: any) => {
    const disposable = commands.registerCommand(command, callback, thisArg)
    context.subscriptions.push(disposable)
  }

  const loadConfigurationFn = () => loadConfiguration(() => workspace.getConfiguration(extensionId) as any)
  const startingConfig = loadConfigurationFn()

  const outputChannel = window.createOutputChannel(extensionId)

  const appendLine = (value: string) => outputChannel.appendLine(value)

  const logger = new Logger(startingConfig.logLevel, appendLine)

  const container = new Container(loadConfigurationFn, logger, context)

  container.onDidChangeActiveTextEditor(window.activeTextEditor)

  const getBrowser = () => {
    const fromConf = container.configuration.browserPath
    return fromConf === null ? getChromePath() : fromConf
  }

  logger.log('"vscode-reveal" is now active')
  commands.executeCommand('setContext', 'slideExplorerEnabled', container.configuration.slideExplorerEnabled)

  registerCommand(SHOW_REVEALJS, showRevealJS(view => container.refreshWebView(view)))
  registerCommand(SHOW_REVEALJS_IN_BROWSER, showRevealJSInBrowser(() => container.getUri(), getBrowser))
  registerCommand(STOP_REVEALJS_SERVER, () => container.stopServer())

  registerCommand(GO_TO_SLIDE, arg => container.goToSlide(arg.horizontal, arg.vertical))
  registerCommand(EXPORT_PDF, exportPDF(() => container.getUri(false), getBrowser))
  registerCommand(
    EXPORT_HTML,
    exportHTML(logger, container.export, () => container.configuration.openFilemanagerAfterHTMLExport)
  )

  window.onDidChangeTextEditorSelection(e => container.onDidChangeTextEditorSelection(e))
  window.onDidChangeActiveTextEditor(e => container.onDidChangeActiveTextEditor(e))
  workspace.onDidChangeTextDocument(e => container.onDidChangeTextDocument(e))
  workspace.onDidSaveTextDocument(e => container.onDidSaveTextDocument(e))
  workspace.onDidCloseTextDocument(e => container.onDidCloseTextDocument(e))
  workspace.onDidChangeConfiguration(e => container.onDidChangeConfiguration(e))
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('"vscode-reveal" is now deactivated')
}
