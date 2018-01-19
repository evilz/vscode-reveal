import { VSCodeRevealContext } from '../VSCodeRevealContext'
import { countLinesToSlide } from '../SlideParser'
import * as vscode from 'vscode'

export const GO_TO_SLIDE = 'vscode-revealjs.goToSlide'
export type GO_TO_SLIDE = typeof GO_TO_SLIDE

export const goToSlide = (getContext: (() => VSCodeRevealContext)) => (topindex: number, verticalIndex: number) => {
  const currentContext = getContext()
  if (currentContext === undefined || topindex === undefined) {
    return
  }

  const linesCount = countLinesToSlide(currentContext.slides, topindex, verticalIndex) + currentContext.frontMatterLineCount

  const position = new vscode.Position(linesCount + 1, 0) // ugly + 1 to go to real first line

  currentContext.editor.selections = [new vscode.Selection(position, position)]
  currentContext.editor.revealRange(new vscode.Range(position, position.translate(20)))
}
