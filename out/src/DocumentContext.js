"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("./Server");
class DocumentContexts {
    constructor(configuration) {
        this.innerArray = new Array();
        this.configuation = configuration;
    }
    GetDocumentContext(editor) {
        return this.innerArray.find((c) => c.editor === editor);
    }
    ;
    createContext(editor) {
        let context = {
            editor: editor,
            server: new Server_1.RevealServer(editor, this.configuation),
        };
        this.innerArray.push(context);
        return context;
    }
    GetDocumentContextByUri(uri) {
        return this.innerArray.find((c) => {
            return c.server && c.server.uri && c.server.uri.toString() === uri.toString();
        });
    }
}
exports.DocumentContexts = DocumentContexts;
//# sourceMappingURL=DocumentContext.js.map