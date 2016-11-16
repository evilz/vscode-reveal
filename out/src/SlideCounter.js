"use strict";
const vscode_1 = require('vscode');
class SlideCounter {
    constructor(slidifyOptions) {
        this._slidifyOptions = slidifyOptions;
    }
    updateCount(editor) {
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        }
        // Get the current text editor
        if (!editor || editor.document.languageId != 'markdown') {
            this._statusBarItem.hide();
            return;
        }
        let slidecount = this.getSlideCount(editor.document);
        if (slidecount < 2) {
            this._statusBarItem.hide();
        }
        else {
            this._statusBarItem.text = `$(triangle-left) $(triangle-right) ${slidecount} Slides`;
            this._statusBarItem.show();
        }
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
        this._statusBarItem.dispose();
    }
}
exports.SlideCounter = SlideCounter;
//# sourceMappingURL=slideCounter.js.map