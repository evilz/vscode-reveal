'use strict'

import { commands, ExtensionContext, window, workspace } from 'vscode'
import { EXPORT_HTML, exportHTML } from './commands/exportHTML'
import { EXPORT_PDF, exportPDF } from './commands/exportPDF'
import { GO_TO_SLIDE } from './commands/goToSlide'
import { SHOW_REVEALJS, showRevealJS } from './commands/showRevealJS'
import { SHOW_REVEALJS_IN_BROWSER, showRevealJSInBrowser } from './commands/showRevealJSInBrowser'
import { showSample, SHOW_SAMPLE } from './commands/showSample'
import { STOP_REVEALJS_SERVER } from './commands/stopRevealJSServer'
import languageCompletion from './CompletionItemProvider'
import MainController from './MainController'
import Logger from './Logger'
import { extensionId } from './utils'
import {getConfigurationDescription} from './Configuration'

export function activate(context: ExtensionContext) {
  
  const outputChannel = window.createOutputChannel(extensionId)
  const logger = new Logger( (s) => outputChannel.appendLine(s) )
  logger.on('levelChanged', level => logger.log(`log levelChanged to ${level} `))
  logger.log('"vscode-reveal" is now active')

  const configDesc = getConfigurationDescription(context.extension.packageJSON.contributes.configuration.properties)

  const main = new MainController(logger, context, configDesc, window.activeTextEditor)

  
  commands.executeCommand('setContext', 'slideExplorerEnabled', main.configuration.slideExplorerEnabled)


  context.subscriptions.push(
    commands.registerCommand(SHOW_REVEALJS, showRevealJS((panel) => main.showWebViewPane(panel))  ),
    commands.registerCommand(SHOW_REVEALJS_IN_BROWSER, showRevealJSInBrowser(() => main.ServerUri) ),
    commands.registerCommand(STOP_REVEALJS_SERVER, () => main.stopServer()),
    commands.registerCommand(SHOW_SAMPLE, () => showSample(context.extensionPath)),
    commands.registerCommand(GO_TO_SLIDE, (arg) => main.goToSlide(arg.horizontal, arg.vertical)),
    commands.registerCommand(EXPORT_PDF,exportPDF(() => main.ServerUri)),
    commands.registerCommand(EXPORT_HTML,exportHTML(logger, main.export, () => main.configuration.openFilemanagerAfterHTMLExport)),

    window.onDidChangeTextEditorSelection((e) => main.onDidChangeTextEditorSelection(e)),
    window.onDidChangeActiveTextEditor((e) => main.onDidChangeActiveTextEditor(e)),
    workspace.onDidChangeTextDocument((e) => main.onDidChangeTextDocument(e)),
    workspace.onDidSaveTextDocument((e) => main.onDidSaveTextDocument(e)),
    workspace.onDidCloseTextDocument((e) => main.onDidCloseTextDocument(e)),
    workspace.onDidChangeConfiguration((e) => main.onDidChangeConfiguration(e)),

    ...languageCompletion(configDesc)
  );


  setTimeout(() => main.refresh(0),500)

}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('"vscode-reveal" is now deactivated')
}
