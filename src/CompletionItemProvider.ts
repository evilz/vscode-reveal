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
  CompletionItemProvider,
} from 'vscode'
import { ConfigurationDescription } from './Configuration'




export const enumValueProvider = (prefix: string, values: string[]) => {
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

export const createCompletionItems = (configDesc: ConfigurationDescription[]) => {
  const enumValueProviders: CompletionItemProvider<CompletionItem>[] = []
  const completionItems: CompletionItem[] =
    configDesc.map(({ label, detail, documentation, type, values }) => {
      const completionItem = new CompletionItem(label)
      completionItem.kind = CompletionItemKind.Enum
      completionItem.detail = detail
      completionItem.filterText = label
      completionItem.documentation = new MarkdownString(documentation)

      switch (type) {
        case 'string':
          if (values && values.length > 0) {
            enumValueProviders.push(enumValueProvider(label, values))
          }
          break
        case 'boolean':
          enumValueProviders.push(enumValueProvider(label, ['true', 'false']))
          break
      }

      completionItem.commitCharacters = [' ']
      completionItem.insertText = completionItem.label + ': '
      return completionItem
    })
  return { completionItems, enumValueProviders }
}


export const createCompletionItemsProvider = (completionItems: CompletionItem[]) => {
  return {
    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
      if (!token.isCancellationRequested) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character)
        return completionItems.filter((item) => item.label.toString().startsWith(linePrefix))
      }
    },
  }
}


export default (configDesc: ConfigurationDescription[]) => {
  const disposables: Disposable[] = []
  const { completionItems, enumValueProviders } = createCompletionItems(configDesc)

  for (const e of enumValueProviders) {
    disposables.push(languages.registerCompletionItemProvider('markdown', e))
  }

  const mainProvider = languages.registerCompletionItemProvider('markdown', createCompletionItemsProvider(completionItems))
  disposables.push(mainProvider)
  return disposables
}
