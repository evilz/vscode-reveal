"use strict";
const vscode_1 = require('vscode');
const models_1 = require('./models');
class StatusBarController {
    constructor(slidifyOptions) {
        this._slidifyOptions = slidifyOptions;
    }
    updateAddress(context) {
        if (!this._addressItem) {
            this._addressItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 100);
        }
        if (context.server.state === models_1.RevealServerState.Started) {
            this._addressItem.text = `$(server) ${context.server.uri}`;
            this._addressItem.show();
        }
        else {
            this._addressItem.hide();
        }
    }
    updateStop(context) {
        if (!this._stopItem) {
            this._stopItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 101);
        }
        this._stopItem.text = `$(primitive-square)`;
        this._stopItem.color = 'red';
        this._stopItem.command = "vscode-revealjs.KillRevealJSServer";
        if (context.server.state === models_1.RevealServerState.Started) {
            this._stopItem.show();
        }
        else {
            this._stopItem.hide();
        }
    }
    updateCount(context) {
        if (!this._countItem) {
            this._countItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 102);
        }
        if (!context.editor || context.editor.document.languageId != 'markdown') {
            this._countItem.hide();
            return;
        }
        let slidecount = this.getSlideCount(context.editor.document);
        if (slidecount < 2) {
            this._countItem.hide();
        }
        else {
            this._countItem.text = `$(note) ${slidecount} Slides`;
            this._countItem.show();
        }
    }
    update(context) {
        this.updateAddress(context);
        this.updateCount(context);
        this.updateStop(context);
    }
    getSlideCount(doc) {
        let count = 0;
        let docContent = doc.getText();
        let regex = new RegExp(this._slidifyOptions.separator, "gm");
        let matches = docContent.match(regex);
        if (matches) {
            count = matches.length + 1;
        }
        return count;
    }
    dispose() {
        this._countItem.dispose();
    }
}
exports.StatusBarController = StatusBarController;
//# sourceMappingURL=StatusBarController.js.map