'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const exportHTML_1 = require("./commands/exportHTML");
const exportPDF_1 = require("./commands/exportPDF");
const goToSlide_1 = require("./commands/goToSlide");
const showRevealJS_1 = require("./commands/showRevealJS");
const showRevealJSInBrowser_1 = require("./commands/showRevealJSInBrowser");
const stopRevealJSServer_1 = require("./commands/stopRevealJSServer");
const Configuration_1 = require("./Configuration");
const constants_1 = require("./constants");
const Container_1 = require("./Container");
const Logger_1 = require("./Logger");
function activate(context) {
    const registerCommand = (command, callback, thisArg) => {
        const disposable = vscode_1.commands.registerCommand(command, callback, thisArg);
        context.subscriptions.push(disposable);
    };
    const loadConfigurationFn = () => Configuration_1.loadConfiguration(() => vscode_1.workspace.getConfiguration(constants_1.extensionId));
    const startingConfig = loadConfigurationFn();
    const outputChannel = vscode_1.window.createOutputChannel(constants_1.extensionId);
    const appendLine = (value) => outputChannel.appendLine(value);
    const logger = new Logger_1.Logger(startingConfig.logLevel, appendLine);
    const container = new Container_1.default(loadConfigurationFn, logger, context);
    container.onDidChangeActiveTextEditor(vscode_1.window.activeTextEditor);
    logger.log('"vscode-reveal" is now active');
    vscode_1.commands.executeCommand('setContext', 'slideExplorerEnabled', container.configuration.slideExplorerEnabled);
    registerCommand(showRevealJS_1.SHOW_REVEALJS, showRevealJS_1.showRevealJS(view => container.refreshWebView(view)));
    registerCommand(showRevealJSInBrowser_1.SHOW_REVEALJS_IN_BROWSER, showRevealJSInBrowser_1.showRevealJSInBrowser(() => container.getUri()));
    registerCommand(stopRevealJSServer_1.STOP_REVEALJS_SERVER, () => container.stopServer());
    registerCommand(goToSlide_1.GO_TO_SLIDE, arg => container.goToSlide(arg.horizontal, arg.vertical));
    registerCommand(exportPDF_1.EXPORT_PDF, exportPDF_1.exportPDF(() => container.getUri(false)));
    registerCommand(exportHTML_1.EXPORT_HTML, exportHTML_1.exportHTML(logger, container.export, () => container.configuration.openFilemanagerAfterHTMLExport));
    vscode_1.window.onDidChangeTextEditorSelection(e => container.onDidChangeTextEditorSelection(e));
    vscode_1.window.onDidChangeActiveTextEditor(e => container.onDidChangeActiveTextEditor(e));
    vscode_1.workspace.onDidChangeTextDocument(e => container.onDidChangeTextDocument(e));
    vscode_1.workspace.onDidSaveTextDocument(e => container.onDidSaveTextDocument(e));
    vscode_1.workspace.onDidCloseTextDocument(e => container.onDidCloseTextDocument(e));
    vscode_1.workspace.onDidChangeConfiguration(e => container.onDidChangeConfiguration(e));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    console.log('"vscode-reveal" is now deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map