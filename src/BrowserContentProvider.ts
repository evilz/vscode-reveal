import { DocumentContexts, DocumentContext } from './DocumentContext';
import * as vscode from 'vscode';
import {Helpers} from './Helpers';

export default class BrowserContentProvider implements vscode.TextDocumentContentProvider {

        private documentContexts:DocumentContexts;
        private helpers:Helpers;

        constructor(documentContexts:DocumentContexts, helpers:Helpers) {
            this.documentContexts = documentContexts;
            this.helpers = helpers;
        }

        private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

        provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string {
            
            // get doc from uri
            let context = this.documentContexts.GetDocumentContextByUri(uri);
            // get current slide
            const editor = context.editor;

            let slidePosition = this.helpers.getSlidePosition(editor); 
            // update uri

            return `<style>html, body, iframe { height: 100% }</style>
            <iframe src="${uri}${slidePosition}" frameBorder="0" style="width: 100%; height: 100%" />`;
        }

        get onDidChange(): vscode.Event<vscode.Uri> {
            return this._onDidChange.event;
        }
        
        public update(uri: vscode.Uri) {
            this._onDidChange.fire(uri);
        }
    }