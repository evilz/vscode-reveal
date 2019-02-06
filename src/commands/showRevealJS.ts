import * as vscode from 'vscode'
export const SHOW_REVEALJS = 'vscode-revealjs.showRevealJS'
export type SHOW_REVEALJS = typeof SHOW_REVEALJS

export const showRevealJS = (refreshCb: (view: vscode.Webview) => void) => () => {
  const panel = vscode.window.createWebviewPanel('RevealJS', 'Reveal JS presentation', vscode.ViewColumn.Beside, { enableScripts: true })
  refreshCb(panel.webview)
}
