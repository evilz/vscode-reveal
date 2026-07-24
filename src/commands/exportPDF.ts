import { openInBrowser } from './openExternal'

export const EXPORT_PDF = 'vscode-revealjs.exportPDF'
export type EXPORT_PDF = typeof EXPORT_PDF

type UriProvider = () => string | undefined | Promise<string | undefined>

export const exportPDF = (getUri: UriProvider, getBrowserPath?: () => string | null | undefined) => async () => {
  const uri = await getUri()
  if (uri === undefined) {
    return
  }
  const url = uri + '?print-pdf-now'
  return openInBrowser(url, getBrowserPath?.())
}
