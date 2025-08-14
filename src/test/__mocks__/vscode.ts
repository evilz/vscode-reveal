/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-namespace */

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
  appendMarkdown(value: string) { return this; }
  appendCodeblock(value: string, language?: string) { return this; }
}


export type DocumentSelector = string;
export type CompletionItemProvider = any
export class Disposable {
  //static from(...disposableLikes: { dispose: () => any }[]): Disposable;
  //constructor(callOnDispose: () => any);
  dispose() { return {} }
}


export namespace languages {
  export function registerCompletionItemProvider(selector: DocumentSelector, provider: CompletionItemProvider, ...triggerCharacters: string[]): Disposable {
    return new Disposable()
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

export interface Event<T> {

  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export class EventEmitter<T> {

  #listener: (e: T) => any = (x: T) => null

  public get event() {
    return (listener: (ee: T) => any, thisArgs?: any, disposables?: Disposable[]) => {
      this.#listener = listener
    };
  }
  fire(data: T) { this.#listener(data) }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose() { }
}

export interface TreeItemLabel { label: string; highlights?: [number, number][]; }
export class ThemeColor { constructor(public id: string) { } }
export class ThemeIcon {
  static readonly File: ThemeIcon;
  static readonly Folder: ThemeIcon;
  constructor(public readonly id: string, public readonly color?: ThemeColor) { }
}

export interface Command { title: string; command: string; tooltip?: string; arguments?: any[]; }
export enum TreeItemCollapsibleState { None = 0, Collapsed = 1, Expanded = 2 }

export class TreeItem {
  id?: string;
  iconPath?: string | Uri | { light: string | Uri; dark: string | Uri } | ThemeIcon;
  description?: string | boolean;
  resourceUri?: Uri;
  tooltip?: string | MarkdownString | undefined;
  command?: Command;
  collapsibleState?: TreeItemCollapsibleState;
  contextValue?: string;
  //accessibilityInformation?: AccessibilityInformation;
  constructor(public label: string | TreeItemLabel, collapsibleState?: TreeItemCollapsibleState) { }
  //constructor(resourceUri: Uri, collapsibleState?: TreeItemCollapsibleState) { }
}


export interface TextEditorDecorationType { readonly key: string; dispose(): void; }
export interface DecorationRenderOptions extends ThemableDecorationRenderOptions {
  isWholeLine?: boolean; rangeBehavior?: DecorationRangeBehavior; overviewRulerLane?: OverviewRulerLane;
  light?: ThemableDecorationRenderOptions; dark?: ThemableDecorationRenderOptions;
}

export namespace window {

  export const createStatusBarItem = jest.fn((alignment?: StatusBarAlignment, priority?: number): StatusBarItem => {
    return { hide: jest.fn(), dispose: jest.fn() } as unknown as StatusBarItem;
  });

  export function createTextEditorDecorationType(options: DecorationRenderOptions): TextEditorDecorationType {
    return {} as TextEditorDecorationType;
  }

  export function registerTreeDataProvider<T>(viewId: string, treeDataProvider: TreeDataProvider<T>): Disposable {
    return new Disposable();
  };
}

export interface ThemableDecorationRenderOptions {
  backgroundColor?: string | ThemeColor;
  outline?: string;
  outlineColor?: string | ThemeColor;
  outlineStyle?: string;
  outlineWidth?: string;
  border?: string;
  borderColor?: string | ThemeColor;
  borderRadius?: string;
  borderSpacing?: string;
  borderStyle?: string;
  borderWidth?: string;
  fontStyle?: string;
  fontWeight?: string;
  textDecoration?: string;
  cursor?: string;
  color?: string | ThemeColor;
  opacity?: string;
  letterSpacing?: string;
  gutterIconPath?: string | Uri;
  gutterIconSize?: string;
  overviewRulerColor?: string | ThemeColor;
  //before?: ThemableDecorationAttachmentRenderOptions;
  //after?: ThemableDecorationAttachmentRenderOptions;
}

export interface DecorationRangeBehavior { }
export interface OverviewRulerLane { }

export enum StatusBarAlignment { Left = 1, Right = 2 }

export interface StatusBarItem {
  readonly id: string;
  readonly alignment: StatusBarAlignment;
  readonly priority: number | undefined;
  name: string | undefined;
  text: string;
  tooltip: string | MarkdownString | undefined;
  color: string | ThemeColor | undefined;
  backgroundColor: ThemeColor | undefined;
  command: string | Command | undefined;
  //accessibilityInformation: AccessibilityInformation | undefined;
  show(): void;
  hide(): void;
  dispose(): void;
}


export interface TreeDataProvider<T> {
  onDidChangeTreeData?: Event<T | undefined | null | void>;
  getTreeItem(element: T): TreeItem | Thenable<TreeItem>;
  getChildren(element?: T): ProviderResult<T[]>;
  getParent?(element: T): ProviderResult<T>; resolveTreeItem?(item: TreeItem, element: T, token: CancellationToken): ProviderResult<TreeItem>;
}

export type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;

export interface CancellationToken { isCancellationRequested: boolean; onCancellationRequested: Event<any>; }

export class Selection extends Range {
  //anchor: Position;
  //active: Position;
  constructor(public anchor: Position, public active: Position) { super(anchor, active) }
  //constructor(anchorLine: number, anchorCharacter: number, activeLine: number, activeCharacter: number) { super() }
  //isReversed: boolean;
}