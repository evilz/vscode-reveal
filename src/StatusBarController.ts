import { StatusBarAlignment, StatusBarItem, window, EventEmitter } from 'vscode'
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

  readonly #onDidError = this._register(new EventEmitter<Error>());
	/**
	 * Fired when the server got an error.
	 */
	public readonly onDidError = this.#onDidError.event;

  readonly #onDidUpdateServerInfo = this._register(new EventEmitter<void>());
	/**
	 * Fired when the server info is updated.
	 */
	public readonly onDidUpdateServerInfo = this.#onDidUpdateServerInfo.event;

  readonly #onDidUpdatedSlideCount = this._register(new EventEmitter<void>());
	/**
	 * Fired when slide count change
	 */
	public readonly onDidUpdatedSlideCount = this.#onDidUpdatedSlideCount.event;

  readonly #onDidDispose = this._register(new EventEmitter<void>());
	/**
	 * Fired when disposed.
	 */
	public readonly onDidDispose = this.#onDidDispose.event;

  public dispose() {
    this.#addressItem.dispose()
    this.#countItem.dispose()
    this.#stopItem.dispose()
    this.#onDidDispose.fire()
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
    this.#onDidUpdateServerInfo.fire()
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
    this.#onDidUpdatedSlideCount.fire()
  }
}
