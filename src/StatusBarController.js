"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBarController = void 0;
const vscode_1 = require("vscode");
const showRevealJS_1 = require("./commands/showRevealJS");
const showRevealJSInBrowser_1 = require("./commands/showRevealJSInBrowser");
const stopRevealJSServer_1 = require("./commands/stopRevealJSServer");
class StatusBarController {
    constructor(getServerUri, getSlidesCount) {
        this.getServerUri = getServerUri;
        this.getSlidesCount = getSlidesCount;
        this.addressItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 100);
        this.addressItem.command = showRevealJSInBrowser_1.SHOW_REVEALJS_IN_BROWSER;
        this.addressItem.hide();
        this.stopItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 101);
        this.stopItem.hide();
        this.stopItem.text = `$(primitive-square)`;
        this.stopItem.color = 'red';
        this.stopItem.command = stopRevealJSServer_1.STOP_REVEALJS_SERVER;
        this.countItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 102);
        this.countItem.command = showRevealJS_1.SHOW_REVEALJS;
        this.countItem.hide();
        this.update();
    }
    update() {
        const serverUri = this.getServerUri();
        const slideCount = this.getSlidesCount();
        this.updateAddress(serverUri);
        this.updateCount(slideCount);
        this.updateStop(serverUri);
    }
    dispose() {
        this.addressItem.dispose();
        this.countItem.dispose();
        this.stopItem.dispose();
    }
    updateAddress(serverUri) {
        if (serverUri !== null) {
            this.addressItem.text = `$(server) ${serverUri}`;
            this.addressItem.show();
        }
        else {
            this.addressItem.text = '';
            this.addressItem.hide();
        }
    }
    updateStop(serverUri) {
        if (serverUri === null) {
            this.stopItem.hide();
        }
        else {
            this.stopItem.show();
        }
    }
    updateCount(slideCount) {
        if (slideCount < 2) {
            this.countItem.text = '';
            this.countItem.hide();
        }
        else {
            this.countItem.text = `$(note) ${slideCount} Slides`;
            this.countItem.show();
        }
    }
}
exports.StatusBarController = StatusBarController;
//# sourceMappingURL=StatusBarController.js.map