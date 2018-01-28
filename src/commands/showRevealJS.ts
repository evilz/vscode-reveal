import { VSCodeRevealContext } from '../VSCodeRevealContext'
import IframeContentProvider from '../IframeContentProvider'
import * as vscode from 'vscode'

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
