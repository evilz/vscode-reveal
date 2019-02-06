export const STOP_REVEALJS_SERVER = 'vscode-revealjs.stopRevealJSServer'
export type STOP_REVEALJS_SERVER = typeof STOP_REVEALJS_SERVER

export const stopRevealJSServer = (stopServer: () => void) => () => {
  stopServer()
}
