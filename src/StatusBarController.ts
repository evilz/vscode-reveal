import { StatusBarAlignment, StatusBarItem, TextDocument, Uri, window } from 'vscode'

export class StatusBarController {
  private countItem: StatusBarItem
  private addressItem: StatusBarItem
  private stopItem: StatusBarItem

  constructor(private getServerUri: (() => Uri | null), private getSlidesCount: (() => number)) {
    this.addressItem = window.createStatusBarItem(StatusBarAlignment.Right, 100)
    this.addressItem.command = 'vscode-revealjs.showRevealJSInBrowser'
    this.addressItem.hide()

    this.stopItem = window.createStatusBarItem(StatusBarAlignment.Right, 101)
    this.stopItem.hide()
    this.stopItem.text = `$(primitive-square)`
    this.stopItem.color = 'red'
    this.stopItem.command = 'vscode-revealjs.KillRevealJSServer'

    this.countItem = window.createStatusBarItem(StatusBarAlignment.Right, 102)
    this.countItem.command = 'vscode-revealjs.showRevealJS'
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

  private updateAddress(serverUri: Uri | null) {
    if (serverUri !== null) {
      this.addressItem.text = `$(server) ${serverUri}`
      this.addressItem.show()
    } else {
      this.addressItem.text = ''
      this.addressItem.hide()
    }
  }

  private updateStop(serverUri: Uri | null) {
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
