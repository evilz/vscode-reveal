import {RevealServerState, SlidifyOptions, RevealJsOptions} from './models'
import {Template} from './template'
import {Configuration} from './Configuration'

import {TextEditor, Uri} from 'vscode'
import * as path from 'path';
import * as url from 'url';
import * as http from 'http';
import * as express from 'express';

var md = require('reveal.js/plugin/markdown/markdown');

export class RevealServer {

    private _app = express();
    private _server: http.Server;
    private _staticDir = express.static;
    private _host:string = 'localhost';
    private _configuation:Configuration;

    private _editor:TextEditor

    state = RevealServerState.Stopped;
    uri:Uri;

    get title():string {
        return `RevealJS : ${this._editor.document.fileName}`
    }

    private get _text():string{
        return this._editor.document.getText();
    }
    
    public stop(){
        if (this.state == RevealServerState.Started) {
            this._server.close();
            this.state = RevealServerState.Stopped;
            console.log(`Reveal-server Stopped`);
        }

    }

    public start() {

        if (this.state == RevealServerState.Stopped) {
            this._server = this._app.listen(0);
            this.state = RevealServerState.Started;
            console.log(`Reveal-server started, opening at http://${this._host}:${this._server.address().port}`);
        }
        this.uri = Uri.parse(`http://${this._host}:${this._server.address().port}/`);
    }

    constructor(public editor: TextEditor, configuration:Configuration ) {
        this._configuation = configuration;
        this._editor = editor;
        this.initExpressServer();
    }

    initExpressServer = () => {
        let revealBasePath = path.resolve(require.resolve('reveal.js'), '..', '..');

        let staticDirs = ['css', 'js', 'images', 'plugin', 'lib'];
        for (var dir of staticDirs) {
            this._app.use('/' + dir, this._staticDir(path.join(revealBasePath, dir)));
        }

        let highlightPath = path.resolve(require.resolve('highlight.js'), '..', '..');
        this._app.use(`/lib/css/${this._configuation.revealJsOptions.highlightTheme}.css`,
            this._staticDir(path.join(highlightPath, 'styles', this._configuation.revealJsOptions.highlightTheme + '.css')));

        this._app.get('/', this.renderMarkdownAsSlides);
    }

    renderMarkdownAsSlides = (req, res) => {

        // Look for print-pdf option
        //if (~req.url.indexOf('?print-pdf')) {
        //    req.url = req.url.replace('?print-pdf', '');
        //}

        this.render(res, this._text);
    };

    render = (res, markdown) => {
        let slides = md.slidify(markdown, this._configuation.slidifyOptions);
        let result = Template.Render(this.title,this._configuation.revealJsOptions,slides);
        res.send(result);
    };
}
