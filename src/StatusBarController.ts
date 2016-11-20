import { window, StatusBarAlignment, StatusBarItem, TextEditor, TextDocument } from 'vscode';
import { RevealServerState, SlidifyOptions, RevealJsOptions } from './Models'
import { Configuration } from './Configuration'
import { DocumentContext, DocumentContexts } from './DocumentContext';


export class StatusBarController {
    private _countItem: StatusBarItem;
    private _addressItem: StatusBarItem;
    private _stopItem: StatusBarItem;

    private _slidifyOptions: SlidifyOptions;

    constructor(slidifyOptions: SlidifyOptions) {
        this._slidifyOptions = slidifyOptions;
    }

    private updateAddress(context: DocumentContext) {
        if (!this._addressItem) { this._addressItem = window.createStatusBarItem(StatusBarAlignment.Right, 100); }

        if (context.server.state === RevealServerState.Started) {
            this._addressItem.text = `$(server) ${context.server.uri}`;
            this._addressItem.command = "vscode-revealjs.showRevealJSInBrowser";
            this._addressItem.show();
        } else {
            this._addressItem.hide();
        }


    }

    private updateStop(context: DocumentContext) {
        if (!this._stopItem) { this._stopItem = window.createStatusBarItem(StatusBarAlignment.Right, 101); }

        this._stopItem.text = `$(primitive-square)`;
        this._stopItem.color = 'red';
        this._stopItem.command = "vscode-revealjs.KillRevealJSServer";

        if (context.server.state === RevealServerState.Started) {

            this._stopItem.show();
        } else {
            this._stopItem.hide();
        }
    }

    private updateCount(context: DocumentContext) {

        if (!this._countItem) { this._countItem = window.createStatusBarItem(StatusBarAlignment.Right, 102); }

        if (!context.editor || context.editor.document.languageId != 'markdown') {
            this._countItem.hide();
            return;
        }

        let slidecount = this.getSlideCount(context.editor.document);
        if (slidecount < 2) {
            this._countItem.hide();
        }
        else {
            this._countItem.text = `$(note) ${slidecount} Slides`;
            this._countItem.command = "vscode-revealjs.showRevealJS";
            this._countItem.show();
        }
    }


    public update(context: DocumentContext) {
        this.updateAddress(context);
        this.updateCount(context);
        this.updateStop(context);
    }


    public getSlideCount(doc: TextDocument): number {
        let count = 0;
        let docContent = doc.getText();
        let regex = new RegExp(this._slidifyOptions.separator, "gm");

        let matches = docContent.match(regex);
        if (matches) {
            count = matches.length + 1;
        }
        return count;
    }

    public dispose() {
        this._countItem.dispose();
    }
}
