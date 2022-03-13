/* eslint-disable @typescript-eslint/no-namespace */
//import * as jest from "jest"

// const languages = {
//   createDiagnosticCollection: jest.fn(),
//   registerCompletionItemProvider: jest.fn()
// };

// export class Disposable {
//   //static from(...disposableLikes: { dispose: () => any }[]): Disposable;
//   //constructor(callOnDispose: () => any);
//   dispose() { return {} };
// }
// export interface Event<T> {

//   (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
// }

// export interface TextDocument { }
// export interface Position { }
// export interface Range { }
// export interface CompletionItemProvider { }
// export interface CompletionItem { }
// export interface CancellationToken { }
// export interface CompletionContext { }
// export interface ProviderResult<T> { }
// export interface CompletionList<T> { }


// export interface CompletionItemProvider<T extends CompletionItem = CompletionItem> {
//   provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<T[] | CompletionList<T>>;
//   resolveCompletionItem?(item: T, token: CancellationToken): ProviderResult<T>;
// }

// export type DocumentSelector = DocumentFilter | string | ReadonlyArray<DocumentFilter | string>;
// export interface DocumentFilter { readonly language?: string; readonly scheme?: string; readonly pattern?: GlobPattern; }
// export type GlobPattern = string //| RelativePattern;

// export class EventEmitter<T> {

//   #listener: (e: T) => any = (x: T) => null

//   public get event() {
//     return (listener: (ee: T) => any, thisArgs?: any, disposables?: Disposable[]) => {
//       this.#listener = listener
//     };
//   }
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   fire(data: T) { this.#listener(data) };
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   dispose() { };
// }

// export interface CompletionItemLabel {
//   label: string;
//   detail?: string; description?: string;
// }
// export enum CompletionItemKind {
//   Text = 0,
//   Method = 1,
//   Function = 2,
//   Constructor = 3,
//   Field = 4,
//   Variable = 5,
//   Class = 6,
//   Interface = 7,
//   Module = 8,
//   Property = 9,
//   Unit = 10,
//   Value = 11,
//   Enum = 12,
//   Keyword = 13,
//   Snippet = 14,
//   Color = 15,
//   Reference = 17,
//   File = 16,
//   Folder = 18,
//   EnumMember = 19,
//   Constant = 20,
//   Struct = 21,
//   Event = 22,
//   Operator = 23,
//   TypeParameter = 24,
//   User = 25,
//   Issue = 26,
// }

// export class MarkdownString {
//   isTrusted?: boolean; supportThemeIcons?: boolean; supportHtml?: boolean;
//   constructor(value?: string, supportThemeIcons?: boolean) { }
//   appendText(value: string) { return this; }
//   appendMarkdown(value: string) { return this; };
//   appendCodeblock(value: string, language?: string) { return this; }
// }

// export class CompletionItem {
//   //tags?: readonly CompletionItemTag[];
//   detail?: string;
//   documentation?: string | MarkdownString;
//   sortText?: string;
//   filterText?: string;
//   preselect?: boolean;
//   //insertText?: string | SnippetString;
//   //range?: Range | { inserting: Range; replacing: Range };
//   commitCharacters?: string[];
//   keepWhitespace?: boolean;
//   //textEdit?: TextEdit;
//   //additionalTextEdits?: TextEdit[];
//   //command?: Command;
//   constructor(public label: string | CompletionItemLabel, public kind?: CompletionItemKind) {
//   }
// }


// const vscode = {
//   languages,
//   EventEmitter,

// };

// export default vscode;

export enum CompletionItemKind {
  Text = 0,
  Method = 1,
  Function = 2,
  Constructor = 3,
  Field = 4,
  Variable = 5,
  Class = 6,
  Interface = 7,
  Module = 8,
  Property = 9,
  Unit = 10,
  Value = 11,
  Enum = 12,
  Keyword = 13,
  Snippet = 14,
  Color = 15,
  Reference = 17,
  File = 16,
  Folder = 18,
  EnumMember = 19,
  Constant = 20,
  Struct = 21,
  Event = 22,
  Operator = 23,
  TypeParameter = 24,
  User = 25,
  Issue = 26,
}

export class CompletionItem {
  //tags?: readonly CompletionItemTag[];
  detail?: string;
  documentation?: string //| MarkdownString;
  sortText?: string;
  filterText?: string;
  preselect?: boolean;
  //insertText?: string | SnippetString;
  //range?: Range | { inserting: Range; replacing: Range };
  commitCharacters?: string[];
  keepWhitespace?: boolean;
  //textEdit?: TextEdit;
  //additionalTextEdits?: TextEdit[];
  //command?: Command;
  constructor(public label: string) {
  }
}

export class MarkdownString {
  isTrusted?: boolean; supportThemeIcons?: boolean; supportHtml?: boolean;
  constructor(value?: string, supportThemeIcons?: boolean) { }
  appendText(value: string) { return this; }
  appendMarkdown(value: string) { return this; };
  appendCodeblock(value: string, language?: string) { return this; }
}


export type DocumentSelector = string;
export type CompletionItemProvider = any
export class Disposable {
  //static from(...disposableLikes: { dispose: () => any }[]): Disposable;
  //constructor(callOnDispose: () => any);
  dispose() { return {} };
}


export namespace languages {
  export function registerCompletionItemProvider(selector: DocumentSelector, provider: CompletionItemProvider, ...triggerCharacters: string[]): Disposable {
    return new Disposable();
  }
}

export class Position {
  constructor(public readonly line: number, public readonly character: number) { }
}

export class Uri {
  static parse(value: string, strict?: boolean): Uri {
    return new Uri("file", "", "", "", "");
  }

  private constructor(scheme: string, authority: string, path: string, query: string, fragment: string) { }

}

export enum EndOfLine { LF = 1, CRLF = 2 }

export interface TextLine {
  readonly lineNumber: number;
  readonly text: string;
  readonly range: Range;
  readonly rangeIncludingLineBreak: Range;
  readonly firstNonWhitespaceCharacterIndex: number;
  readonly isEmptyOrWhitespace: boolean;
}

export class Range {
  constructor(public start: Position, public end: Position) { }
}