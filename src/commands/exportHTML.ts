import * as open from 'open'
import { Logger } from '../Logger'

import { window, ProgressLocation } from 'vscode'

export const EXPORT_HTML = 'vscode-revealjs.exportHTML'
export type EXPORT_HTML = typeof EXPORT_HTML

export const exportHTML = (logger: Logger, startExport: () => Promise<string>, doOpenAfterExport: () => boolean) => async () => {
  await window.withProgress(
    {
      location: ProgressLocation.Notification,
      title: 'Export',
    },
    async (progress) => {
      logger.log('Start export')
      progress.report({ message: 'in progress' })
      const path = await startExport()
      progress.report({ message: 'Done' })
      await timeout(1500)
      logger.log('End export ' + path)
      if (doOpenAfterExport()) {
        progress.report({ message: 'Opening out folder !' })
        await timeout(1500)
        open(path)
        logger.log('Open folder: ' + path)
      }
    }
  )
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
