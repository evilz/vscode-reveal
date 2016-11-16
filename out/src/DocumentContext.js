"use strict";
const server_1 = require('./server');
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
            server: new server_1.RevealServer(editor, this._configuation),
        };
        this._map.set(editor, context);
        return context;
    }
    ;
}
exports.DocumentContexts = DocumentContexts;
//# sourceMappingURL=DocumentContext.js.map