import { VSCodeRevealContext } from '../VSCodeRevealContext'
import { openInChrome } from '../ChromeHelper'
import * as vscode from 'vscode'

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
  } catch (err) {
    vscode.window.showErrorMessage(err)
  }
}
