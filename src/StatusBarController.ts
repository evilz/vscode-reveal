import { StatusBarAlignment, StatusBarItem, window } from 'vscode'
import { SHOW_REVEALJS } from './commands/showRevealJS'
import { SHOW_REVEALJS_IN_BROWSER } from './commands/showRevealJSInBrowser'
import { STOP_REVEALJS_SERVER } from './commands/stopRevealJSServer'

import EventEmitter from "events"
import TypedEmitter from "typed-emitter"

interface StatusBarControllerEvents {
  updatedServerInfo: () => void,
  updatedSlideCount: () => void,
  disposed: () => void
  error: (error: Error) => void
  
}

export class StatusBarController extends (EventEmitter as new () => TypedEmitter<StatusBarControllerEvents>){
  readonly #countItem: StatusBarItem
  readonly #addressItem: StatusBarItem
  readonly #stopItem: StatusBarItem

  #currentServerUri: string | null = null
  #currentCount: number | null = null

  constructor() {
    super()

    this.#addressItem = window.createStatusBarItem(StatusBarAlignment.Right, 100)
    this.#addressItem.command = SHOW_REVEALJS_IN_BROWSER
    this.#addressItem.hide()

    this.#stopItem = window.createStatusBarItem(StatusBarAlignment.Right, 101)
    this.#stopItem.hide()
    this.#stopItem.text = `$(primitive-square)`
    this.#stopItem.color = 'red'
    this.#stopItem.command = STOP_REVEALJS_SERVER

    this.#countItem = window.createStatusBarItem(StatusBarAlignment.Right, 102)
    this.#countItem.command = SHOW_REVEALJS
    this.#countItem.hide()

  }

  public dispose() {
    this.#addressItem.dispose()
    this.#countItem.dispose()
    this.#stopItem.dispose()
    this.emit("disposed")
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
    this.emit("updatedServerInfo")
  }


  public updateCount(slideCount: number | null) {

    if (slideCount !== this.#currentCount) {
      this.#currentCount = slideCount
    }
    else {return}

    if(this.#currentCount && this.#currentCount > 0) {
      this.#countItem.text = `$(note) ${this.#currentCount} Slides`
      this.#countItem.show()
    } 
    else
    {
      this.#countItem.text = ""
      this.#countItem.hide()
    }
    this.emit("updatedSlideCount")
  }
}
