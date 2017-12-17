import * as vscode from 'vscode'
import { findContextBy } from './EditorContexts'
import { VSodeRevealContext } from './VSodeRevealContext'

export default class BrowserContentProvider implements vscode.TextDocumentContentProvider {
  // tslint:disable-next-line:variable-name
  private _onDidChange = new vscode.EventEmitter<vscode.Uri>()

  public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string {
    const url = decodeURIComponent(uri.toString().replace('reveal://', ''))
    console.log('return html with iframe')
    return `<style>html, body, iframe { height: 100% }</style>
            <iframe src="${url}" frameBorder="0" style="width: 100%; height: 100%" />`
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this._onDidChange.event
  }

  public update(uri: vscode.Uri): void {
    this._onDidChange.fire(uri)
  }
}
