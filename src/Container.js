"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @summary Container is a main god object that connect server, document, statusbar, iframe
 * @author Vincent B. <evilznet@gmail.com>
 */
const vscode_1 = require("vscode");
const http = require("http");
const jetpack = require("fs-jetpack");
const path = require("path");
const showRevealJS_1 = require("./commands/showRevealJS");
const Configuration_1 = require("./Configuration");
const constants_1 = require("./constants");
const EditorContext_1 = require("./EditorContext");
const RevealServer_1 = require("./RevealServer");
const SlideExplorer_1 = require("./SlideExplorer");
const StatusBarController_1 = require("./StatusBarController");
class Container {
    constructor(loadConfiguration, logger, extensionContext) {
        this.loadConfiguration = loadConfiguration;
        this.logger = logger;
        this.extensionContext = extensionContext;
        this.webView = null;
        this.exportTimeout = null;
        this.export = async () => {
            if (this.exportTimeout !== null) {
                clearTimeout(this.exportTimeout);
            }
            await jetpack.removeAsync(this.exportPath);
            const promise = new Promise((resolve) => {
                this.exportTimeout = setTimeout(() => resolve(this.exportPath), 5000);
            });
            this.webView ? this.refreshWebView() : await vscode_1.commands.executeCommand(showRevealJS_1.SHOW_REVEALJS);
            http.get(this.getUri(false) + 'libs/reveal.js/3.8.0/plugin/notes/notes.html');
            return promise;
        };
        this._configuration = this.loadConfiguration();
        this.editorContext = null;
        this.server = new RevealServer_1.RevealServer(this.logger, () => this.rootDir, () => this.slides, () => this.configuration, this.extensionContext.extensionPath, () => this.isInExport, () => this.exportPath);
        this.statusBarController = new StatusBarController_1.StatusBarController(() => this.server.uri, () => this.slideCount);
        this.statusBarController.update();
        this.slidesExplorer = new SlideExplorer_1.SlideTreeProvider(() => this.slides);
        this.slidesExplorer.register();
    }
    onDidChangeTextEditorSelection(event) {
        if (this.editorContext === null) {
            return;
        }
        if (event.textEditor !== this.editorContext.editor || event.selections.length === 0) {
            return;
        }
        const end = event.selections[0].active;
        this.editorContext.updatePosition(end);
        this.refreshWebView();
        // this.iframeProvider.update()
        this.editorContext.refresh(); // dont change this order !!!!!!
        this.statusBarController.update();
        this.slidesExplorer.update();
    }
    onDidChangeActiveTextEditor(editor) {
        if (editor && editor.document.languageId === 'markdown') {
            this.editorContext = new EditorContext_1.EditorContext(editor, Configuration_1.getDocumentOptions(this.configuration));
        }
        if (this.webView) {
            this.server.start();
            this.refreshWebView();
        }
        this.statusBarController.update();
        this.slidesExplorer.update();
    }
    onDidChangeTextDocument(e) {
        console.log('onDidChangeTextDocument');
    }
    onDidSaveTextDocument(e) {
        console.log('onDidSaveTextDocument');
    }
    onDidCloseTextDocument(e) {
        console.log('onDidCloseTextDocument');
    }
    onDidChangeConfiguration(e) {
        if (!e.affectsConfiguration(constants_1.extensionId)) {
            return;
        }
        this._configuration = this.loadConfiguration();
        this.logger.LogLevel = this._configuration.logLevel;
    }
    get rootDir() {
        if (this.editorContext) {
            return this.editorContext.dirname;
        }
        return '';
    }
    get configuration() {
        return this.editorContext !== null && this.editorContext.hasfrontConfig
            ? // tslint:disable-next-line:no-object-literal-type-assertion
                { ...this._configuration, ...this.editorContext.documentOptions }
            : this._configuration;
    }
    get isInExport() {
        return this.exportTimeout !== null;
    }
    get slides() {
        return this.editorContext === null ? [] : this.editorContext.slides;
    }
    get slideCount() {
        return this.editorContext === null ? 0 : this.editorContext.slideCount;
    }
    getUri(withPosition = true) {
        if (this.editorContext === null)
            return null;
        if (!this.server.isListening) {
            this.server.start();
        }
        const serverUri = this.server.uri;
        const slidepos = this.editorContext.position;
        return withPosition ? `${serverUri}#/${slidepos.horizontal}/${slidepos.vertical}/${Date.now()}` : `${serverUri}`;
    }
    get exportPath() {
        return path.isAbsolute(this.configuration.exportHTMLPath)
            ? this.configuration.exportHTMLPath
            : path.join(this.rootDir, this.configuration.exportHTMLPath);
    }
    isMarkdownFile() {
        return this.editorContext === null ? false : this.editorContext.isMarkdownFile;
    }
    goToSlide(topindex, verticalIndex) {
        if (this.editorContext !== null) {
            this.editorContext.goToSlide(topindex, verticalIndex);
        }
        this.refreshWebView();
    }
    stopServer() {
        this.server.stop();
        this.statusBarController.update();
    }
    refreshWebView(view) {
        if (view) {
            this.webView = view;
        }
        if (this.webView) {
            this.webView.html = `<style>html, body, iframe { height: 100% }</style>
      <iframe src="${this.getUri()}" frameBorder="0" style="width: 100%; height: 100%" />`;
        }
    }
}
exports.default = Container;
//# sourceMappingURL=Container.js.map