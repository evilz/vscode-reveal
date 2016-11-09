'use strict';
const vscode = require('vscode');
const server_1 = require("./server");
const BrowserContentProvider_1 = require('./BrowserContentProvider');
var open = require('open');
function activate(context) {
    let serverByFiles = new Map();
    let provider = new BrowserContentProvider_1.default();
    let registrationHTTP = vscode.workspace.registerTextDocumentContentProvider('http', provider);
    console.log('Congratulations, your extension "vscode-reveal" is now active!');
    let createServer = (document) => {
        return new server_1.RevealServer(document);
    };
    let findOrCreateServer = (document) => {
        if (serverByFiles.has(document)) {
            return serverByFiles.get(document);
        }
        let newServer = createServer(document);
        serverByFiles.set(document, newServer);
        return newServer;
    };
    let isMarkdown = () => {
        return (vscode.window.activeTextEditor.document.languageId == 'markdown');
    };
    // showRevealJSInBrowser
    // if (openWebBrowser) {
    //     open(initialFilePath);
    // }
    // COMMAND : showRevealJS
    let disposable = vscode.commands.registerCommand('extension.showRevealJS', () => {
        if (!isMarkdown())
            return vscode.window.showInformationMessage("revealjs presentation can only be markdown file");
        var server = findOrCreateServer(vscode.window.activeTextEditor.document);
        let startPage = server.Start();
        let uri = vscode.Uri.parse(startPage);
        return vscode.commands.executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.Two, 'Reveal JS presentation')
            .then((success) => { }, (error) => {
            vscode.window.showErrorMessage(error);
        });
    });
    context.subscriptions.push(disposable);
    // COMMAND : showRevealJSInBrowser
    let disposable2 = vscode.commands.registerCommand('extension.showRevealJSInBrowser', () => {
        if (!isMarkdown())
            return vscode.window.showInformationMessage("revealjs presentation can only be markdown file");
        var server = findOrCreateServer(vscode.window.activeTextEditor.document);
        let startPage = server.Start();
        return open(startPage);
    });
    context.subscriptions.push(disposable2);
    // ON CHANGE
    vscode.workspace.onDidChangeTextDocument((e) => {
        // nothing
    });
    // ON SAVE
    vscode.workspace.onDidSaveTextDocument((document) => {
        if (document === vscode.window.activeTextEditor.document) {
            var server = findOrCreateServer(vscode.window.activeTextEditor.document);
            let startPage = server.Start();
            let uri = vscode.Uri.parse(startPage);
            provider.update(uri);
        }
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map