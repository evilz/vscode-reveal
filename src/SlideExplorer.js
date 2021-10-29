"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlideTreeProvider = void 0;
const path = require("path");
const vscode = require("vscode");
const goToSlide_1 = require("./commands/goToSlide");
class SlideTreeProvider {
    constructor(getSlide) {
        this.getSlide = getSlide;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    update() {
        this._onDidChangeTreeData.fire(null);
    }
    register() {
        return vscode.window.registerTreeDataProvider('slidesExplorer', this);
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        const slides = this.getSlide();
        return new Promise(resolve => {
            if (element && element.slide.verticalChildren) {
                resolve(this.mapSlides(element.slide.verticalChildren, element.slide.index));
            }
            else {
                resolve(this.mapSlides(slides));
            }
        });
    }
    mapSlides(slides, parentIndex) {
        return slides.map((s, i) => new SlideNode(s, parentIndex !== undefined, `${s.index} : ${s.title}`, s.verticalChildren.length > 0 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None, {
            arguments: [parentIndex === undefined ? { horizontal: s.index, vertical: 0 } : { horizontal: parentIndex, vertical: s.index }],
            command: goToSlide_1.GO_TO_SLIDE,
            title: 'Go to slide'
        }));
    }
}
exports.SlideTreeProvider = SlideTreeProvider;
class SlideNode extends vscode.TreeItem {
    constructor(slide, isVertical, label, collapsibleState, command) {
        super(label, collapsibleState);
        this.slide = slide;
        this.isVertical = isVertical;
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.iconPath = {
            dark: path.join(__filename, '..', '..', 'resources', this.iconName),
            light: path.join(__filename, '..', '..', 'resources', this.iconName)
        };
    }
    get iconName() {
        return this.isVertical ? 'slide-orange.svg' : 'slide-blue.svg';
    }
}
//# sourceMappingURL=SlideExplorer.js.map