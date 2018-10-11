import { VSCodeRevealContext } from '../VSCodeRevealContext'
import * as vscode from 'vscode'
import { SHOW_REVEALJS_IN_BROWSER } from './showRevealJSInBrowser'
import * as opn from 'opn'
import { getExportFolderPath } from '../ExportHTML'
import { openInBrowser } from '../BrowserHelper'
import { getExtensionOptions } from '../Configuration'

export const EXPORT_HTML = 'vscode-revealjs.exportHTML'
export type EXPORT_HTML = typeof EXPORT_HTML

export const exportHTML = (getContext: (() => VSCodeRevealContext)) => async () => {
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
    const path = getExportFolderPath(currentContext)
    if (getExtensionOptions().openFilemanagerAfterHMLTExport) {
      opn(path)
    }
  })
  openInBrowser(getExtensionOptions(), currentContext.uri, true)
  openInBrowser(getExtensionOptions(), `${currentContext.server.uri}plugin/notes/notes.html`, true)
}
