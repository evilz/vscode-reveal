"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showRevealJSInBrowser = exports.SHOW_REVEALJS_IN_BROWSER = void 0;
const open = require("open");
exports.SHOW_REVEALJS_IN_BROWSER = 'vscode-revealjs.showRevealJSInBrowser';
exports.showRevealJSInBrowser = (getUri) => () => {
    const uri = getUri();
    if (uri === null) {
        return;
    }
    return open(uri);
};
//# sourceMappingURL=showRevealJSInBrowser.js.map