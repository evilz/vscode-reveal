import { IDocumentOptions } from './Configuration';
import { ISlide } from './ISlide';

export const countLines = text => {
  return text.split("\n").length
}

const trimFirstLastEmptyLine = (s) => {
  let content = s
  content = content.indexOf("\n") === 0 ? content.substr(1) : content
  content = content.indexOf("\r\n") === 0 ? content.substr(2) : content

  content = content.lastIndexOf("\n") === content.length - 1 ? content.substr(0, content.length - 1) : content
  content = content.lastIndexOf("\r\n") === content.length - 2 ? content.substr(0, content.length - 2) : content
  return content
}

export const parseSlides = (slideContent: string, slidifyOptions: IDocumentOptions): ISlide[] => {
  const regex = new RegExp(slidifyOptions.separator, 'gm')
  const slides = slideContent.split(regex)
  // TODO : do dirty remove first or last line !
  return slides.map((s, i) => {

    return parseSlide(trimFirstLastEmptyLine(s), i, slidifyOptions)

  })
}

const lineInSeparator = (separator: string) => (separator.match(/\\n/gm) || []).length + 1

export const countLinesToSlide = (slides: ISlide[], horizontalIndex: number, verticalIndex: number, slidifyOptions: IDocumentOptions) => {
  const stopSlideIndex = verticalIndex > 0 ? horizontalIndex + 1 : horizontalIndex
  const separatorHeight = lineInSeparator(slidifyOptions.separator)
  const verticalSeparatorHeight = lineInSeparator(slidifyOptions.verticalSeparator)
  return slides.slice(0, stopSlideIndex).reduce((lines, slide) => {

    const count = lines + countLines(slide.text) + separatorHeight

    return slide.verticalChildren
      ? count + addChildrenSlideLines(slide, horizontalIndex, verticalIndex, verticalSeparatorHeight)
      : count
  }, 1)
}

const addChildrenSlideLines = (slide, horizontalIndex, verticalIndex, verticalSeparatorHeight) => {
  const stopVerticalAt = slide.index === horizontalIndex ? verticalIndex - 1 : slide.verticalChildren.length

  return slide.verticalChildren
    ? slide.verticalChildren.slice(0, stopVerticalAt).reduce((innerLines, innerSlide) => {
      return innerLines + countLines(innerSlide.text) + verticalSeparatorHeight
    }, 0)
    : 0
}

const parseSlide = (slideContent: string, index: number, documentOption: IDocumentOptions): ISlide => {
  const verticalSlides = getVerticalSlides(slideContent, documentOption)
  const currentSlide = verticalSlides[0]

  return {
    ...currentSlide,
    index,
    verticalChildren: verticalSlides.length > 1 ? verticalSlides.slice(1) : []
  }
}

const getVerticalSlides = (slideContent: string, documentOption: IDocumentOptions): ISlide[] => {
  const regex = new RegExp(documentOption.verticalSeparator, 'gm')
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


