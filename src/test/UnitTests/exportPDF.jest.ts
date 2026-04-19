const openInBrowserMock = jest.fn()

jest.mock('../../commands/openExternal', () => ({
  openInBrowser: (...args: unknown[]) => openInBrowserMock(...args),
}))

import { exportPDF } from '../../commands/exportPDF'

describe('exportPDF command', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('does nothing when server URI is undefined', async () => {
    const command = exportPDF(() => undefined, () => '/custom/browser')

    await command()

    expect(openInBrowserMock).not.toHaveBeenCalled()
  })

  test('opens print URL in configured browser', async () => {
    const command = exportPDF(() => 'http://localhost:1948', () => ' /custom/browser ')

    await command()

    expect(openInBrowserMock).toHaveBeenCalledWith('http://localhost:1948?print-pdf-now', ' /custom/browser ')
  })

  test('opens print URL with default browser when no path provider is given', async () => {
    const command = exportPDF(() => 'http://localhost:1948')

    await command()

    expect(openInBrowserMock).toHaveBeenCalledWith('http://localhost:1948?print-pdf-now', undefined)
  })
})
