"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportHTML = void 0;
const jetpack = require("fs-jetpack");
const path = require("path");
exports.exportHTML = async (options) => {
    const { folderPath, url, data, srcFilePath } = options;
    const file = url.endsWith('/') ? `${url}index.html` : url;
    const filePath = path.join(folderPath ? folderPath : ".", file);
    if (data) {
        try {
            await jetpack.writeAsync(filePath, data);
            return;
        }
        catch (error) {
            console.error(error);
        }
    }
    if (srcFilePath) {
        try {
            await jetpack.copyAsync(srcFilePath, filePath, { overwrite: true });
            return;
        }
        catch (error) {
            console.error(error);
        }
    }
};
//# sourceMappingURL=ExportHTML.js.map