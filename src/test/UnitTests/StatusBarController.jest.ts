const createdItems: any[] = []

jest.mock('vscode', () => ({
  StatusBarAlignment: { Right: 2 },
  window: {
    createStatusBarItem: jest.fn(() => {
      const item = {
        text: '',
        color: undefined,
        command: undefined,
        show: jest.fn(),
        hide: jest.fn(),
        dispose: jest.fn(),
      }
      createdItems.push(item)
      return item
    }),
  },
}))

import { StatusBarController } from '../../StatusBarController'
import { SHOW_REVEALJS } from '../../commands/showRevealJS'
import { SHOW_REVEALJS_IN_BROWSER } from '../../commands/showRevealJSInBrowser'
import { STOP_REVEALJS_SERVER } from '../../commands/stopRevealJSServer'

describe('StatusBarController', () => {
  beforeEach(() => {
    createdItems.length = 0
  })

  test('constructor configures status bar items', () => {
    new StatusBarController()

    const [addressItem, stopItem, countItem] = createdItems
    expect(addressItem.command).toBe(SHOW_REVEALJS_IN_BROWSER)
    expect(stopItem.command).toBe(STOP_REVEALJS_SERVER)
    expect(stopItem.text).toBe('$(primitive-square)')
    expect(stopItem.color).toBe('red')
    expect(countItem.command).toBe(SHOW_REVEALJS)
    expect(addressItem.hide).toHaveBeenCalled()
    expect(stopItem.hide).toHaveBeenCalled()
    expect(countItem.hide).toHaveBeenCalled()
  })

  test('updateServerInfo toggles visibility and text', () => {
    const controller = new StatusBarController()
    const [addressItem, stopItem] = createdItems

    controller.updateServerInfo('http://localhost:1948')
    expect(addressItem.text).toBe('$(server) http://localhost:1948')
    expect(addressItem.show).toHaveBeenCalledTimes(1)
    expect(stopItem.show).toHaveBeenCalledTimes(1)

    controller.updateServerInfo('http://localhost:1948')
    expect(addressItem.text).toBe('')
    expect(addressItem.hide).toHaveBeenCalledTimes(2)
    expect(stopItem.hide).toHaveBeenCalledTimes(2)

    controller.updateServerInfo(null)
    expect(addressItem.hide).toHaveBeenCalledTimes(3)
    expect(stopItem.hide).toHaveBeenCalledTimes(3)
  })

  test('updateCount updates singular/plural and hides for invalid counts', () => {
    const controller = new StatusBarController()
    const countItem = createdItems[2]

    controller.updateCount(1)
    expect(countItem.text).toBe('$(note) 1 slide')
    expect(countItem.show).toHaveBeenCalledTimes(1)

    controller.updateCount(2)
    expect(countItem.text).toBe('$(note) 2 slides')
    expect(countItem.show).toHaveBeenCalledTimes(2)

    controller.updateCount(2)
    expect(countItem.show).toHaveBeenCalledTimes(2)
    expect(countItem.hide).toHaveBeenCalledTimes(1)

    controller.updateCount(0)
    expect(countItem.text).toBe('')
    expect(countItem.hide).toHaveBeenCalledTimes(2)

    controller.updateCount(null)
    expect(countItem.hide).toHaveBeenCalledTimes(3)
  })
})
