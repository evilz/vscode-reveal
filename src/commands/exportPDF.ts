import open from 'open'

export const EXPORT_PDF = 'vscode-revealjs.exportPDF'
export type EXPORT_PDF = typeof EXPORT_PDF

export const exportPDF = (getUri: () => string | null) => () => {
  const uri = getUri()
  if (uri === null) {
    return
  }
  const url = uri + '?print-pdf-now'
  return open(url)
}
