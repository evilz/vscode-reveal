import * as opn from 'opn'
import { Logger } from '../Logger'

import { ShellExecution, Task, TaskDefinition } from 'vscode';

export const EXPORT_HTML = 'vscode-revealjs.exportHTML'
export type EXPORT_HTML = typeof EXPORT_HTML

export const exportHTML = (logger: Logger, startExport: () => Promise<string>, doOpenAfterExport: () => boolean) => async () => {
  
  logger.log('Start export')
  const path = await startExport()
  logger.log('End export ' + path)
  if (doOpenAfterExport()) {
    opn(path)
    logger.log('Open folder: ' + path)
  }
}
