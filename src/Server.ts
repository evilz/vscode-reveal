import {RevealServerState, SlidifyOptions, RevealJsOptions} from './Models'
import {Template} from './Template'
import {Configuration} from './Configuration'

import {TextEditor, Uri} from 'vscode'
import * as path from 'path';
import * as url from 'url';
import * as http from 'http';
import * as express from 'express';

var md = require('reveal.js/plugin/markdown/markdown');

export class RevealServer {

    private app = express();
    private server: http.Server;
    private staticDir = express.static;
    private host:string = 'localhost';
    private configuation:Configuration;

    private editor:TextEditor

    state = RevealServerState.Stopped;
    uri:Uri;

    get title():string {
        return `RevealJS : ${this.editor.document.fileName}`
    }

    private get _text():string{
        return this.editor.document.getText();
    }
    
    public stop(){
        if (this.state == RevealServerState.Started) {
            this.server.close();
            this.state = RevealServerState.Stopped;
            console.log(`Reveal-server Stopped`);
        }

    }

    public start() {

        if (this.state == RevealServerState.Stopped) {
            this.server = this.app.listen(0);
            this.state = RevealServerState.Started;
            console.log(`Reveal-server started, opening at http://${this.host}:${this.server.address().port}`);
        }
        this.uri = Uri.parse(`http://${this.host}:${this.server.address().port}/`);
    }

    constructor(editor: TextEditor, configuration:Configuration ) {
        this.configuation = configuration;
        this.editor = editor;
        this.initExpressServer();
    }

    initExpressServer = () => {
        let revealBasePath = path.resolve(require.resolve('reveal.js'), '..', '..');

        let staticDirs = ['css', 'js', 'images', 'plugin', 'lib'];
        for (var dir of staticDirs) {
            this.app.use('/' + dir, this.staticDir(path.join(revealBasePath, dir)));
        }

        this.app.use('/',this.staticDir(path.dirname(this.editor.document.fileName)));

        let highlightPath = path.resolve(require.resolve('highlight.js'), '..', '..');
        this.app.use(`/lib/css/${this.configuation.revealJsOptions.highlightTheme}.css`,
            this.staticDir(path.join(highlightPath, 'styles', this.configuation.revealJsOptions.highlightTheme + '.css')));

        this.app.get('/', this.renderMarkdownAsSlides);
    }

    renderMarkdownAsSlides = (req, res) => {

        // Look for print-pdf option
        //if (~req.url.indexOf('?print-pdf')) {
        //    req.url = req.url.replace('?print-pdf', '');
        //}

        this.render(res, this._text);
    };

    render = (res, markdown) => {
        let slides = md.slidify(markdown, this.configuation.slidifyOptions);
        let result = Template.Render(this.title,this.configuation.revealJsOptions,slides);
        res.send(result);
    };
}
