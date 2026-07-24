const openInBrowserMock = jest.fn()

jest.mock('../../commands/openExternal', () => ({
  openInBrowser: (...args: unknown[]) => openInBrowserMock(...args),
}))

import {
  showRevealJSInBrowser,
  showRevealJSPresenterView,
  toPresenterViewUrl,
} from '../../commands/showRevealJSInBrowser'

describe('showRevealJSInBrowser commands', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('toPresenterViewUrl appends notes query before hash', () => {
    expect(toPresenterViewUrl('http://localhost:1948/#/2/1/123')).toBe('http://localhost:1948/?notes=1#/2/1/123')
    expect(toPresenterViewUrl('http://localhost:1948/?print-pdf#/0/0')).toBe('http://localhost:1948/?print-pdf&notes=1#/0/0')
  })

  test('showRevealJSInBrowser opens the raw presentation url', async () => {
    const run = showRevealJSInBrowser(() => 'http://localhost:1948/#/1/0', () => '/browser')

    await run()

    expect(openInBrowserMock).toHaveBeenCalledWith('http://localhost:1948/#/1/0', '/browser')
  })

  test('showRevealJSInBrowser waits for a remote URL', async () => {
    const run = showRevealJSInBrowser(async () => 'https://forwarded.example.test/#/1/0', () => '/browser')

    await run()

    expect(openInBrowserMock).toHaveBeenCalledWith('https://forwarded.example.test/#/1/0', '/browser')
  })

  test('showRevealJSPresenterView opens notes-enabled url', async () => {
    const run = showRevealJSPresenterView(() => 'http://localhost:1948/#/1/0', () => '/browser')

    await run()

    expect(openInBrowserMock).toHaveBeenCalledWith('http://localhost:1948/?notes=1#/1/0', '/browser')
  })
})
