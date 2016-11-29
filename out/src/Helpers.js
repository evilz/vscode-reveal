"use strict";
const vscode = require('vscode');
class Helpers {
    constructor(config) {
        this.config = config;
    }
    getSlideCount(text) {
        return this.getCount(text, this.config.slidifyOptions.separator) + 1;
    }
    getInnerSlideCount(text) {
        return this.getCount(text, this.config.slidifyOptions.verticalSeparator);
    }
    getCount(text, separator) {
        let count = 0;
        let regex = new RegExp(separator, "gm");
        let matches = text.match(regex);
        if (matches) {
            count = matches.length;
        }
        return count;
    }
    getSlidePosition(editor) {
        let start = new vscode.Position(0, 0);
        let end = editor.selection.active;
        let range = new vscode.Range(start, end);
        let text = editor.document.getText(range);
        let position = this.getSlideCount(text) - 1;
        let regex = new RegExp(this.config.slidifyOptions.separator, "gm");
        let slides = text.split(regex);
        let currentSlide = slides[slides.length - 1];
        let innerSlide = this.getInnerSlideCount(currentSlide);
        return `#/${position}/${innerSlide}`;
    }
}
exports.Helpers = Helpers;
//# sourceMappingURL=Helpers.js.map