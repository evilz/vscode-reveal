import { openInBrowser } from '../BrowserHelper'

export const EXPORT_PDF = 'vscode-revealjs.exportPDF'
export type EXPORT_PDF = typeof EXPORT_PDF

export const exportPDF = (getUri: () => string | null, getBrowserPath: () => string | null) => () => {
  const browserPath = getBrowserPath()
  if (browserPath === null) {
    throw new Error('No browser found')
  }
  const uri = getUri()
  if (uri === null) {
    return
  }
  const url = uri + '?print-pdf-now'
  return openInBrowser(browserPath, url)
}
