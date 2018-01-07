import * as matter from 'gray-matter'
import { Position, Range, TextEditor } from 'vscode'
import { getExtensionOptions, getRevealJsOptions, getSlidifyOptions } from './Configuration'
import { ExtensionOptions, IRevealJsOptions, ISlide, ISlidifyOptions, RevealServerState } from './Models'
import { RevealServer } from './Server'
import { countLines, parseSlides } from './SlideParser'
import { renderRevealHtml } from './Template'

export class VSCodeRevealContext {
  private _server: RevealServer
  private _slides: ISlide[]

  constructor(public editor: TextEditor) {
    this._server = new RevealServer(() => this.renderHtml(), editor.document.fileName)
    this.refresh()
  }

  get title(): string {
    // TODO : add frontConf title property
    return `RevealJS : ${this.editor.document.fileName}`
  }

  public refresh() {
    this._slides = parseSlides(this.slideContent, this.slidifyOptions)
  }

  public getDocumentText(range?: Range): string {
    return this.editor.document.getText(range)
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

  get slidifyOptions(): ISlidifyOptions {
    return this.extensionOptions as ISlidifyOptions
  }

  get revealJsOptions(): IRevealJsOptions {
    return this.extensionOptions as IRevealJsOptions
  }

  get extensionOptions(): ExtensionOptions {
    const extensionOptions = getExtensionOptions()
    const front = this.frontMatter
    return { ...extensionOptions, ...front }
  }

  get slideCount(): number {
    return this._slides.length
  }

  get server(): RevealServer {
    return this._server
  }

  private renderHtml = () => {
    return renderRevealHtml(this.title, this.extensionOptions, this.slideContent)
  }

  get slides() {
    return this._slides
  }

  get slidePosition() {
    const start = new Position(0, 0)
    const end = this.editor.selection.active
    const range = new Range(start, end)

    const content = matter(this.getDocumentText(range)).content

    const toPositionSlides = parseSlides(content, this.slidifyOptions)

    const currentSlide = toPositionSlides[toPositionSlides.length - 1]

    if (currentSlide.verticalChildren) {
      return [toPositionSlides.length - 1, currentSlide.verticalChildren.length]
    }

    return [toPositionSlides.length - 1, 0]
  }

  get uri(): string {
    // TODO : refqcto in explicit method
    if (this.server.state === RevealServerState.Stopped) {
      this.server.start()
    }

    const serverUri = this.server.uri
    const slidepos = this.slidePosition
    const finalUri = `${serverUri}#/${slidepos[0]}/${slidepos[1]}/${Date.now()}`
    return finalUri
  }
}
