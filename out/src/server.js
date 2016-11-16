"use strict";
const models_1 = require('./models');
const template_1 = require('./template');
const vscode_1 = require('vscode');
const path = require('path');
const express = require('express');
var md = require('reveal.js/plugin/markdown/markdown');
class RevealServer {
    constructor(editor, configuration) {
        this.editor = editor;
        this._app = express();
        this._staticDir = express.static;
        this._host = 'localhost';
        this.state = models_1.RevealServerState.Stopped;
        this.initExpressServer = () => {
            let revealBasePath = path.resolve(require.resolve('reveal.js'), '..', '..');
            let staticDirs = ['css', 'js', 'images', 'plugin', 'lib'];
            for (var dir of staticDirs) {
                this._app.use('/' + dir, this._staticDir(path.join(revealBasePath, dir)));
            }
            let highlightPath = path.resolve(require.resolve('highlight.js'), '..', '..');
            this._app.use(`/lib/css/${this._configuation.revealJsOptions.highlightTheme}.css`, this._staticDir(path.join(highlightPath, 'styles', this._configuation.revealJsOptions.highlightTheme + '.css')));
            this._app.get('/', this.renderMarkdownAsSlides);
        };
        this.renderMarkdownAsSlides = (req, res) => {
            // Look for print-pdf option
            //if (~req.url.indexOf('?print-pdf')) {
            //    req.url = req.url.replace('?print-pdf', '');
            //}
            this.render(res, this._text);
        };
        this.render = (res, markdown) => {
            let slides = md.slidify(markdown, this._configuation.slidifyOptions);
            let result = template_1.Template.Render(this.title, this._configuation.revealJsOptions, slides);
            res.send(result);
        };
        this._configuation = configuration;
        this._editor = editor;
        this.initExpressServer();
    }
    get title() {
        return `RevealJS : ${this._editor.document.fileName}`;
    }
    get _text() {
        return this._editor.document.getText();
    }
    stop() {
        if (this.state == models_1.RevealServerState.Started) {
            this._server.close();
            this.state = models_1.RevealServerState.Stopped;
            console.log(`Reveal-server Stopped`);
        }
    }
    start() {
        if (this.state == models_1.RevealServerState.Stopped) {
            this._server = this._app.listen(0);
            this.state = models_1.RevealServerState.Started;
            console.log(`Reveal-server started, opening at http://${this._host}:${this._server.address().port}`);
        }
        this.uri = vscode_1.Uri.parse(`http://${this._host}:${this._server.address().port}/`);
    }
}
exports.RevealServer = RevealServer;
//# sourceMappingURL=server.js.map