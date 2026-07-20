import { CancellationToken, CompletionContext, CompletionItem, EndOfLine, MarkdownString, Position, Range, TextDocument, TextLine, Uri } from "vscode";
import completionProviderFactory, { createCompletionItems, createCompletionItemsProvider, enumValueProvider } from "../../CompletionItemProvider"
import { ConfigurationDescription } from '../../Configuration'
import * as vscode from 'vscode'

test('Should createCompletionItems from configDesc', () => {

    const configDesc: ConfigurationDescription = {
        label: "test_label",
        detail: "test_detail",
        documentation: "test_documentation",
        type: "string",
        values: ["test_values"],
        defaultValue: "test_default"
    }

    const { completionItems, enumValueProviders } = createCompletionItems([configDesc])


    expect(completionItems).toHaveLength(1)
    expect(completionItems[0].label).toBe("test_label")
    expect(completionItems[0].detail).toBe("test_detail • default: \"test_default\" • enum: test_values")
    expect(completionItems[0].documentation).toStrictEqual(new MarkdownString("test_documentation\n\nDefault: `\"test_default\"`\n\nAllowed values: `test_values`"))

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

test('Should handle boolean/string union type with only boolean enum provider', () => {
    const configDesc: ConfigurationDescription = {
        label: 'slideNumber',
        detail: 'slide number detail',
        documentation: 'doc',
        type: ['boolean', 'string']
    }

    const { completionItems, enumValueProviders } = createCompletionItems([configDesc])

    expect(completionItems).toHaveLength(1)
    // boolean provider for true/false, no string enum provider (no values defined)
    expect(enumValueProviders).toHaveLength(1)

    const document = {
        lineAt: jest.fn(() => ({ text: 'slideNumber: ' })),
    } as unknown as TextDocument
    const token: CancellationToken = { isCancellationRequested: false, onCancellationRequested: jest.fn() }
    const context: CompletionContext = { triggerKind: 0, triggerCharacter: undefined }
    const boolItems = enumValueProviders[0].provideCompletionItems(document, new Position(0, 'slideNumber: '.length), token, context)
    expect(boolItems).toStrictEqual([new CompletionItem('true'), new CompletionItem('false')])
})

test('Should handle boolean/string union type with both enum providers when values defined', () => {
    const configDesc: ConfigurationDescription = {
        label: 'unionOption',
        detail: '',
        documentation: '',
        type: ['boolean', 'string'],
        values: ['h/v', 'c/t']
    }

    const { enumValueProviders } = createCompletionItems([configDesc])

    // boolean provider + string enum provider
    expect(enumValueProviders).toHaveLength(2)

    const document = {
        lineAt: jest.fn(() => ({ text: 'unionOption: ' })),
    } as unknown as TextDocument
    const position = new Position(0, 'unionOption: '.length)
    const token: CancellationToken = { isCancellationRequested: false, onCancellationRequested: jest.fn() }
    const ctx: CompletionContext = { triggerKind: 0, triggerCharacter: undefined }
    const boolItems = enumValueProviders[0].provideCompletionItems(document, position, token, ctx)
    const strItems = enumValueProviders[1].provideCompletionItems(document, position, token, ctx)
    expect(boolItems).toStrictEqual([new CompletionItem('true'), new CompletionItem('false')])
    expect(strItems).toStrictEqual([new CompletionItem('h/v'), new CompletionItem('c/t')])
})

test('Should stringify complex default values in completion metadata', () => {
    const configDesc: ConfigurationDescription = {
        label: 'obj_option',
        detail: 'object detail',
        documentation: 'doc',
        type: 'object',
        defaultValue: { enabled: true, tags: ['a', 'b'] }
    }

    const { completionItems } = createCompletionItems([configDesc])

    expect(completionItems[0].detail).toBe('object detail • default: {"enabled":true,"tags":["a","b"]}')
    expect(completionItems[0].documentation).toStrictEqual(new MarkdownString('doc\n\nDefault: `{"enabled":true,"tags":["a","b"]}`'))
})

test('enumValueProvider returns undefined when line prefix does not match', () => {
    const provider = enumValueProvider('theme', ['black', 'white'])
    const document = {
        lineAt: jest.fn(() => ({ text: 'title: demo' })),
    } as unknown as TextDocument

    const result = provider.provideCompletionItems(document, new Position(0, 'title: demo'.length))
    expect(result).toBeUndefined()
})

test('createCompletionItemsProvider filters completion items by typed prefix and honors cancellation token', () => {
    const provider = createCompletionItemsProvider([new CompletionItem('theme'), new CompletionItem('title')])
    const document = {
        lineAt: jest.fn(() => ({ text: 'ti' })),
    } as unknown as TextDocument

    const activeToken = { isCancellationRequested: false } as CancellationToken
    const cancelledToken = { isCancellationRequested: true } as CancellationToken

    expect(provider.provideCompletionItems(document, new Position(0, 2), activeToken)).toEqual([new CompletionItem('title')])
    expect(provider.provideCompletionItems(document, new Position(0, 2), cancelledToken)).toEqual([])
})

test('default completion provider registers enum providers and main provider', () => {
    const registerSpy = jest.spyOn(vscode.languages, 'registerCompletionItemProvider')
    const disposeSpy = jest.fn()
    registerSpy.mockReturnValue({ dispose: disposeSpy } as vscode.Disposable)

    const config: ConfigurationDescription[] = [
        { label: 'theme', detail: '', documentation: '', type: 'string', values: ['black'] },
        { label: 'showNotes', detail: '', documentation: '', type: 'boolean' },
    ]

    const disposables = completionProviderFactory(config)
    expect(disposables).toHaveLength(3)
    expect(registerSpy).toHaveBeenCalledTimes(3)
    expect(registerSpy).toHaveBeenNthCalledWith(1, 'markdown', expect.objectContaining({ provideCompletionItems: expect.any(Function) }))
    expect(registerSpy).toHaveBeenNthCalledWith(2, 'markdown', expect.objectContaining({ provideCompletionItems: expect.any(Function) }))
    expect(registerSpy).toHaveBeenNthCalledWith(3, 'markdown', expect.objectContaining({ provideCompletionItems: expect.any(Function) }))

    registerSpy.mockRestore()
})
