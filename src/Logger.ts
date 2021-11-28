import EventEmitter from "events"
import TypedEmitter from "typed-emitter"

export enum LogLevel {
  Error,
  Verbose,
}


interface LoggerEvents {
  levelChanged: (LogLevel) => void,
}

export class Logger  extends (EventEmitter as new () => TypedEmitter<LoggerEvents>) {
  
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
    this.emit("levelChanged", this.logLevel)
  }
}
