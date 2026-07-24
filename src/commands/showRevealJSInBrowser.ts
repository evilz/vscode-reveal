import { openInBrowser } from './openExternal'

export const SHOW_REVEALJS_IN_BROWSER = 'vscode-revealjs.showRevealJSInBrowser'
export type SHOW_REVEALJS_IN_BROWSER = typeof SHOW_REVEALJS_IN_BROWSER

export const SHOW_REVEALJS_PRESENTER_VIEW = 'vscode-revealjs.showRevealJSPresenterView'
export type SHOW_REVEALJS_PRESENTER_VIEW = typeof SHOW_REVEALJS_PRESENTER_VIEW

type UriProvider = () => string | undefined | Promise<string | undefined>

export const toPresenterViewUrl = (uri: string) => {
  const [baseUri, hash = ''] = uri.split('#')
  const separator = baseUri.includes('?') ? '&' : '?'
  const hashSuffix = hash ? `#${hash}` : ''
  return `${baseUri}${separator}notes=1${hashSuffix}`
}

export const showRevealJSInBrowser = (getUri: UriProvider, getBrowserPath?: () => string | null | undefined) => async () => {
  const uri = await getUri()
  if (uri === undefined) {
    return
  }

  return openInBrowser(uri, getBrowserPath?.())
}

export const showRevealJSPresenterView = (getUri: UriProvider, getBrowserPath?: () => string | null | undefined) => async () => {
  const uri = await getUri()
  if (uri === undefined) {
    return
  }

  return openInBrowser(toPresenterViewUrl(uri), getBrowserPath?.())
}
