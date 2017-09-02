'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class Configuration {
    get revealJsOptions() {
        return vscode.workspace.getConfiguration('revealjs');
    }
    get slidifyOptions() {
        return vscode.workspace.getConfiguration('revealjs');
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=Configuration.js.map