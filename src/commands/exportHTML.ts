import { openInBrowser } from '../BrowserHelper'

export const EXPORT_HTML = 'vscode-revealjs.exportHTML'
export type EXPORT_HTML = typeof EXPORT_HTML

function* gene() {
  yield 1
}
export const exportHTML = (setExportMode: () => void, getUri: () => string | null, getBrowserPath: () => string | null) => async () => {
  const uri = getUri()
  if (uri === null) {
    return
  }

  const browserPath = getBrowserPath()
  if (browserPath === null) {
    throw new Error('No browser found')
  }

  // REPORT FROM MIDDLEWARE !!!
  // window.withProgress({ location: ProgressLocation.Window, title: 'hello' }, p => {
  //   return new Promise((resolve, reject) => {
  //     p.report({ message: 'Start exporting html...' })
  //     const handle = setInterval(() => {
  //       p.report({ message: 'Export to html done' })
  //       clearInterval(handle)
  //       resolve()
  //     }, 9000) // tell ok in 9s
  //   })
  // })

  // vscode.window.withProgress('$(gear) export to html...')

  setExportMode()
  // currentContext.SetInExportMode(() => {
  //   const path = getExportFolderPath(currentContext)
  //   if (getExtensionOptions().openFilemanagerAfterHTMLExport) {
  //     opn(path)
  //   }
  // })
  openInBrowser(browserPath, uri, true)
  openInBrowser(browserPath, `${uri}plugin/notes/notes.html`, true)
}
