const openMock = jest.fn()
const executeCommandMock = jest.fn()
const openExternalMock = jest.fn()
const parseMock = jest.fn((value: string) => ({ kind: 'parse', value }))
const fileMock = jest.fn((value: string) => ({ kind: 'file', value }))

jest.mock('open', () => ({
  __esModule: true,
  default: (...args: unknown[]) => openMock(...args),
}))

jest.mock('vscode', () => ({
  commands: {
    executeCommand: (...args: any[]) => executeCommandMock(...args),
  },
  env: {
    openExternal: (...args: any[]) => openExternalMock(...args),
  },
  Uri: {
    parse: (value: string) => parseMock(value),
    file: (value: string) => fileMock(value),
  },
}))

import { openFolder, openInBrowser } from '../../commands/openExternal'

describe('openExternal helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('openInBrowser uses custom browser when browserPath is configured', async () => {
    await openInBrowser('http://localhost:1948', ' /custom/browser ')

    expect(openMock).toHaveBeenCalledWith('http://localhost:1948', {
      app: {
        name: '/custom/browser',
      },
    })
    expect(openExternalMock).not.toHaveBeenCalled()
  })

  test('openInBrowser uses vscode env when browserPath is empty', async () => {
    await openInBrowser('http://localhost:1948', '   ')

    expect(parseMock).toHaveBeenCalledWith('http://localhost:1948')
    expect(openExternalMock).toHaveBeenCalledWith({ kind: 'parse', value: 'http://localhost:1948' })
    expect(openMock).not.toHaveBeenCalled()
  })

  test('openFolder prefers revealFileInOS', async () => {
    executeCommandMock.mockResolvedValue(undefined)

    await openFolder('/tmp/export')

    expect(fileMock).toHaveBeenCalledWith('/tmp/export')
    expect(executeCommandMock).toHaveBeenCalledWith('revealFileInOS', { kind: 'file', value: '/tmp/export' })
    expect(openExternalMock).not.toHaveBeenCalled()
  })

  test('openFolder falls back to openExternal when revealFileInOS fails', async () => {
    executeCommandMock.mockRejectedValue(new Error('unsupported'))

    await openFolder('/tmp/export')

    expect(openExternalMock).toHaveBeenCalledWith({ kind: 'file', value: '/tmp/export' })
  })
})
