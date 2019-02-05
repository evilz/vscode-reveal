import * as vscode from 'vscode'
import { extensionId } from './constants'

export enum LogLevel {
  Error,
  Verbose
}

export class Logger {
  private outputChannel: vscode.OutputChannel

  private get OutputChannel() {
    if (!this.outputChannel) {
      this.outputChannel = vscode.window.createOutputChannel(extensionId)
    }

    return this.outputChannel
  }
  constructor(private logLevel: LogLevel) {}

  public error(message: string) {
    this.appendLine(`[error - ${new Date().toLocaleTimeString()}] ${message}`)
  }

  public log(message: string): void {
    if (this.logLevel === LogLevel.Verbose) {
      this.appendLine(`[info - ${new Date().toLocaleTimeString()}] ${message}`)
    }
  }

  private appendLine(value: string) {
    return this.OutputChannel.appendLine(value)
  }

  public get LogLevel() {
    return this.logLevel
  }
  public set LogLevel(level: LogLevel) {
    this.logLevel = level
  }
}
