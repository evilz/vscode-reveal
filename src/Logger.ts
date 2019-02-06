export enum LogLevel {
  Error,
  Verbose
}

export class Logger {
  constructor(private logLevel: LogLevel, private readonly appendLine: (string) => void) {}

  public error(message: string) {
    this.appendLine(`[error - ${new Date().toLocaleTimeString()}] ${message}`)
  }

  public log(message: string): void {
    if (this.logLevel === LogLevel.Verbose) {
      this.appendLine(`[info - ${new Date().toLocaleTimeString()}] ${message}`)
    }
  }

  public get LogLevel() {
    return this.logLevel
  }
  public set LogLevel(level: LogLevel) {
    this.logLevel = level
  }
}
