import * as vscode from 'vscode'
// import IframeContentProvider from '../IframeContentProvider'

const VSCODE_PREVIEWHTML = 'vscode.previewHtml'
export type VSCODE_PREVIEWHTML = typeof VSCODE_PREVIEWHTML

export const SHOW_REVEALJS = 'vscode-revealjs.showRevealJS'
export type SHOW_REVEALJS = typeof SHOW_REVEALJS

export const showRevealJS = (refreshCb: ((view: vscode.Webview) => void)) => () => {
  const panel = vscode.window.createWebviewPanel('RevealJS', 'Reveal JS presentation', vscode.ViewColumn.Beside, { enableScripts: true })
  refreshCb(panel.webview)
}

// try {
//   await vscode.commands.executeCommand(VSCODE_PREVIEWHTML, iframeProvider.previewUri, vscode.ViewColumn.Two, 'Reveal JS presentation')
//   await vscode.commands.executeCommand('workbench.action.previousEditor')
//   console.log('show RevealJS presentation in new tab')
// } catch (error) {
//   vscode.window.showErrorMessage(error)
// }
// }
