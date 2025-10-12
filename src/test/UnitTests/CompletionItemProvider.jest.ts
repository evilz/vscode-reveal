/* eslint-disable jest/no-export */
/* eslint-disable @typescript-eslint/no-namespace */
import { CancellationToken, CompletionContext, CompletionItem, EndOfLine, MarkdownString, Position, Range, TextDocument, TextLine, Uri } from "vscode";
import { createCompletionItems } from "../../CompletionItemProvider"
import { ConfigurationDescription } from '../../Configuration'

test('Should createCompletionItems from configDesc', () => {

    const configDesc: ConfigurationDescription = {
        label: "test_label",
        detail: "test_detail",
        documentation: "test_documentation",
        type: "string",
        values: ["test_values"]
    }

    const { completionItems, enumValueProviders } = createCompletionItems([configDesc])


    expect(completionItems).toHaveLength(1)
    expect(completionItems[0].label).toBe("test_label")
    expect(completionItems[0].detail).toBe("test_detail")
    expect(completionItems[0].documentation).toStrictEqual(new MarkdownString("test_documentation"))

    expect(enumValueProviders).toHaveLength(1)
    expect(enumValueProviders[0].provideCompletionItems).toBeDefined()

    const line: TextLine = {
        lineNumber: 0,
        text: "test_label: ",
        range: new Range(new Position(0, 0), new Position(0, 0)),
        rangeIncludingLineBreak: new Range(new Position(0, 0), new Position(0, 0)),
        firstNonWhitespaceCharacterIndex: 0,
        isEmptyOrWhitespace: false
    }

    const document: TextDocument = {
        lineAt: jest.fn(() => { return line }),
        uri: Uri.parse("file:///test.txt"),
        fileName: "",
        isUntitled: false,
        languageId: "",
        version: 0,
        isDirty: false,
        isClosed: false,
        save: jest.fn(),
        eol: EndOfLine.LF,
        lineCount: 0,
        offsetAt: jest.fn(),
        positionAt: jest.fn(),
        getText: jest.fn(),
        getWordRangeAtPosition: jest.fn(),
        validateRange: jest.fn(),
        validatePosition: jest.fn(),
        encoding: "utf-8",
    }
    const token: CancellationToken = {
        isCancellationRequested: false,
        onCancellationRequested: jest.fn()
    }
    const context: CompletionContext = {
        triggerKind: 0,
        triggerCharacter: undefined
    }

    const completion = enumValueProviders[0].provideCompletionItems(document, new Position(0, "test_label: ".length), token, context)
    expect(completion).toStrictEqual([new CompletionItem("test_values")])
});

test('Should handle number type without enum provider', () => {
    const configDesc: ConfigurationDescription = {
        label: 'num_option',
        detail: 'numeric detail',
        documentation: 'doc',
        type: 'number'
    }

    const { completionItems, enumValueProviders } = createCompletionItems([configDesc])

    expect(completionItems).toHaveLength(1)
    expect(enumValueProviders).toHaveLength(0)
})


