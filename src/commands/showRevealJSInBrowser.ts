import { openInBrowser } from './openExternal'

export const SHOW_REVEALJS_IN_BROWSER = 'vscode-revealjs.showRevealJSInBrowser'
export type SHOW_REVEALJS_IN_BROWSER = typeof SHOW_REVEALJS_IN_BROWSER

export const showRevealJSInBrowser = (getUri: () => string | undefined, getBrowserPath?: () => string | null | undefined) => async () => {
  const uri = getUri()
  if (uri === undefined) {
    return
  }

  return openInBrowser(uri, getBrowserPath?.())
}
