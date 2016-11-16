import * as vscode from 'vscode';

export default class BrowserContentProvider implements vscode.TextDocumentContentProvider {
        
        private _onDidChange = new vscode.EventEmitter<vscode.Uri>();


        provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string {
            return `<style>html, body, iframe { height: 100% }</style>
            <iframe src="${uri}" frameBorder="0" style="width: 100%; height: 100%" />`;
        }

        get onDidChange(): vscode.Event<vscode.Uri> {
            return this._onDidChange.event;
        }
        
        public update(uri: vscode.Uri) {
            this._onDidChange.fire(uri);
        }
    }