import { VSCodeRevealContext } from '../VSCodeRevealContext'
import * as vscode from 'vscode'
import { SHOW_REVEALJS_IN_BROWSER } from './showRevealJSInBrowser'
import * as opn from 'opn'
import { getExportFolderPath } from '../ExportHTML'
import { openInChrome } from '../ChromeHelper'

export const EXPORT_HTML = 'vscode-revealjs.exportHTML'
export type EXPORT_HTML = typeof EXPORT_HTML

export const exportHTML = (getContext: (() => VSCodeRevealContext)) => async (topindex: number, verticalIndex: number) => {
  vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'hello' }, p => {
    return new Promise((resolve, reject) => {
      p.report({ message: 'Start exporting html...' })
      const handle = setInterval(() => {
        p.report({ message: 'Export to html done' })
        clearInterval(handle)
        resolve()
      }, 9000)
    })
  })

  // vscode.window.withProgress('$(gear) export to html...')
  const currentContext = getContext()
  if (currentContext === undefined) {
    return
  }

  currentContext.SetInExportMode(() => {
    opn(getExportFolderPath(currentContext))
  })

  openInChrome(currentContext.uri, true)

  // TODO : flag in context then refresh preview or call chrome in heqdless ?
}
