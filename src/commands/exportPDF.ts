import { openInBrowser } from './openExternal'

export const EXPORT_PDF = 'vscode-revealjs.exportPDF'
export type EXPORT_PDF = typeof EXPORT_PDF

type UriProvider = () => string | undefined | Promise<string | undefined>

export const toPrintPdfUrl = (uri: string) => {
  const [baseUri, hash = ''] = uri.split('#')
  const separator = baseUri.includes('?') ? '&' : '?'
  const hashSuffix = hash ? `#${hash}` : ''
  return `${baseUri}${separator}print-pdf-now${hashSuffix}`
}

export const exportPDF = (getUri: UriProvider, getBrowserPath?: () => string | null | undefined) => async () => {
  const uri = await getUri()
  if (uri === undefined) {
    return
  }
  const url = toPrintPdfUrl(uri)
  return openInBrowser(url, getBrowserPath?.())
}
