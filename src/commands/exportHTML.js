"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportHTML = exports.EXPORT_HTML = void 0;
const open = require("open");
const vscode_1 = require("vscode");
exports.EXPORT_HTML = 'vscode-revealjs.exportHTML';
exports.exportHTML = (logger, startExport, doOpenAfterExport) => async () => {
    await vscode_1.window.withProgress({
        location: vscode_1.ProgressLocation.Notification,
        title: 'Export',
    }, async (progress) => {
        logger.log('Start export');
        progress.report({ message: 'in progress' });
        const path = await startExport();
        progress.report({ message: 'Done' });
        await timeout(1500);
        logger.log('End export ' + path);
        if (doOpenAfterExport()) {
            progress.report({ message: 'Opening out folder !' });
            await timeout(1500);
            open(path);
            logger.log('Open folder: ' + path);
        }
    });
};
function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=exportHTML.js.map