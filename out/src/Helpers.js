"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
var front = require('yaml-front-matter');
/** Helper functions collection to count slides */
class Helpers {
    constructor(config) {
        this.config = config;
    }
    /**
     * Return the number of slides in content depending of Configuration settings (slidifyOptions.separator)
     * It should ignore front matter header
     * @param {string} content
     * @returns {number}
     *
     * @memberOf Helpers
     */
    getSlideCount(text) {
        return this.getCount(text, this.config.slidifyOptions.separator) + 1;
    }
    /**
     * Return number of children slides from a slide content
     *
     * @param {string} Slide content
     * @returns {number}
     *
     * @memberOf Helpers
     */
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
    /**
     * Return current edited slide depending of position in vs code editor
     *
     * @param {TextEditor} editor
     * @returns
     *
     * @memberOf Helpers
     */
    getSlidePosition(editor) {
        let start = new vscode.Position(0, 0);
        let end = editor.selection.active;
        let range = new vscode.Range(start, end);
        let text = editor.document.getText(range);
        var frontConfig = front.loadFront(text);
        let content = frontConfig.__content;
        let position = this.getSlideCount(content) - 1;
        let regex = new RegExp(this.config.slidifyOptions.separator, "gm");
        let slides = text.split(regex);
        let currentSlide = slides[slides.length - 1];
        let innerSlide = this.getInnerSlideCount(currentSlide);
        return `#/${position}/${innerSlide}`;
    }
}
exports.Helpers = Helpers;
//# sourceMappingURL=Helpers.js.map