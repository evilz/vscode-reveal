import { EventEmitter } from "vscode";
import { Disposable } from "./dispose";

export enum LogLevel {
  Error,
  Verbose,
}


interface LoggerEvents {
  levelChanged: (LogLevel) => void,
}

export default class Logger  extends Disposable{
  
  constructor( private readonly appendLine: (string) => void, private logLevel= LogLevel.Verbose) {
    super();
  }

  public error(message: string) {
    const msg = `[ERROR] [${new Date().toLocaleTimeString()}] ${message}`
    this.appendLine(msg)
  }

  public log(message: string): void {
    if (this.logLevel === LogLevel.Verbose) {
      const msg = `[INFO] [${new Date().toLocaleTimeString()}] ${message}`
      this.appendLine(msg)
    }
  }

  public get LogLevel() { return this.logLevel }
  public set LogLevel(level: LogLevel) {
    this.logLevel = level
    this.#onDidLevelChanged.fire(this.logLevel)
  }

  readonly #onDidLevelChanged = this._register(new EventEmitter<LogLevel>());
	/**
	 * Fired when the server got an error.
	 */
	public readonly onDidLevelChanged = this.#onDidLevelChanged.event;
}
