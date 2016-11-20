import { TextEditor } from 'vscode';
import { RevealServer } from './Server';
import { Configuration } from './Configuration';


export interface DocumentContext {
    editor: TextEditor;
    server: RevealServer;
}

// TODO REMOVE ! clean 
export class DocumentContexts {
    private _map = new Map<TextEditor, DocumentContext>();
    private _configuation: Configuration;

    constructor(configuration: Configuration) {
        this._configuation = configuration;
    }

    public HasDocumentContext(editor: TextEditor):boolean{
        return this._map.has(editor);
    }

    public GetDocumentContext(editor: TextEditor) {
        if (this._map.has(editor)) {
            return this._map.get(editor);
        }

        let context = {
            editor: editor,
            server: new RevealServer(editor, this._configuation),
        } as DocumentContext;

        this._map.set(editor, context);
        return context;
    };
}

