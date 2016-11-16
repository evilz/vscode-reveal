'use strict';
const vscode = require('vscode');
const BrowserContentProvider_1 = require('./BrowserContentProvider');
const StatusBarController_1 = require('./StatusBarController');
const Configuration_1 = require('./Configuration');
const DocumentContext_1 = require('./DocumentContext');
var open = require('open');
function activate(context) {
    let configuration = new Configuration_1.Configuration();
    let documentContexts = new DocumentContext_1.DocumentContexts(configuration);
    let statusBarController = new StatusBarController_1.StatusBarController(configuration.slidifyOptions);
    let provider = new BrowserContentProvider_1.default();
    let registrationHTTP = vscode.workspace.registerTextDocumentContentProvider('http', provider);
    let currentTab;
    console.log('Congratulations, your extension "vscode-reveal" is now active!');
    let showRevealJS = () => {
        if (currentTab.document.languageId !== "markdown") {
            vscode.window.showInformationMessage("revealjs presentation can only be markdown file");
            return null;
        }
        let context = getContext();
        context.server.start();
        return context.server.uri;
    };
    let getContext = () => {
        return documentContexts.GetDocumentContext(currentTab);
    };
    // COMMAND : showRevealJS
    context.subscriptions.push(vscode.commands.registerCommand('vscode-revealjs.showRevealJS', () => {
        if (currentTab == null) {
            currentTab = vscode.window.activeTextEditor;
        }
        let uri = showRevealJS();
        if (uri) {
            return vscode.commands.executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.Two, 'Reveal JS presentation')
                .then((success) => { }, (error) => { vscode.window.showErrorMessage(error); });
        }
        else {
            return null;
        }
        ;
    }));
    // COMMAND : showRevealJSInBrowser
    context.subscriptions.push(vscode.commands.registerCommand('vscode-revealjs.showRevealJSInBrowser', () => {
        if (currentTab == null) {
            currentTab = vscode.window.activeTextEditor;
        }
        let uri = showRevealJS();
        return open(uri.toString());
    }));
    // COMMAND : KillRevealJSServer
    context.subscriptions.push(vscode.commands.registerCommand('vscode-revealjs.KillRevealJSServer', () => {
        let context = getContext();
        context.server.stop();
        statusBarController.update(context);
    }));
    vscode.workspace.onDidCloseTextDocument((e) => {
        vscode.window.showInformationMessage(`${e.fileName} closed`);
    });
    // vscode.workspace.onDidChangeConfiguration((e:void)=>{
    //     let context = getContext();
    //     statusBarController.update(context);
    //     provider.update(context.server.uri);
    // });
    // ON TAB CHANGE
    vscode.window.onDidChangeActiveTextEditor((e) => {
        if (e) {
            currentTab = e;
            statusBarController.update(getContext());
        }
    });
    // ON CHANGE TEXT
    vscode.workspace.onDidChangeTextDocument((_) => {
        statusBarController.update(getContext());
    });
    // ON SAVE
    vscode.workspace.onDidSaveTextDocument((document) => {
        if (document === vscode.window.activeTextEditor.document) {
            let context = getContext();
            statusBarController.update(context);
            provider.update(context.server.uri);
        }
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map