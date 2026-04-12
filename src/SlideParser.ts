import { Configuration } from './Configuration';
import { ISlide } from './ISlide';
import { Disposable } from './dispose';
import frontmatter from 'front-matter'
import { FrontMatterResult } from 'front-matter'

const trimFirstLastEmptyLine = (s: string): string => {
  let content = s
  content = content.indexOf("\n") === 0 ? content.slice(1) : content
  content = content.indexOf("\r\n") === 0 ? content.slice(2) : content

  content = content.lastIndexOf("\n") === content.length - 1 ? content.slice(0, content.length - 1) : content
  content = content.lastIndexOf("\r\n") === content.length - 2 ? content.slice(0, content.length - 2) : content
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

export class SlideParser extends Disposable {

  constructor() {
    super()
  }

  public parse(text: string, configuration: Configuration, partial = true): ParseResult {
    void partial
    try {
      const result = frontmatter<Configuration>(text)
      const slides = this.#parseSlides(result.body, configuration.separator, configuration.verticalSeparator)
      return { frontmatter: result, slides }
    } catch (error) {
      const slides = this.#parseSlides(text, configuration.separator, configuration.verticalSeparator)
      return {
        frontmatter: undefined,
        slides,
        parseError: mapParseError(error)
      }
    }
  }


  #parseSlide = (slideContent: string, index: number, verticalSeparator: string): ISlide => {
    const verticalSlides = this.#getVerticalSlides(slideContent, verticalSeparator)
    const currentSlide = verticalSlides[0]
    return {
      ...currentSlide,
      index,
      verticalChildren: verticalSlides.length > 1 ? verticalSlides.slice(1) : []
    }
  }


  #parseSlides = (slideContent: string, separator: string, verticalSeparator: string): ISlide[] => {
    const regex = new RegExp(separator, 'gm')
    const slides = slideContent.split(regex)
    return slides.map((s, i) => {

      return this.#parseSlide(trimFirstLastEmptyLine(s), i, verticalSeparator)

    })
  }


  #getVerticalSlides = (slideContent: string, verticalSeparator: string): ISlide[] => {
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

type FrontMatterParserError = {
  message: string
  reason?: string
  mark?: {
    line?: number
    column?: number
  }
}

export type SlideParserError = {
  message: string
  line?: number
  column?: number
}

export type ParseResult = {
  frontmatter?: FrontMatterResult<Configuration>
  slides: ISlide[]
  parseError?: SlideParserError
}

const mapParseError = (error: unknown): SlideParserError => {
  const parserError = error as FrontMatterParserError
  const message = parserError.reason ?? parserError.message ?? 'Unable to parse front matter.'
  return {
    message,
    line: parserError.mark?.line,
    column: parserError.mark?.column
  }
}

//Singleton
export default new SlideParser()
