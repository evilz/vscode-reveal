import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'
import { saveHtml } from './ExportHTML'
import { savePdf } from './ExportPDF'
import IframeContentProvider from './IframeContentProvider'
import { ISlide } from './Models'
import { countLines, countLinesToSlide } from './SlideParser'
import { VSCodeRevealContext } from './VSCodeRevealContext'
import { openInChrome } from "./ChromeHelper";
import * as opn from 'opn'


const VSCODE_PREVIEWHTML = 'vscode.previewHtml'
export type VSCODE_PREVIEWHTML = typeof VSCODE_PREVIEWHTML

export const SHOW_REVEALJS = 'vscode-revealjs.showRevealJS'
export type SHOW_REVEALJS = typeof SHOW_REVEALJS

export const showRevealJS = (getContext: (() => VSCodeRevealContext), iframeProvider: IframeContentProvider) => async () => {
  const currentContext = getContext()
  if (currentContext === undefined || currentContext.editor.document.languageId !== 'markdown') {
    vscode.window.showInformationMessage('revealjs presentation can only be markdown file')
    return
  }

  try {
    await vscode.commands.executeCommand(VSCODE_PREVIEWHTML, iframeProvider.previewUri, vscode.ViewColumn.Two, 'Reveal JS presentation')
    await vscode.commands.executeCommand('workbench.action.previousEditor')
    console.log('show RevealJS presentation in new tab')
  } catch (error) {
    vscode.window.showErrorMessage(error)
  }
}

export const SHOW_REVEALJS_IN_BROWSER = 'vscode-revealjs.showRevealJSInBrowser'
export type SHOW_REVEALJS_IN_BROWSER = typeof SHOW_REVEALJS_IN_BROWSER

export const showRevealJSInBrowser = (getContext: (() => VSCodeRevealContext)) => () => {
  const context = getContext()
  return openInChrome(context.uri)
}

export const STOP_REVEALJS_SERVER = 'vscode-revealjs.stopRevealJSServer'
export type STOP_REVEALJS_SERVER = typeof STOP_REVEALJS_SERVER

export const stopRevealJSServer = (getContext: (() => VSCodeRevealContext), statusBarController) => () => {
  const currentContext = getContext()
  if (currentContext === undefined) {
    return
  }
  currentContext.server.stop()
  statusBarController.update()
}

export const GO_TO_SLIDE = 'vscode-revealjs.goToSlide'
export type GO_TO_SLIDE = typeof GO_TO_SLIDE

export const goToSlide = (getContext: (() => VSCodeRevealContext)) => (topindex: number, verticalIndex: number) => {
  const currentContext = getContext()
  if (currentContext === undefined || topindex === undefined) {
    return
  }

  const linesCount = countLinesToSlide(currentContext.slides, topindex, verticalIndex) + currentContext.frontMatterLineCount

  const position = new vscode.Position(linesCount + 1, 0) // ugly + 1 to go to real first line

  currentContext.editor.selections = [new vscode.Selection(position, position)]
  currentContext.editor.revealRange(new vscode.Range(position, position.translate(20)))
}

export const EXPORT_PDF = 'vscode-revealjs.exportPDF'
export type EXPORT_PDF = typeof EXPORT_PDF

export const exportPDF = (getContext: (() => VSCodeRevealContext)) => (topindex: number, verticalIndex: number) => {
  try {
    const currentContext = getContext()
    if (currentContext === undefined) {
      return
    }
    const url = currentContext.server.uri.toString() + '?print-pdf-now'
    openInChrome(url)

    // savePdf(url, currentContext.editor.document.fileName.replace('.md', '.pdf'))
    //   .then((f) => {
    //     open(f)
    //     vscode.window.showInformationMessage('completed')
    //   })
    //   .catch(err => {
    //     vscode.window.showErrorMessage('Cannot save pdf: ' + err)
    //   })

    // USE https://github.com/GoogleChrome/chrome-launcher
    // LAUNCH CHROME and print
    // "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --headless --print-to-pdf="d:\\{{path and file name}}.pdf" https://google.com
  } catch (err) {
    vscode.window.showErrorMessage(err)
  }
}

export const EXPORT_HTML = 'vscode-revealjs.exportHTML'
export type EXPORT_HTML = typeof EXPORT_HTML

export const exportHTML = (getContext: (() => VSCodeRevealContext)) => (topindex: number, verticalIndex: number) => {
  const currentContext = getContext()
  if (currentContext === undefined) {
    return
  }
  saveHtml(currentContext.uri, currentContext.editor.document.fileName.replace('.md', ''))
    .then(dirPath => opn(dirPath))
    .catch(err => {
      vscode.window.showErrorMessage('Cannot save pdf: ' + err)
    })
}
