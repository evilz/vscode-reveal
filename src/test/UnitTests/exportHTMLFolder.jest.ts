const findFilesMock = jest.fn()
const withProgressMock = jest.fn()
const showInformationMessageMock = jest.fn()
const showWarningMessageMock = jest.fn()
const showErrorMessageMock = jest.fn()

jest.mock('vscode', () => ({
  ProgressLocation: { Notification: 15 },
  RelativePattern: class RelativePattern {
    constructor(public base: unknown, public pattern: string) {}
  },
  window: {
    showOpenDialog: jest.fn(),
    withProgress: (...args: unknown[]) => withProgressMock(...args),
    showInformationMessage: (...args: unknown[]) => showInformationMessageMock(...args),
    showWarningMessage: (...args: unknown[]) => showWarningMessageMock(...args),
    showErrorMessage: (...args: unknown[]) => showErrorMessageMock(...args),
  },
  workspace: {
    findFiles: (...args: unknown[]) => findFilesMock(...args),
  },
}))

import Logger, { LogLevel } from '../../Logger'
import { exportHTMLFolder, getBatchExportPath } from '../../commands/exportHTMLFolder'
import path from 'path'

describe('exportHTMLFolder command', () => {
  const logger = new Logger(jest.fn(), LogLevel.Debug)
  const folder = { fsPath: '/songs' }

  beforeEach(() => {
    jest.clearAllMocks()
    withProgressMock.mockImplementation(async (_options, task) => task({ report: jest.fn() }))
  })

  test('keeps the Markdown folder hierarchy in the configured output directory', () => {
    const folderPath = path.resolve('songs')
    const absoluteOutputPath = path.resolve('reveal')

    expect(getBatchExportPath(folderPath, './export', path.join(folderPath, 'set-one', 'intro.md'))).toBe(path.join(folderPath, 'export', 'set-one', 'intro'))
    expect(getBatchExportPath(folderPath, absoluteOutputPath, path.join(folderPath, 'finale.md'))).toBe(path.join(absoluteOutputPath, 'finale'))
  })

  test('exports every Markdown file found below the selected folder', async () => {
    const files = [{ fsPath: '/songs/one.md' }, { fsPath: '/songs/set/two.md' }]
    findFilesMock.mockResolvedValue(files)
    const exportFiles = jest.fn().mockResolvedValue(['/songs/export/one', '/songs/export/set/two'])

    await exportHTMLFolder(logger, exportFiles)(folder as any)

    expect(findFilesMock).toHaveBeenCalledWith(expect.anything(), '**/{.git,node_modules}/**')
    expect(exportFiles).toHaveBeenCalledWith(folder, files)
    expect(showInformationMessageMock).toHaveBeenCalledWith('Exported 2 Markdown presentations to HTML.')
  })

  test('reports an empty folder without starting an export', async () => {
    findFilesMock.mockResolvedValue([])
    const exportFiles = jest.fn()

    await exportHTMLFolder(logger, exportFiles)(folder as any)

    expect(exportFiles).not.toHaveBeenCalled()
    expect(showWarningMessageMock).toHaveBeenCalledWith('No Markdown files were found in the selected folder.')
    expect(showErrorMessageMock).not.toHaveBeenCalled()
  })
})
