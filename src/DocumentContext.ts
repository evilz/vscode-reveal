import { TextEditor, Uri } from 'vscode';
import { RevealServer } from './Server';
import { Configuration } from './Configuration';


export interface DocumentContext {
    editor: TextEditor;
    server: RevealServer;
}

export class DocumentContexts{

    private innerArray = new Array<DocumentContext>();
    private configuation: Configuration;

    constructor(configuration: Configuration) {
        this.configuation = configuration;
    }

    public GetDocumentContext(editor: TextEditor) {
        return this.innerArray.find( (c) => c.editor === editor );
    };

    public createContext(editor: TextEditor){
         let context = {
            editor: editor,
            server: new RevealServer(editor, this.configuation),
        } as DocumentContext;

        this.innerArray.push(context);
        return context;
    }

    public GetDocumentContextByUri(uri: Uri) {
        return this.innerArray.find(
            (c) => {
                return c.server && c.server.uri && c.server.uri.toString() === uri.toString();
            }
        );
    }
}

