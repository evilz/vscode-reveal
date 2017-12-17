import { ISlide, ISlidifyOptions } from './Models'

/**
 * Count horizontal slides
 *
 * @param {string} slideContent (w/o front matter)
 * @param {string} separator
 * @returns number of horizontal slides
 */

export const parseSlides = (slideContent: string, slidifyOptions: ISlidifyOptions): ISlide[] => {
  const regex = new RegExp(slidifyOptions.separator, 'gm')
  const slides = slideContent.split(regex)
  return slides.map(s => parseSlide(s, slidifyOptions))
}

const parseSlide = (slideContent: string, slidifyOptions: ISlidifyOptions) => {
  const verticalSlides = getVerticalSlides(slideContent, slidifyOptions)
  if (verticalSlides.length > 1) {
    const currentSlide = verticalSlides[0]
    return { ...currentSlide, verticalChildren: verticalSlides.slice(1) }
  }

  return verticalSlides[0]
}

const getVerticalSlides = (slideContent: string, slidifyOptions: ISlidifyOptions) => {
  const regex = new RegExp(slidifyOptions.verticalSeparator, 'gm')
  const slides = slideContent.split(regex)

  const verticalSlides = slides.map(s => {
    return { title: findTitle(s) }
  })
  return verticalSlides
}

const findTitle = (text: string) => {
  // Rem : take only the first line ...
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/^\s*\n/gm, '')
    .split('\n')
  return lines[0]
}
