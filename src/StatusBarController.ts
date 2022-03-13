import { StatusBarAlignment, StatusBarItem, window } from 'vscode'
import { SHOW_REVEALJS } from './commands/showRevealJS'
import { SHOW_REVEALJS_IN_BROWSER } from './commands/showRevealJSInBrowser'
import { STOP_REVEALJS_SERVER } from './commands/stopRevealJSServer'
import { Disposable } from './dispose'

export class StatusBarController extends Disposable{
  readonly #countItem: StatusBarItem
  readonly #addressItem: StatusBarItem
  readonly #stopItem: StatusBarItem

  #currentServerUri: string | null = null
  #currentCount: number | null = null

  constructor() {
    super()

    this.#addressItem = window.createStatusBarItem(StatusBarAlignment.Right, 102)
    this.#addressItem.command = SHOW_REVEALJS_IN_BROWSER
    this.#addressItem.hide()
    this._register(this.#addressItem)

    this.#stopItem = window.createStatusBarItem(StatusBarAlignment.Right, 103)
    this.#stopItem.hide()
    this.#stopItem.text = `$(primitive-square)`
    this.#stopItem.color = 'red'
    this.#stopItem.command = STOP_REVEALJS_SERVER
    this._register(this.#stopItem)

    this.#countItem = window.createStatusBarItem(StatusBarAlignment.Right, 104)
    this.#countItem.command = SHOW_REVEALJS
    this.#countItem.hide()
    this._register(this.#countItem)

  }

  public dispose() {
    this.#addressItem.dispose()
    this.#countItem.dispose()
    this.#stopItem.dispose()
  }

  public updateServerInfo(serverUri: string | null) {
    if (serverUri !== null && serverUri !== this.#currentServerUri) {
      this.#currentServerUri = serverUri
      this.#addressItem.text = `$(server) ${serverUri}`
      this.#addressItem.show()
      this.#stopItem.show()
    } else {
      this.#addressItem.text = ''
      this.#addressItem.hide()
      this.#stopItem.hide()
    }
  }


  public updateCount(slideCount: number | null) {

    if (slideCount !== this.#currentCount) {
      this.#currentCount = slideCount
    }
    else {return}

    if(this.#currentCount && this.#currentCount > 0) {
      const slideWord = this.#currentCount === 1 ? 'slide' : 'slides'
      this.#countItem.text = `$(note) ${this.#currentCount} ${slideWord}`
      this.#countItem.show()
    }
    else
    {
      this.#countItem.text = ""
      this.#countItem.hide()
    }
  }
}
