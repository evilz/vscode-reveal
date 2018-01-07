import * as vscode from 'vscode'
import { VSCodeRevealContext } from './VSCodeRevealContext'
import { VSCodeRevealContexts } from './VSCodeRevealContexts'

export default class IframeContentProvider implements vscode.TextDocumentContentProvider {
  // tslint:disable-next-line:variable-name
  private _onDidChange = new vscode.EventEmitter<vscode.Uri>()

  constructor(private getContext:(()=> VSCodeRevealContext) ) {}

  public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string {
    const url = this.getContext().uri
    console.log(`return html with iframe ${url}`)
    return `<style>html, body, iframe { height: 100% }</style>
            <iframe src="${url}" frameBorder="0" style="width: 100%; height: 100%" />`
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this._onDidChange.event
  }

  public update(): void {
    this._onDidChange.fire(this.previewUri)
  }

  public register() {
    return vscode.workspace.registerTextDocumentContentProvider(this.uriScheme, this)
  }

  public get previewUri() {
    return vscode.Uri.parse('reveal-preview://authority/reveal-preview')
  }

  private get uriScheme() {
    return 'reveal-preview'
  }
}
