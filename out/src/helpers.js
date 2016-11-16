"use strict";
// User-Defined Type Guards
function isTextDocument(object) {
    return 'languageId' in object;
}
function isMarkdown(item) {
    if (isTextDocument(item)) {
        return item.languageId === "markdown";
    }
    else {
        isMarkdown(item.document);
    }
}
exports.isMarkdown = isMarkdown;
//# sourceMappingURL=helpers.js.map