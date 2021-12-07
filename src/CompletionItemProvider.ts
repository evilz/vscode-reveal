import {
  languages,
  TextDocument,
  Position,
  CancellationToken,
  CompletionContext,
  CompletionItem,
  CompletionItemKind,
  MarkdownString,
  Disposable,
} from 'vscode'
import { ConfigurationDescription } from './Configuration'
//provideCompletionItems
const enumValueProvider = (prefix: string, values: string[]) => {
  return {
    provideCompletionItems(document: TextDocument, position: Position) {
      const linePrefix = document.lineAt(position).text.substr(0, position.character)
      if (!linePrefix.startsWith(`${prefix}: `)) {
        return undefined
      }
      return values.map((theme) => new CompletionItem(theme, CompletionItemKind.EnumMember))
    },
  }
}

export default (configDesc: ConfigurationDescription[]) => {
  // const completionItems: CompletionItem[] = []
  const disposables: Disposable[] = []

  const completionItems = configDesc.map(({ label, detail, documentation, type, values }) => {
    const completionItem = new CompletionItem(label)
    completionItem.kind = CompletionItemKind.Enum
    completionItem.detail = detail
    completionItem.filterText = label
    //if(prop.default) { completionItem.documentation = new MarkdownString(`Default value:  ${prop.default}`);}
    completionItem.documentation = new MarkdownString(documentation)

    switch (type) {
      case 'string':
        if (values && values.length > 0) {
          disposables.push(languages.registerCompletionItemProvider('markdown', enumValueProvider(label, values)))
        }
        break
      case 'boolean':
        disposables.push(languages.registerCompletionItemProvider('markdown', enumValueProvider(label, ['true', 'false'])))
        break
    }

    completionItem.commitCharacters = [' ']
    completionItem.insertText = completionItem.label + ': '
    return completionItem
  })

  const mainProvider = languages.registerCompletionItemProvider('markdown', {
    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
      if (!token.isCancellationRequested) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character)
        return completionItems.filter((item) => item.label.toString().startsWith(linePrefix))
      }
    },
  })

  disposables.push(mainProvider)
  return disposables
}
