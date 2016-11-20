"use strict";
const Server_1 = require('./Server');
// TODO REMOVE ! clean 
class DocumentContexts {
    constructor(configuration) {
        this._map = new Map();
        this._configuation = configuration;
    }
    HasDocumentContext(editor) {
        return this._map.has(editor);
    }
    GetDocumentContext(editor) {
        if (this._map.has(editor)) {
            return this._map.get(editor);
        }
        let context = {
            editor: editor,
            server: new Server_1.RevealServer(editor, this._configuation),
        };
        this._map.set(editor, context);
        return context;
    }
    ;
}
exports.DocumentContexts = DocumentContexts;
//# sourceMappingURL=DocumentContext.js.map