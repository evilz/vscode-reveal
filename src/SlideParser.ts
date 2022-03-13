import { Configuration} from './Configuration';
import { ISlide } from './ISlide';
import frontmatter, { FrontMatterResult } from 'front-matter'
//import {separator, verticalSeparator} from './utils'
import { Disposable } from './dispose';
import { EventEmitter } from 'vscode';

const trimFirstLastEmptyLine = (s) => {
  let content = s
  content = content.indexOf("\n") === 0 ? content.substr(1) : content
  content = content.indexOf("\r\n") === 0 ? content.substr(2) : content

  content = content.lastIndexOf("\n") === content.length - 1 ? content.substr(0, content.length - 1) : content
  content = content.lastIndexOf("\r\n") === content.length - 2 ? content.substr(0, content.length - 2) : content
  return content
}



const findSlideAttributes = (text: string) => {
  const regex = /<!--[ ]*.slide:(.*)[ ]*-->/gm
  const m = regex.exec(text)
  return m === null
    ? ''
    : m[1].trim()
}

const findTitle = (text: string) => {
  // Rem : ugly but not so bad ?
  const lines = text
    .replace(/^[ ]*/gm, '') // trim space
    .replace(/<!-- .slide:.* -->/gm, '') // remove slide property
    .replace(/^#+/gm, '') // remove title markup
    .replace(/\r\n/g, '\n') // nomalize line return
    .replace(/^\s*\n/gm, '') // remove whitespace lines
    .split('\n')
  return lines[0].trim()
}

export class SlideParser extends Disposable{

  constructor() {
    super()
  }

  
  readonly #onDidParse = this._register(new EventEmitter<{frontmatter:FrontMatterResult<Configuration>, slides:ISlide[]}>());
	/**
	 * Fired when the server got an error.
	 */
	public readonly onDidParse = this.#onDidParse.event;

  public parse(text: string, configuration:Configuration, partial = true) {
    const result = frontmatter<Configuration>(text)
    const slides = this.#parseSlides(result.body,configuration.separator, configuration.verticalSeparator)
    if(partial) { this.#onDidParse.fire({frontmatter:result, slides}) } // dont emit if called for partial document
    return {frontmatter:result, slides}
  }

  
  #parseSlide = (slideContent: string, index: number, verticalSeparator:string): ISlide => {
  const verticalSlides = this.#getVerticalSlides(slideContent, verticalSeparator)
  const currentSlide = verticalSlides[0]
  return {
    ...currentSlide,
    index,
    verticalChildren: verticalSlides.length > 1 ? verticalSlides.slice(1) : []
  }
}


  #parseSlides = (slideContent: string, separator: string, verticalSeparator:string): ISlide[] => {
  const regex = new RegExp(separator, 'gm')
  const slides = slideContent.split(regex)
  return slides.map((s, i) => {

    return this.#parseSlide(trimFirstLastEmptyLine(s), i, verticalSeparator)

  })
}


  #getVerticalSlides = (slideContent: string, verticalSeparator:string): ISlide[] => {
  const regex = new RegExp(verticalSeparator, 'gm')
  const slides = slideContent.split(regex)

  return slides.map((s, i) => {
    const content = trimFirstLastEmptyLine(s)
    return {
      title: findTitle(content),
      index: i,
      text: content,
      verticalChildren: [],
      attributes: findSlideAttributes(content)

    }
  })
}
  





}

//Singleton
export default new SlideParser()

