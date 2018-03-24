import { VSCodeRevealContext } from '../VSCodeRevealContext'
import { openInBrowser } from '../BrowserHelper'
import * as vscode from 'vscode'
import { getExtensionOptions } from '../Configuration';

export const EXPORT_PDF = 'vscode-revealjs.exportPDF'
export type EXPORT_PDF = typeof EXPORT_PDF

export const exportPDF = (getContext: (() => VSCodeRevealContext)) => (topindex: number, verticalIndex: number) => {
  try {
    const currentContext = getContext()
    if (currentContext === undefined) {
      return
    }
    const url = currentContext.server.uri.toString() + '?print-pdf-now'
    openInBrowser(getExtensionOptions(), url)
  } catch (err) {
    vscode.window.showErrorMessage(err)
  }
}
