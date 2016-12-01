"use strict";
const Models_1 = require('./Models');
const Template_1 = require('./Template');
const vscode_1 = require('vscode');
const path = require('path');
const express = require('express');
var md = require('reveal.js/plugin/markdown/markdown');
var front = require('yaml-front-matter');
class RevealServer {
    constructor(editor, configuration) {
        this.app = express();
        this.staticDir = express.static;
        this.host = 'localhost';
        this.state = Models_1.RevealServerState.Stopped;
        this.initExpressServer = () => {
            let revealBasePath = path.resolve(require.resolve('reveal.js'), '..', '..');
            let staticDirs = ['css', 'js', 'images', 'plugin', 'lib'];
            for (var dir of staticDirs) {
                this.app.use('/' + dir, this.staticDir(path.join(revealBasePath, dir)));
            }
            this.app.use('/', this.staticDir(path.dirname(this.editor.document.fileName)));
            let highlightPath = path.resolve(require.resolve('highlight.js'), '..', '..');
            this.app.use(`/lib/css/${this.configuation.revealJsOptions.highlightTheme}.css`, this.staticDir(path.join(highlightPath, 'styles', this.configuation.revealJsOptions.highlightTheme + '.css')));
            this.app.get('/', this.renderMarkdownAsSlides);
        };
        this.renderMarkdownAsSlides = (req, res) => {
            // Look for print-pdf option
            //if (~req.url.indexOf('?print-pdf')) {
            //    req.url = req.url.replace('?print-pdf', '');
            //}
            this.render(res, this._text);
        };
        this.render = (res, markdown) => {
            var frontConfig = front.loadFront(markdown);
            let content = frontConfig.__content;
            let slidifyOptions = this.slidifyOptionsWithFront(frontConfig);
            let revealJsOptions = this.revealJsOptionsWithFront(frontConfig);
            let slides = md.slidify(content, slidifyOptions);
            let result = Template_1.Template.Render(this.title, revealJsOptions, slides);
            res.send(result);
        };
        this.slidifyOptionsWithFront = (frontConfig) => {
            var options = {};
            Object.assign(options, this.configuation.slidifyOptions);
            Object.assign(options, frontConfig);
            return options;
        };
        this.revealJsOptionsWithFront = (frontConfig) => {
            var options = {};
            Object.assign(options, this.configuation.revealJsOptions);
            Object.assign(options, frontConfig);
            return options;
        };
        this.configuation = configuration;
        this.editor = editor;
        this.initExpressServer();
    }
    get title() {
        return `RevealJS : ${this.editor.document.fileName}`;
    }
    get _text() {
        return this.editor.document.getText();
    }
    stop() {
        if (this.state == Models_1.RevealServerState.Started) {
            this.server.close();
            this.state = Models_1.RevealServerState.Stopped;
            console.log(`Reveal-server Stopped`);
        }
    }
    start() {
        if (this.state == Models_1.RevealServerState.Stopped) {
            this.server = this.app.listen(0);
            this.state = Models_1.RevealServerState.Started;
            console.log(`Reveal-server started, opening at http://${this.host}:${this.server.address().port}`);
        }
        this.uri = vscode_1.Uri.parse(`http://${this.host}:${this.server.address().port}/`);
    }
}
exports.RevealServer = RevealServer;
//# sourceMappingURL=Server.js.map