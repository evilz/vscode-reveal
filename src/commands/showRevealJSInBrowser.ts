import open from 'open'

export const SHOW_REVEALJS_IN_BROWSER = 'vscode-revealjs.showRevealJSInBrowser'
export type SHOW_REVEALJS_IN_BROWSER = typeof SHOW_REVEALJS_IN_BROWSER

export const showRevealJSInBrowser = (getUri: () => string | null) => () => {
  const uri = getUri()
  if (uri === null) {
    return
  }
  return open(uri)
}
