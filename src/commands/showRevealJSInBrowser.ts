import open from 'open'

export const SHOW_REVEALJS_IN_BROWSER = 'vscode-revealjs.showRevealJSInBrowser'
export type SHOW_REVEALJS_IN_BROWSER = typeof SHOW_REVEALJS_IN_BROWSER

export const showRevealJSInBrowser = (getUri: () => string | undefined) => () => {
  const uri = getUri()
  if (uri === undefined) {
    return
  }
  return open(uri)
}
