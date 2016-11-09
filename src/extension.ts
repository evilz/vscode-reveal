'use strict';
import * as vscode from 'vscode';
import { RevealServer } from "./server";
import BrowserContentProvider from './BrowserContentProvider';

var open = require('open');

export function activate(context: vscode.ExtensionContext) {

    let serverByFiles = new Map<vscode.TextDocument, RevealServer>();
    let provider = new BrowserContentProvider();
    let registrationHTTP = vscode.workspace.registerTextDocumentContentProvider('http', provider);

    console.log('Congratulations, your extension "vscode-reveal" is now active!');

    let createServer = (document: vscode.TextDocument): RevealServer => {
        return new RevealServer(document);
    };

    let findOrCreateServer = (document: vscode.TextDocument): RevealServer => {

        if (serverByFiles.has(document)) {
            return serverByFiles.get(document);
        }

        let newServer = createServer(document);
        serverByFiles.set(document, newServer);
        return newServer;
    };

    let isMarkdown = ():boolean => {
        return (vscode.window.activeTextEditor.document.languageId == 'markdown')
    }

    // showRevealJSInBrowser
    // if (openWebBrowser) {
    //     open(initialFilePath);
    // }

    // COMMAND : showRevealJS
    let disposable = vscode.commands.registerCommand('extension.showRevealJS', () => {
        if(!isMarkdown()) return  vscode.window.showInformationMessage("revealjs presentation can only be markdown file");
        
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
        
        if(!isMarkdown()) return  vscode.window.showInformationMessage("revealjs presentation can only be markdown file");
                
        var server = findOrCreateServer(vscode.window.activeTextEditor.document);
        let startPage = server.Start();
        return open(startPage);
        
    });
    context.subscriptions.push(disposable2);




    // ON CHANGE
    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
       // nothing
    });


    // ON SAVE
    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
         if (document === vscode.window.activeTextEditor.document) {
            var server = findOrCreateServer(vscode.window.activeTextEditor.document);
            let startPage = server.Start();
            let uri = vscode.Uri.parse(startPage);
            provider.update(uri);
        }
    });


}

// this method is called when your extension is deactivated
export function deactivate() {
}