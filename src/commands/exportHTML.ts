import Logger from '../Logger'

import { window, ProgressLocation } from 'vscode'
import { openFolder } from './openExternal'

export const EXPORT_HTML = 'vscode-revealjs.exportHTML'
export type EXPORT_HTML = typeof EXPORT_HTML

export const exportHTML = (logger: Logger, startExport: () => Promise<string>, doOpenAfterExport: () => boolean) => async () => {
  try {
    await window.withProgress(
    {
      location: ProgressLocation.Notification,
      title: 'Export',
    },
    async (progress) => {
      logger.debug('Start export')
      progress.report({ message: 'in progress' })
      const path = await startExport()
      progress.report({ message: 'Done' })
      await timeout(1500)
      logger.debug('End export ' + path)
      if (doOpenAfterExport()) {
        progress.report({ message: 'Opening out folder !' })
        await timeout(1500)
        await openFolder(path)
        logger.debug('Open folder: ' + path)
      }
    }
  )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger.error(`Export failed: ${message}`)
    void window.showErrorMessage(`RevealJS HTML export failed: ${message}`)
    throw error
  }
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
