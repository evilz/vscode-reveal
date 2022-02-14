import { ISlide } from "./ISlide";

export const extensionId = "revealjs"

export const notesSeparator= 'note:'
export const separator= '^\\r?\\n---\\r?\\n$'
export const verticalSeparator= '^\\r?\\n--\\r?\\n$'


export const countLines = (text:string) => text.split("\n").length
  
const lineInSeparator = (separator: string) => (separator.match(/\\n/gm) || []).length + 1

const addChildrenSlideLines = (slide, horizontalIndex, verticalIndex, verticalSeparatorHeight) => {
  const stopVerticalAt = slide.index === horizontalIndex ? verticalIndex - 1 : slide.verticalChildren.length

  return slide.verticalChildren
    ? slide.verticalChildren.slice(0, stopVerticalAt).reduce((innerLines, innerSlide) => {
      return innerLines + countLines(innerSlide.text) + verticalSeparatorHeight
    }, 0)
    : 0
}

export const countLinesToSlide = (slides: ISlide[], horizontalIndex: number, verticalIndex: number) => {
    const stopSlideIndex = verticalIndex > 0 ? horizontalIndex + 1 : horizontalIndex
    const separatorHeight = lineInSeparator(separator)
    const verticalSeparatorHeight = lineInSeparator(verticalSeparator)
    return slides.slice(0, stopSlideIndex).reduce((lines, slide) => {
  
      const count = lines + countLines(slide.text) + separatorHeight
  
      return slide.verticalChildren
        ? count + addChildrenSlideLines(slide, horizontalIndex, verticalIndex, verticalSeparatorHeight)
        : count
    }, 1)
  }