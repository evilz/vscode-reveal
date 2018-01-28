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

  public deleteContext = (document: vscode.TextDocument) => {
    if (!document) {
      return undefined
    }

    const index = this.innerArray.findIndex(x => x.editor.document === document)
    if (index >= 0) {
      const context = this.innerArray[index]
      context.server.stop()
      this.innerArray = this.innerArray.splice(index, 1)
    }

  }

  private getActiveEditor = () => {
    const editor = vscode.window.activeTextEditor
    if (editor.document.languageId !== 'markdown') {
      return undefined
    }
    return editor
  }


}
