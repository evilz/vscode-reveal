import * as vscode from 'vscode'
import { DocumentContexts } from './DocumentContext'
import { Helpers } from './Helpers'

export default class BrowserContentProvider implements vscode.TextDocumentContentProvider {

    private documentContexts: DocumentContexts
    private helpers: Helpers

    constructor(documentContexts: DocumentContexts, helpers: Helpers) {
        this.documentContexts = documentContexts
        this.helpers = helpers
    }

    private _onDidChange = new vscode.EventEmitter<vscode.Uri>()

    public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string {

        // get doc from uri
        const context = this.documentContexts.GetDocumentContextByUri(uri)
        // get current slide
        const editor = context.editor

        const slidePosition = this.helpers.getSlidePosition(editor)
        // update uri

        // add Date.now() to force refresh ! no cache
        return `<style>html, body, iframe { height: 100% }</style>
            <iframe src="${uri}${slidePosition}/${Date.now()}" frameBorder="0" style="width: 100%; height: 100%" />`
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event
    }

    public update(uri: vscode.Uri): void {
        this._onDidChange.fire(uri)
    }
}
