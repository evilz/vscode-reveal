import { IDocumentOptions } from './Configuration';
import { ISlide } from './ISlide';

export const countLines = text => {
  return text.split("\n").length
}

export const parseSlides = (slideContent: string, slidifyOptions: IDocumentOptions): ISlide[] => {
  const regex = new RegExp(slidifyOptions.separator, 'gm')
  const slides = slideContent.split(regex)
  return slides.map((s, i) => parseSlide(s, i, slidifyOptions))
}

const lineInSeparator = (separator: string) => (separator.match(/\\n/gm) || []).length

export const countLinesToSlide = (slides: ISlide[], horizontalIndex: number, verticalIndex: number, slidifyOptions: IDocumentOptions) => {
  const stopSlideIndex = verticalIndex > 0 ? horizontalIndex + 1 : horizontalIndex
  const separatorHeight = lineInSeparator(slidifyOptions.separator)
  const verticalSeparatorHeight = lineInSeparator(slidifyOptions.verticalSeparator)
  return slides.slice(0, stopSlideIndex).reduce((lines, slide) => {

    const lineInSlide = countLines(slide.text)
    const count = lines + countLines(slide.text) + separatorHeight

    return slide.verticalChildren
      ? count + addChildrenSlideLines(slide, horizontalIndex, verticalIndex, verticalSeparatorHeight)
      : count
  }, 0)
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
    return { title: findTitle(s), index: i, text: s, verticalChildren: [] }
  })
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

