/*
 * Filename: c:\DATA\GITHUB\vscode-reveal\src\extension.ts
 * Path: c:\DATA\GITHUB\vscode-reveal
 * Created Date: Wednesday, October 23rd 2019, 2:31:17 pm
 * Author: Vincent Bourdon
 * 
 * Copyright (c) 2022 Your Company
 */

'use strict'

import { commands, ExtensionContext, window, workspace } from 'vscode'
import { EXPORT_HTML, exportHTML } from './commands/exportHTML'
import { EXPORT_PDF, exportPDF } from './commands/exportPDF'
import { GO_TO_SLIDE } from './commands/goToSlide'
import { SHOW_REVEALJS } from './commands/showRevealJS'
import { SHOW_REVEALJS_IN_BROWSER, showRevealJSInBrowser } from './commands/showRevealJSInBrowser'
import { showSample, SHOW_SAMPLE } from './commands/showSample'
import { STOP_REVEALJS_SERVER } from './commands/stopRevealJSServer'
import languageCompletion from './CompletionItemProvider'
import MainController from './MainController'
import Logger from './Logger'
import {getConfigurationDescription, getConfig} from './Configuration'

export function activate(context: ExtensionContext) {
  const config = getConfig()
  
  const outputChannel = window.createOutputChannel(context.extension.packageJSON.displayName)
  const logger = new Logger( (s) => outputChannel.appendLine(s), config.logLevel )
  //logger.onDidLevelChanged(level => logger.info(`log level changed to ${level} `))
  logger.info('"vscode-reveal" is now active')

  const configDesc = getConfigurationDescription(context.extension.packageJSON.contributes.configuration.properties)

  const main = new MainController(logger, context, configDesc, config, window.activeTextEditor)

  
  commands.executeCommand('setContext', 'slideExplorerEnabled', config.slideExplorerEnabled)

  const registerCmd = (cmdName, fn) => {
    const inner = (arg) => {
      logger.info(`Execute command ${cmdName}`)
      fn(arg)
    }
    return commands.registerCommand(cmdName, inner)
  }

  context.subscriptions.push(
    registerCmd(SHOW_REVEALJS, () => main.showWebViewPane()  ),
    registerCmd(SHOW_REVEALJS_IN_BROWSER, showRevealJSInBrowser(() =>main.currentContext?.startServer() )),
    registerCmd(STOP_REVEALJS_SERVER, () => main.stopServer()),
    registerCmd(SHOW_SAMPLE, () => showSample(context.extensionPath)),
    registerCmd(GO_TO_SLIDE, (arg) => main.goToSlide(arg.horizontal, arg.vertical)),
    registerCmd(EXPORT_PDF,exportPDF(() => main.currentContext?.startServer())),
    registerCmd(EXPORT_HTML,exportHTML(logger, main.exportAsync, main.shouldOpenFilemanagerAfterHTMLExport)),

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
