import { window, Disposable, Range, TextEditor, ThemeColor } from 'vscode'

interface DecorationOption {
  directiveKeys: Range[]
  globalDirectiveKeys: Range[]
}

const revealjsConfigKeyForeground = window.createTextEditorDecorationType({
  fontWeight: 'bold',
  color: new ThemeColor('revealjs.configKeyForeground'),
})

export function registerDecorations(subscriptions: Disposable[]) {
  subscriptions.push(    revealjsConfigKeyForeground  )
}

export function setDecorations(editor: TextEditor, option: DecorationOption) {
  editor.setDecorations(revealjsConfigKeyForeground, option.directiveKeys)
}

export function removeDecorations(editor: TextEditor) {
  setDecorations(editor, {
    directiveKeys: [],
    globalDirectiveKeys: [],
  })
}
