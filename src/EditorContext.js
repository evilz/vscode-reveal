"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorContext = void 0;
const matter = require("gray-matter");
const path = require("path");
const vscode_1 = require("vscode");
const SlideParser_1 = require("./SlideParser");
class EditorContext {
    // re-instance when change
    constructor(editor, rawDocumentOptions) {
        this.editor = editor;
        this.rawDocumentOptions = rawDocumentOptions;
        this._slides = [];
        this._position = { horizontal: 0, vertical: 0 };
        this.refresh();
    }
    refresh() {
        this._slides = SlideParser_1.parseSlides(this.slideContent, this.documentOptions);
    }
    updatePosition(cursorPosition) {
        const start = new vscode_1.Position(0, 0);
        const range = new vscode_1.Range(start, cursorPosition);
        const content = matter(this.getDocumentText(range)).content;
        const toPositionSlides = SlideParser_1.parseSlides(content, this.documentOptions);
        const currentSlide = toPositionSlides[toPositionSlides.length - 1];
        this._position = currentSlide.verticalChildren
            ? { horizontal: toPositionSlides.length - 1, vertical: currentSlide.verticalChildren.length }
            : { horizontal: toPositionSlides.length - 1, vertical: 0 };
    }
    getDocumentText(range) {
        return this.editor.document.getText(range);
    }
    get filename() {
        return this.editor.document.fileName;
    }
    get dirname() {
        return path.dirname(this.filename);
    }
    get title() {
        // TODO : add frontConf title property
        return `RevealJS : ${this.editor.document.fileName}`;
    }
    get slideContent() {
        return matter(this.getDocumentText()).content;
    }
    get frontMatterLineCount() {
        return SlideParser_1.countLines(this.getDocumentText()) - SlideParser_1.countLines(this.slideContent);
    }
    get hasfrontConfig() {
        return matter.test(this.getDocumentText()); // bad d.ts file
    }
    get frontMatter() {
        return matter(this.getDocumentText()).data;
    }
    get documentOptions() {
        const front = this.frontMatter;
        // tslint:disable-next-line:no-object-literal-type-assertion
        return { ...this.rawDocumentOptions, ...front };
    }
    get slideCount() {
        return this._slides.length;
    }
    get slides() {
        return this._slides;
    }
    get position() {
        return this._position;
    }
    get isMarkdownFile() {
        return this.editor.document.languageId === 'markdown';
    }
    goToSlide(topindex, verticalIndex) {
        const linesCount = SlideParser_1.countLinesToSlide(this.slides, topindex, verticalIndex, this.documentOptions) + this.frontMatterLineCount;
        const position = new vscode_1.Position(linesCount, 0);
        this.editor.selections = [new vscode_1.Selection(position, position)];
        this.editor.revealRange(new vscode_1.Range(position, position.translate(20)));
    }
}
exports.EditorContext = EditorContext;
//# sourceMappingURL=EditorContext.js.map