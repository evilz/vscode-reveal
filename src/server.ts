import {RevealServerState, SlidifyOptions, RevealJsOptions} from './models'
import {Template} from './template'

import * as vscode from 'vscode'
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
    private _state = RevealServerState.Stopped;

    private _title: string;
    

    public Start(): string {

        if (this._state == RevealServerState.Stopped) {
            this._server = this._app.listen(0);
            this._state = RevealServerState.Started;
            console.log(`Reveal-server started, opening at http://${this._host}:${this._server.address().port}`);
        }

        let initialFilePath = `http://${this._host}:${this._server.address().port}/`

       // open(initialFilePath);
    
        return initialFilePath;
    }

    constructor(public document: vscode.TextDocument) {
        this._title = `RevealJS : ${document.fileName}`
        this.initExpressServer();
    }

    initExpressServer = () => {
        let revealBasePath = path.resolve(require.resolve('reveal.js'), '..', '..');

        let staticDirs = ['css', 'js', 'images', 'plugin', 'lib'];
        for (var dir of staticDirs) {
            this._app.use('/' + dir, this._staticDir(path.join(revealBasePath, dir)));
        }

        let highlightPath = path.resolve(require.resolve('highlight.js'), '..', '..');
        this._app.use(`/lib/css/${this.revealjsOptions.highlightTheme}.css`,
            this._staticDir(path.join(highlightPath, 'styles', this.revealjsOptions.highlightTheme + '.css')));

        this._app.get('/', this.renderMarkdownAsSlides);
    }

    renderMarkdownAsSlides = (req, res) => {

        // Look for print-pdf option
        //if (~req.url.indexOf('?print-pdf')) {
        //    req.url = req.url.replace('?print-pdf', '');
        //}

        let markdown = this.document.getText();
        this.render(res, markdown);
    };

    get revealjsOptions(): RevealJsOptions {
        return <any>vscode.workspace.getConfiguration('revealjs') as RevealJsOptions;
    }

    get slidifyOptions(): SlidifyOptions {
        return <any>vscode.workspace.getConfiguration('revealjs') as SlidifyOptions;
    }

    render = (res, markdown) => {
        let slides = md.slidify(markdown, this.slidifyOptions);
        let result = Template.Render(this._title,this.revealjsOptions,slides);
        res.send(result);
    };
}
