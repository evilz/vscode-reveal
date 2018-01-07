import * as vscode from 'vscode'
import { VSCodeRevealContext } from './VSCodeRevealContext'

export class VSCodeRevealContexts {
  private innerArray = new Array<VSCodeRevealContext>()

  public getContext = () => {
    const editor = this.getActiveEditor()
    if (!editor) {
      return undefined
    }

    let actualContext = this.innerArray.find(x => x.editor === editor)

    if (!actualContext) {
      actualContext = new VSCodeRevealContext(editor)
      this.innerArray.push(actualContext)
    }
    return actualContext
  }

  private getActiveEditor = () => {
    const editor = vscode.window.activeTextEditor
    if (editor.document.languageId !== 'markdown') {
      return undefined
    }
    return editor
  }
}
