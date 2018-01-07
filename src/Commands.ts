import open = require('open')
import * as vscode from 'vscode'
import IframeContentProvider from './IframeContentProvider'
import { ISlide } from './Models'
import { countLines, countLinesToSlide } from './SlideParser'
import { VSCodeRevealContext } from './VSCodeRevealContext'

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
  return open(context.uri)
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
