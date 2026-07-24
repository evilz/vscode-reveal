import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { createSelfContainedExport } from '../../ExportHTML'

test('creates a single HTML export by inlining local scripts, styles, fonts and images', async () => {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), 'vscode-reveal-single-'))
  try {
    await fs.mkdir(path.join(folder, 'assets'))
    await fs.writeFile(path.join(folder, 'assets', 'app.js'), 'window.deckReady = true;')
    await fs.writeFile(path.join(folder, 'assets', 'font.woff2'), Buffer.from([1, 2, 3]))
    await fs.writeFile(path.join(folder, 'assets', 'logo.png'), Buffer.from([4, 5, 6]))
    await fs.writeFile(path.join(folder, 'assets', 'deck.css'), '@font-face { src: url("font.woff2"); }')
    await fs.writeFile(path.join(folder, 'index.html'), '<link rel="stylesheet" href="assets/deck.css"><script src="assets/app.js"></script><img src="assets/logo.png"><a href="https://example.com">external</a>')

    await createSelfContainedExport(folder)

    const html = await fs.readFile(path.join(folder, 'index.html'), 'utf8')
    expect(html).toContain('<style>@font-face { src: url(data:font/woff2;base64,AQID); }</style>')
    expect(html).toContain('<script>window.deckReady = true;</script>')
    expect(html).toContain('src="data:image/png;base64,BAUG"')
    expect(html).toContain('href="https://example.com"')
    await expect(fs.readdir(folder)).resolves.toEqual(['index.html'])
  } finally {
    await fs.rm(folder, { recursive: true, force: true })
  }
})

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
