"use strict";
const vscode = require('vscode');
class BrowserContentProvider {
    constructor(documentContexts, helpers) {
        this._onDidChange = new vscode.EventEmitter();
        this.documentContexts = documentContexts;
        this.helpers = helpers;
    }
    provideTextDocumentContent(uri, token) {
        // get doc from uri
        let context = this.documentContexts.GetDocumentContextByUri(uri);
        // get current slide
        const editor = context.editor;
        let slidePosition = this.helpers.getSlidePosition(editor);
        // update uri
        return `<style>html, body, iframe { height: 100% }</style>
            <iframe src="${uri}${slidePosition}" frameBorder="0" style="width: 100%; height: 100%" />`;
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