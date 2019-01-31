import * as opn from 'opn'

export const EXPORT_HTML = 'vscode-revealjs.exportHTML'
export type EXPORT_HTML = typeof EXPORT_HTML

export const exportHTML = (startExport: () => Promise<string>, doOpenAfterExport: () => boolean) => async () => {
  const path = await startExport()
  if (doOpenAfterExport()) {
    opn(path)
    console.log('End export !!!' + path)
  }
}
