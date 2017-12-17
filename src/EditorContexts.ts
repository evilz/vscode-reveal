import { TextEdit, TextEditor, Uri } from 'vscode'
import { RevealServerState } from './Models'
import { RevealServer } from './Server'
import { VSodeRevealContext } from './VSodeRevealContext'

export const containsContextBy = (contexts: VSodeRevealContext[]) => (
  key: TextEditor | Uri
): boolean => {
  if (key instanceof Uri) {
    return contexts.some(uriPredicate(key))
  } else {
    return contexts.some(editorPredicate(key))
  }
}

export const findContextBy = (contexts: VSodeRevealContext[]) => (
  key: TextEditor | Uri
): VSodeRevealContext => {
  if (key instanceof Uri) {
    return contexts.find(uriPredicate(key))
  } else {
    return contexts.find(editorPredicate(key))
  }
}

const editorPredicate = (key: TextEditor) => (c: VSodeRevealContext) => c.editor === key
const uriPredicate = (key: Uri) => (c: VSodeRevealContext) =>
  c.server.state === RevealServerState.Started && c.server.uri === key
