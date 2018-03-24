import { openInBrowser } from '../BrowserHelper'
import { VSCodeRevealContext } from '../VSCodeRevealContext'
import { getExtensionOptions } from '../Configuration';

export const SHOW_REVEALJS_IN_BROWSER = 'vscode-revealjs.showRevealJSInBrowser'
export type SHOW_REVEALJS_IN_BROWSER = typeof SHOW_REVEALJS_IN_BROWSER

export const showRevealJSInBrowser = (getContext: (() => VSCodeRevealContext)) => () => {
  const context = getContext()
  return openInBrowser(getExtensionOptions(), context.uri)
}
