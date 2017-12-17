import * as matter from 'gray-matter'
import { Position, Range, TextEditor } from 'vscode'
import { getExtensionOptions, getRevealJsOptions, getSlidifyOptions } from './Configuration'
import { ExtensionOptions, IRevealJsOptions, ISlide, ISlidifyOptions } from './Models'
import { RevealServer } from './Server'
import { parseSlides } from './SlideParser'
import { renderRevealHtml } from './Template'

// TODO  : need to subscribe to change !!

export class VSodeRevealContext {
  // tslint:disable-next-line:variable-name
  private _server: RevealServer
  // tslint:disable-next-line:variable-name
  private _slides: ISlide[]

  constructor(public editor: TextEditor) {
    this._server = new RevealServer(() => this.renderHtml(), editor.document.fileName)
    this._slides = parseSlides(this.slideContent, this.slidifyOptions)
  }

  get title(): string {
    // TODO : add frontConf title property
    return `RevealJS : ${this.editor.document.fileName}`
  }

  public getDocumentText(range?: Range): string {
    return this.editor.document.getText(range)
  }

  get slideContent(): string {
    return matter(this.getDocumentText()).content
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

  get slidePosition() {
    const start = new Position(0, 0)
    const end = this.editor.selection.active
    const range = new Range(start, end)

    const content = matter(this.getDocumentText(range)).content

    const toPositionSlides = parseSlides(content, this.slidifyOptions)

    const currentSlide = toPositionSlides[toPositionSlides.length - 1]

    if (currentSlide.verticalChildren) {
      return [toPositionSlides.length, currentSlide.verticalChildren.length]
    }

    return [toPositionSlides.length, 0]
  }

  get uri(): string {
    const serverUri = this.server.uri
    const slidepos = this.slidePosition
    const finalUri = `${serverUri}#/${slidepos[0]}/${slidepos[1]}/${Date.now()}`
    console.log('refresh tab on :' + finalUri)
    return finalUri
  }
}
