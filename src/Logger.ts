export enum LogLevel {
  /** 0 - Logs that are used for interactive investigation during development. These logs should primarily contain information useful for debugging and have no long-term value. */
  Debug = "debug",
  /** 1 - Logs that track the general flow of the application. These logs should have long-term value. */
  Info = "info",
  /** 2 - Logs that highlight an abnormal or unexpected event in the application flow, but do not otherwise cause the application execution to stop. */
  Warning = "warning",
  /** 3 - Logs that highlight when the current flow of execution is stopped due to a failure. These should indicate a failure in the current activity, not an application-wide failure. */
  Error = "error",
  /** 4 - Not used for writing log messages. Specifies that a logging category should not write any messages. */
  None = "none",
}

export default class Logger {
  constructor(private readonly appendLine: (string) => void, private logLevel = LogLevel.Error) {
  }

  #printLog(level, message) {
    const msg = `[${level}] [${new Date().toLocaleTimeString()}] ${message}`
    this.appendLine(msg)
  }


  public error(message: string) {
    if (this.LogLevel <= LogLevel.Error) {
      this.#printLog("ERROR", message)
    }
  }

  public warning(message: string) {
    if (this.LogLevel <= LogLevel.Warning) {
      this.#printLog("WARNING", message)
    }
  }

  public info(message: string) {
    if (this.LogLevel <= LogLevel.Info) {
      this.#printLog("INFO", message)
    }
  }

  public debug(message: string) {
    if (this.LogLevel <= LogLevel.Debug) {
      this.#printLog("DEBUG", message)
    }
  }


  public get LogLevel() {
    return this.logLevel
  }
  public set LogLevel(level: LogLevel) {
    if (level === null || this.logLevel === level) { return }
    this.logLevel = level
    this.info(`log level changed to ${level} `)
  }
}
