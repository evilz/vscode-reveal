"use strict";
const models_1 = require('./models');
const template_1 = require('./template');
const vscode = require('vscode');
const path = require('path');
const express = require('express');
var md = require('reveal.js/plugin/markdown/markdown');
class RevealServer {
    constructor(document) {
        this.document = document;
        this._app = express();
        this._staticDir = express.static;
        this._host = 'localhost';
        this._state = models_1.RevealServerState.Stopped;
        this.initExpressServer = () => {
            let revealBasePath = path.resolve(require.resolve('reveal.js'), '..', '..');
            let staticDirs = ['css', 'js', 'images', 'plugin', 'lib'];
            for (var dir of staticDirs) {
                this._app.use('/' + dir, this._staticDir(path.join(revealBasePath, dir)));
            }
            let highlightPath = path.resolve(require.resolve('highlight.js'), '..', '..');
            this._app.use(`/lib/css/${this.revealjsOptions.highlightTheme}.css`, this._staticDir(path.join(highlightPath, 'styles', this.revealjsOptions.highlightTheme + '.css')));
            this._app.get('/', this.renderMarkdownAsSlides);
        };
        this.renderMarkdownAsSlides = (req, res) => {
            // Look for print-pdf option
            //if (~req.url.indexOf('?print-pdf')) {
            //    req.url = req.url.replace('?print-pdf', '');
            //}
            let markdown = this.document.getText();
            this.render(res, markdown);
        };
        this.render = (res, markdown) => {
            let slides = md.slidify(markdown, this.slidifyOptions);
            let result = template_1.Template.Render(this._title, this.revealjsOptions, slides);
            res.send(result);
        };
        this._title = `RevealJS : ${document.fileName}`;
        this.initExpressServer();
    }
    Start() {
        if (this._state == models_1.RevealServerState.Stopped) {
            this._server = this._app.listen(0);
            this._state = models_1.RevealServerState.Started;
            console.log(`Reveal-server started, opening at http://${this._host}:${this._server.address().port}`);
        }
        let initialFilePath = `http://${this._host}:${this._server.address().port}/`;
        // open(initialFilePath);
        return initialFilePath;
    }
    get revealjsOptions() {
        return vscode.workspace.getConfiguration('revealjs');
    }
    get slidifyOptions() {
        return vscode.workspace.getConfiguration('revealjs');
    }
}
exports.RevealServer = RevealServer;
//# sourceMappingURL=server.js.map