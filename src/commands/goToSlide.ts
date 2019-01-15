import { countLinesToSlide } from '../SlideParser'

export const GO_TO_SLIDE = 'vscode-revealjs.goToSlide'
export type GO_TO_SLIDE = typeof GO_TO_SLIDE

// TODO:  USE less ???
export const goToSlide = (gotToSlideFn: ((h: number, v: number) => void)) => (topindex: number, verticalIndex: number) => {
  gotToSlideFn(topindex, verticalIndex)
}
