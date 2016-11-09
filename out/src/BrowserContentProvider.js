"use strict";
const vscode = require('vscode');
class BrowserContentProvider {
    constructor() {
        this._onDidChange = new vscode.EventEmitter();
    }
    provideTextDocumentContent(uri, token) {
        return `<style>
            html, body, iframe { height: 100% }
            </style>
            <iframe src="${uri}" frameBorder="0" style="width: 100%; height: 100%" />`;
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    update(uri) {
        this._onDidChange.fire(uri);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BrowserContentProvider;
//# sourceMappingURL=BrowserContentProvider.js.map