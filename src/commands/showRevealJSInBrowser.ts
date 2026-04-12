import { openInBrowser } from './openExternal'

export const SHOW_REVEALJS_IN_BROWSER = 'vscode-revealjs.showRevealJSInBrowser'
export type SHOW_REVEALJS_IN_BROWSER = typeof SHOW_REVEALJS_IN_BROWSER

export const SHOW_REVEALJS_PRESENTER_VIEW = 'vscode-revealjs.showRevealJSPresenterView'
export type SHOW_REVEALJS_PRESENTER_VIEW = typeof SHOW_REVEALJS_PRESENTER_VIEW

export const toPresenterViewUrl = (uri: string) => {
  const [baseUri, hash = ''] = uri.split('#')
  const separator = baseUri.includes('?') ? '&' : '?'
  return `${baseUri}${separator}notes=1${hash ? `#${hash}` : ''}`
}

export const showRevealJSInBrowser = (getUri: () => string | undefined, getBrowserPath?: () => string | null | undefined) => async () => {
  const uri = getUri()
  if (uri === undefined) {
    return
  }

  return openInBrowser(uri, getBrowserPath?.())
}

export const showRevealJSPresenterView = (getUri: () => string | undefined, getBrowserPath?: () => string | null | undefined) => async () => {
  const uri = getUri()
  if (uri === undefined) {
    return
  }

  return openInBrowser(toPresenterViewUrl(uri), getBrowserPath?.())
}
