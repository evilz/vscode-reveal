import * as matter from 'gray-matter'
import * as path from 'path'
import { Position, Range, Selection, TextEditor } from 'vscode'
import { IDocumentOptions } from './Configuration'
import { ISlide } from './ISlide'
import { countLines, countLinesToSlide, parseSlides } from './SlideParser'

export interface ISlidePosition {
  horizontal: number
  vertical: number
}

export class EditorContext {
  // re-instance when change
  public constructor(public editor: TextEditor, private readonly rawDocumentOptions: IDocumentOptions) {
    this.refresh()
  }

  private _slides: ISlide[]
  private _position: ISlidePosition = { horizontal: 0, vertical: 0 }

  public refresh() {
    this._slides = parseSlides(this.slideContent, this.documentOptions)
  }

  public updatePosition(cursorPosition: Position) {
    const start = new Position(0, 0)
    const range = new Range(start, cursorPosition)

    const content = matter(this.getDocumentText(range)).content

    const toPositionSlides = parseSlides(content, this.documentOptions)

    const currentSlide = toPositionSlides[toPositionSlides.length - 1]

    this._position = currentSlide.verticalChildren
      ? { horizontal: toPositionSlides.length - 1, vertical: currentSlide.verticalChildren.length }
      : { horizontal: toPositionSlides.length - 1, vertical: 0 }
  }

  public getDocumentText(range?: Range): string {
    return this.editor.document.getText(range)
  }

  public get filename() {
    return this.editor.document.fileName
  }

  public get dirname() {
    return path.dirname(this.filename)
  }

  get title(): string {
    // TODO : add frontConf title property
    return `RevealJS : ${this.editor.document.fileName}`
  }

  get slideContent(): string {
    return matter(this.getDocumentText()).content
  }

  get frontMatterLineCount(): number {
    return countLines(this.getDocumentText()) - countLines(this.slideContent)
  }

  get hasfrontConfig(): boolean {
    return (matter.test(this.getDocumentText()) as any) as boolean // bad d.ts file
  }

  get frontMatter(): any {
    return matter(this.getDocumentText()).data
  }

  get documentOptions(): IDocumentOptions {
    const front = this.frontMatter
    // tslint:disable-next-line:no-object-literal-type-assertion
    return { ...this.rawDocumentOptions, ...front } as IDocumentOptions
  }

  get slideCount(): number {
    return this._slides.length
  }

  get slides() {
    return this._slides
  }

  get position() {
    return this._position
  }

  public get isMarkdownFile() {
    return this.editor.document.languageId === 'markdown'
  }

  public goToSlide(topindex: number, verticalIndex: number) {
    const linesCount = countLinesToSlide(this.slides, topindex, verticalIndex, this.documentOptions) + this.frontMatterLineCount

    const position = new Position(linesCount, 0)
    this.editor.selections = [new Selection(position, position)]
    this.editor.revealRange(new Range(position, position.translate(20)))
  }
}
