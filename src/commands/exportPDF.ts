import open from 'open'

export const EXPORT_PDF = 'vscode-revealjs.exportPDF'
export type EXPORT_PDF = typeof EXPORT_PDF

export const exportPDF = (getUri: () => string | undefined) => () => {
  const uri = getUri()
  if (uri === undefined) {
    return
  }
  const url = uri + '?print-pdf-now'
  return open(url)
}
