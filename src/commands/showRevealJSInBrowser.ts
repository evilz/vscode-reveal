import { openInChrome } from '../ChromeHelper'
import { VSCodeRevealContext } from '../VSCodeRevealContext'

export const SHOW_REVEALJS_IN_BROWSER = 'vscode-revealjs.showRevealJSInBrowser'
export type SHOW_REVEALJS_IN_BROWSER = typeof SHOW_REVEALJS_IN_BROWSER

export const showRevealJSInBrowser = (getContext: (() => VSCodeRevealContext)) => () => {
  const context = getContext()
  return openInChrome(context.uri)
}
