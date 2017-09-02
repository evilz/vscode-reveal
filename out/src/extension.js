'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const BrowserContentProvider_1 = require("./BrowserContentProvider");
const StatusBarController_1 = require("./StatusBarController");
const Configuration_1 = require("./Configuration");
const DocumentContext_1 = require("./DocumentContext");
const Helpers_1 = require("./Helpers");
var open = require('open');
function activate(context) {
    let configuration = new Configuration_1.Configuration();
    let documentContexts = new DocumentContext_1.DocumentContexts(configuration);
    let statusBarController = new StatusBarController_1.StatusBarController(configuration.slidifyOptions);
    let helpers = new Helpers_1.Helpers(configuration);
    let provider = new BrowserContentProvider_1.default(documentContexts, helpers);
    vscode.workspace.registerTextDocumentContentProvider('http', provider);
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
        let context = documentContexts.GetDocumentContext(currentTab);
        if (!context) {
            context = documentContexts.createContext(currentTab);
        }
        return context;
    };
    currentTab = vscode.window.activeTextEditor;
    statusBarController.update(getContext());
    // COMMAND : showRevealJS
    context.subscriptions.push(vscode.commands.registerCommand('vscode-revealjs.showRevealJS', () => {
        if (currentTab === null) {
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
    }));
    // COMMAND : showRevealJSInBrowser
    context.subscriptions.push(vscode.commands.registerCommand('vscode-revealjs.showRevealJSInBrowser', () => {
        if (currentTab === null) {
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
    // ON TAB CHANGE
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((e) => {
        if (e) {
            currentTab = e;
            statusBarController.update(getContext());
        }
    }));
    // ON CHANGE TEXT
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((_) => {
        statusBarController.update(getContext());
    }));
    // ON SAVE
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((document) => {
        if (document === vscode.window.activeTextEditor.document) {
            let context = getContext();
            statusBarController.update(context);
            if (context.server.uri) {
                provider.update(context.server.uri);
            }
        }
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map