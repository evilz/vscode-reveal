import { TextEditor, TextDocument } from 'vscode';

// User-Defined Type Guards
function isTextDocument(object: TextDocument | TextEditor): object is TextDocument {
    return 'languageId' in object;
}

export function isMarkdown(item: TextDocument | TextEditor) {

    if (isTextDocument(item)) {
        return item.languageId === "markdown";
    }
    else{
        isMarkdown(item.document);
    }
}
