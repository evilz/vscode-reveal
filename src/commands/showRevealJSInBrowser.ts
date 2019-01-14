import { openInBrowser } from '../BrowserHelper'

export const SHOW_REVEALJS_IN_BROWSER = 'vscode-revealjs.showRevealJSInBrowser'
export type SHOW_REVEALJS_IN_BROWSER = typeof SHOW_REVEALJS_IN_BROWSER

export const showRevealJSInBrowser = (getUri: () => string | null, getBrowserPath: () => string | null) => () => {
  const browserPath = getBrowserPath()
  if (browserPath === null) {
    throw new Error('No browser found')
  }
  const uri = getUri()
  if (uri === null) {
    return
  }
  return openInBrowser(browserPath, uri)
}
