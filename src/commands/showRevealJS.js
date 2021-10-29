"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showRevealJS = exports.SHOW_REVEALJS = void 0;
const vscode = require("vscode");
exports.SHOW_REVEALJS = 'vscode-revealjs.showRevealJS';
exports.showRevealJS = (refreshCb) => () => {
    const panel = vscode.window.createWebviewPanel('RevealJS', 'Reveal JS presentation', vscode.ViewColumn.Beside, { enableScripts: true });
    refreshCb(panel.webview);
};
//# sourceMappingURL=showRevealJS.js.map