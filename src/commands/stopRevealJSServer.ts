import { VSCodeRevealContext } from '../VSCodeRevealContext'

export const STOP_REVEALJS_SERVER = 'vscode-revealjs.stopRevealJSServer'
export type STOP_REVEALJS_SERVER = typeof STOP_REVEALJS_SERVER

export const stopRevealJSServer = (getContext: (() => VSCodeRevealContext), statusBarController) => () => {
  const currentContext = getContext()
  if (currentContext === undefined) {
    return
  }
  currentContext.server.stop()
  statusBarController.update()
}
