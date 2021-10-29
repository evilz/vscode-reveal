"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPDF = exports.EXPORT_PDF = void 0;
const open = require("open");
exports.EXPORT_PDF = 'vscode-revealjs.exportPDF';
exports.exportPDF = (getUri) => () => {
    const uri = getUri();
    if (uri === null) {
        return;
    }
    const url = uri + '?print-pdf-now';
    return open(url);
};
//# sourceMappingURL=exportPDF.js.map