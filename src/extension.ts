'use strict';
import * as vscode from 'vscode';
import { RevealServer } from "./server";
import BrowserContentProvider from './BrowserContentProvider';
import { StatusBarController } from './StatusBarController';
import { Configuration } from './Configuration';
import { DocumentContext, DocumentContexts } from './DocumentContext';
import { RevealServerState, SlidifyOptions, RevealJsOptions } from './models';
import * as helpers from './helpers'

var open = require('open');

export function activate(context: vscode.ExtensionContext) {

    let configuration = new Configuration();
    let documentContexts = new DocumentContexts(configuration);
    let statusBarController = new StatusBarController(configuration.slidifyOptions);
    let provider = new BrowserContentProvider();
    let registrationHTTP = vscode.workspace.registerTextDocumentContentProvider('http', provider);

    let currentTab: vscode.TextEditor;

    console.log('Congratulations, your extension "vscode-reveal" is now active!');

    let showRevealJS = () => {
        if (currentTab.document.languageId !== "markdown") {
            vscode.window.showInformationMessage("revealjs presentation can only be markdown file");
            return null;
        }
        let context = getContext();
        context.server.start();
        return context.server.uri;
    }

    let getContext = () => {
        return documentContexts.GetDocumentContext(currentTab);
    }

    // COMMAND : showRevealJS
    context.subscriptions.push(vscode.commands.registerCommand('vscode-revealjs.showRevealJS', () => {
        if (currentTab == null) { currentTab = vscode.window.activeTextEditor; }
        let uri = showRevealJS();
        if (uri) {
            return vscode.commands.executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.Two, 'Reveal JS presentation')
                .then(
                (success) => { },
                (error) => { vscode.window.showErrorMessage(error); }
                );
        }
        else { return null };
    }));

    // COMMAND : showRevealJSInBrowser
    context.subscriptions.push(
        vscode.commands.registerCommand('vscode-revealjs.showRevealJSInBrowser', () => {
            if (currentTab == null) { currentTab = vscode.window.activeTextEditor; }
            let uri = showRevealJS();
            return open(uri.toString());

        })
    );

    // COMMAND : KillRevealJSServer
    context.subscriptions.push(
        vscode.commands.registerCommand('vscode-revealjs.KillRevealJSServer', () => {
            let context = getContext();
            context.server.stop();
            statusBarController.update(context);
        }));

    // ON TAB CHANGE
    vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor) => {
        if(e)
        {
            currentTab = e;
            statusBarController.update(getContext());
        }
    });

    // ON CHANGE TEXT
    vscode.workspace.onDidChangeTextDocument((_) => {
        statusBarController.update(getContext());
    }
    );

    // ON SAVE
    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
        if (document === vscode.window.activeTextEditor.document) {
            let context = getContext();
            statusBarController.update(context);
            provider.update(context.server.uri);
        }
    });


}

// this method is called when your extension is deactivated
export function deactivate() {
}