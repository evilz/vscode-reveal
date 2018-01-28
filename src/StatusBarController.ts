import { StatusBarAlignment, StatusBarItem, TextDocument, window } from 'vscode'
import { ISlidifyOptions, RevealServerState } from './Models'
import { VSCodeRevealContext } from './VSCodeRevealContext'

export class StatusBarController {
  private countItem: StatusBarItem
  private addressItem: StatusBarItem
  private stopItem: StatusBarItem

  constructor(private getContext: (() => VSCodeRevealContext)) {}

  public update() {
    const context = this.getContext()
    this.updateAddress(context)
    this.updateCount(context)
    this.updateStop(context)
  }

  public dispose() {
    this.addressItem.dispose()
    this.countItem.dispose()
    this.stopItem.dispose()
  }

  private updateAddress(context: VSCodeRevealContext) {
    if (!this.addressItem) {
      this.addressItem = window.createStatusBarItem(StatusBarAlignment.Right, 100)
    }

    if (context.server.state === RevealServerState.Started) {
      this.addressItem.text = `$(server) ${context.server.uri}`
      this.addressItem.command = 'vscode-revealjs.showRevealJSInBrowser'
      this.addressItem.show()
    } else {
      this.addressItem.hide()
    }
  }

  private updateStop(context: VSCodeRevealContext) {
    if (!this.stopItem) {
      this.stopItem = window.createStatusBarItem(StatusBarAlignment.Right, 101)
    }

    this.stopItem.text = `$(primitive-square)`
    this.stopItem.color = 'red'
    this.stopItem.command = 'vscode-revealjs.KillRevealJSServer'

    if (context.server.state === RevealServerState.Started) {
      this.stopItem.show()
    } else {
      this.stopItem.hide()
    }
  }

  private updateCount(context: VSCodeRevealContext) {
    if (!this.countItem) {
      this.countItem = window.createStatusBarItem(StatusBarAlignment.Right, 102)
    }

    if (!context.editor || context.editor.document.languageId !== 'markdown') {
      this.countItem.hide()
      return
    }

    const slidecount = context.slideCount
    if (slidecount < 2) {
      this.countItem.hide()
    } else {
      this.countItem.text = `$(note) ${slidecount} Slides`
      this.countItem.command = 'vscode-revealjs.showRevealJS'
      this.countItem.show()
    }
  }
}
