const withProgressMock = jest.fn()
const showErrorMessageMock = jest.fn()

jest.mock('vscode', () => ({
  ProgressLocation: { Notification: 15 },
  window: {
    withProgress: (...args: unknown[]) => withProgressMock(...args),
    showErrorMessage: (...args: unknown[]) => showErrorMessageMock(...args),
  },
}))

const openFolderMock = jest.fn()

jest.mock('../../commands/openExternal', () => ({
  openFolder: (...args: unknown[]) => openFolderMock(...args),
}))

import Logger, { LogLevel } from '../../Logger'
import { exportHTML } from '../../commands/exportHTML'

describe('exportHTML command', () => {
  const logger = new Logger(jest.fn(), LogLevel.Debug)

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    withProgressMock.mockImplementation(async (_options, task) => task({ report: jest.fn() }))
    openFolderMock.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  test('runs export and opens folder when configured', async () => {
    const startExport = jest.fn().mockResolvedValue('/tmp/exported')
    const command = exportHTML(logger, startExport, () => true)

    const commandPromise = command()
    for (let i = 0; i < 4; i += 1) {
      await Promise.resolve()
      jest.advanceTimersByTime(1500)
    }
    await commandPromise

    expect(startExport).toHaveBeenCalledTimes(1)
    expect(openFolderMock).toHaveBeenCalledWith('/tmp/exported')
    expect(showErrorMessageMock).not.toHaveBeenCalled()
  })

  test('surfaces export errors to the user and rethrows', async () => {
    const startExportError = new Error('broken')
    const startExport = jest.fn().mockRejectedValue(startExportError)
    const command = exportHTML(logger, startExport, () => false)

    await expect(command()).rejects.toThrow('broken')
    expect(showErrorMessageMock).toHaveBeenCalledWith('RevealJS HTML export failed: broken')
    expect(openFolderMock).not.toHaveBeenCalled()
  })
})
