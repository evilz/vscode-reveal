import { StatusBarAlignment, StatusBarItem, window } from 'vscode'
import { SHOW_REVEALJS } from './commands/showRevealJS'
import { SHOW_REVEALJS_IN_BROWSER } from './commands/showRevealJSInBrowser'
import { STOP_REVEALJS_SERVER } from './commands/stopRevealJSServer'

export class StatusBarController {
  private readonly countItem: StatusBarItem
  private readonly addressItem: StatusBarItem
  private readonly stopItem: StatusBarItem

  constructor(private readonly getServerUri: () => string | null, private readonly getSlidesCount: () => number) {
    this.addressItem = window.createStatusBarItem(StatusBarAlignment.Right, 100)
    this.addressItem.command = SHOW_REVEALJS_IN_BROWSER
    this.addressItem.hide()

    this.stopItem = window.createStatusBarItem(StatusBarAlignment.Right, 101)
    this.stopItem.hide()
    this.stopItem.text = `$(primitive-square)`
    this.stopItem.color = 'red'
    this.stopItem.command = STOP_REVEALJS_SERVER

    this.countItem = window.createStatusBarItem(StatusBarAlignment.Right, 102)
    this.countItem.command = SHOW_REVEALJS
    this.countItem.hide()

    this.update()
  }

  public update() {
    const serverUri = this.getServerUri()
    const slideCount = this.getSlidesCount()
    this.updateAddress(serverUri)
    this.updateCount(slideCount)
    this.updateStop(serverUri)
  }

  public dispose() {
    this.addressItem.dispose()
    this.countItem.dispose()
    this.stopItem.dispose()
  }

  private updateAddress(serverUri: string | null) {
    if (serverUri !== null) {
      this.addressItem.text = `$(server) ${serverUri}`
      this.addressItem.show()
    } else {
      this.addressItem.text = ''
      this.addressItem.hide()
    }
  }

  private updateStop(serverUri: string | null) {
    if (serverUri === null) {
      this.stopItem.hide()
    } else {
      this.stopItem.show()
    }
  }

  private updateCount(slideCount: number) {
    if (slideCount < 2) {
      this.countItem.text = ''
      this.countItem.hide()
    } else {
      this.countItem.text = `$(note) ${slideCount} Slides`
      this.countItem.show()
    }
  }
}
