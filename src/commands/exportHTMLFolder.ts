import path from 'path'
import { ProgressLocation, RelativePattern, Uri, window, workspace } from 'vscode'
import Logger from '../Logger'

export const EXPORT_HTML_FOLDER = 'vscode-revealjs.exportHTMLFolder'
export type EXPORT_HTML_FOLDER = typeof EXPORT_HTML_FOLDER

export const getBatchExportPath = (folderPath: string, configuredOutputPath: string, markdownPath: string) => {
  const outputRoot = path.isAbsolute(configuredOutputPath)
    ? configuredOutputPath
    : path.resolve(folderPath, configuredOutputPath)
  const relativePath = path.relative(folderPath, markdownPath)
  const presentationPath = relativePath.replace(/\.md$/i, '')

  return path.join(outputRoot, presentationPath)
}

export const exportHTMLFolder = (
  logger: Logger,
  exportFiles: (folder: Uri, files: readonly Uri[]) => Promise<readonly string[]>,
) => async (selectedFolder?: Uri) => {
  const folder = selectedFolder ?? (await window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: 'Export Markdown folder',
  }))?.[0]

  if (!folder) return

  const files = await workspace.findFiles(
    new RelativePattern(folder, '**/*.md'),
    '**/{.git,node_modules}/**',
  )
  if (files.length === 0) {
    void window.showWarningMessage('No Markdown files were found in the selected folder.')
    return
  }

  try {
    await window.withProgress(
      { location: ProgressLocation.Notification, title: 'Export Markdown folder to HTML', cancellable: false },
      async (progress) => {
        progress.report({ message: `Exporting 0/${files.length}` })
        const exported = await exportFiles(folder, files)
        progress.report({ message: `Exported ${exported.length}/${files.length}` })
        logger.info(`Exported ${exported.length} Markdown files from ${folder.fsPath}`)
        void window.showInformationMessage(`Exported ${exported.length} Markdown presentations to HTML.`)
      },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger.error(`Folder export failed: ${message}`)
    void window.showErrorMessage(`RevealJS folder HTML export failed: ${message}`)
    throw error
  }
}
