import 'expect-more-jest';
import { Selection, TextDocument, TextEditor, ExtensionContext } from 'vscode';
import { Configuration, defaultConfiguration } from '../../Configuration';
import Logger, { LogLevel } from '../../Logger';
import MainController from '../../MainController'


const logger = new Logger(jest.fn(), LogLevel.Debug)


const extentionContext: ExtensionContext = {
    extensionPath: 'e:\\PROJECTS\\GITHUB\\vscode-reveal',
    extension: { id: 'evilz.vscode-reveal', extensionPath: 'e:\\PROJECTS\\GITHUB\\vscode-reveal' }
} as ExtensionContext

test('CurrentContext should be undefined when no editor is pass', () => {

    const main = new MainController(logger, {} as ExtensionContext, [], {} as Configuration, undefined)
    expect(main.currentContext).toBeUndefined()
});

test('CurrentContext should be undefined when editor is not markdown', () => {

    const editor: TextEditor = {
        document: { languageId: 'text', fileName: "test.txt" } as TextDocument,
        selection: new Selection(0, 0, 0, 0),
        selections: [],
        visibleRanges: [],
        options: {},
        viewColumn: undefined,
        edit: jest.fn(),
        insertSnippet: jest.fn(),
        setDecorations: jest.fn(),
        revealRange: jest.fn(),
        show: jest.fn(),
        hide: jest.fn()
    }

    const main = new MainController(logger, {} as ExtensionContext, [], {} as Configuration, undefined)
    expect(main.currentContext).toBeUndefined()
});

test('CurrentContext should be create when editor is pass and that is markdown', () => {

    const editor: TextEditor = {
        document: { languageId: 'markdown', fileName: "test.md" } as TextDocument,
        selection: new Selection(0, 0, 0, 0),
        selections: [],
        visibleRanges: [],
        options: {},
        viewColumn: undefined,
        edit: jest.fn(),
        insertSnippet: jest.fn(),
        setDecorations: jest.fn(),
        revealRange: jest.fn(),
        show: jest.fn(),
        hide: jest.fn()
    }
    const main = new MainController(logger, extentionContext, [], defaultConfiguration, editor)
    expect(main.currentContext).toBeDefined()
    expect(main.currentContext?.baseUri, "baseUri should be empty cause server is not started").toBeEmptyString()
    expect(main.currentContext?.exportPath).toBe("export") // default
    expect(main.currentContext?.slides).toBeEmptyArray() // default
    expect(main.currentContext?.editor).toBe(editor) // default
    expect(main.currentContext?.isInExport()).toBeFalse() // default
    expect(main.currentContext?.frontmatter?.attributes).toBeUndefined() // default
});

// switch edito