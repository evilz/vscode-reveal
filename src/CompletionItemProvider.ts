/*
 * File: \src\CompletionItemProvider.ts
 * Project: vscode-reveal
 * Created Date: Sunday March 13th 2022
 * Author: evilz
 * -----
 * Last Modified: Wednesday, 16th March 2022 2:57:10 pm
 * Modified By: evilz
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

import {
  languages,
  TextDocument,
  Position,
  CancellationToken,
  CompletionItem,
  CompletionItemKind,
  MarkdownString,
  Disposable,
  CompletionItemProvider,
} from 'vscode'
import { ConfigurationDescription } from './Configuration'

/**
 * Provides a list of values for a given prefix
 * @param {string} prefix - The prefix that the user has already typed.
 * @param {string[]} values - an array of strings that will be used as the enum values.
 * @returns A completion item provider.
 */
export const enumValueProvider = (prefix: string, values: string[]) => {
  return {
    provideCompletionItems(document: TextDocument, position: Position) {
      const linePrefix = document.lineAt(position).text.substring(0, position.character)
      if (!linePrefix.startsWith(`${prefix}: `)) {
        return undefined
      }
      return values.map((theme) => new CompletionItem(theme, CompletionItemKind.EnumMember))
    },
  }
}

/**
 * Create a list of completion items for the given configuration description
 * @param {ConfigurationDescription[]} configDesc - A list of configuration descriptions.
 * @returns The `createCompletionItems` function returns a `CompletionItem[]` and an
 * `CompletionItemProvider[]`.
 */
export const createCompletionItems = (configDesc: ConfigurationDescription[]) => {
  const enumValueProviders: CompletionItemProvider[] = []
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
        case 'number':
          break
      }

      completionItem.commitCharacters = [' ']
      completionItem.insertText = completionItem.label + ': '
      return completionItem
    })
  return { completionItems, enumValueProviders }
}


/**
 * It creates a completion provider that returns the completion items that start with the prefix of the
 * line that the cursor is on.
 * @param {CompletionItem[]} completionItems - An array of CompletionItems.
 * @returns The `provideCompletionItems` function returns an array of `CompletionItem` objects.
 */
export const createCompletionItemsProvider = (completionItems: CompletionItem[]) => {
  return {
    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken) {
      if (!token.isCancellationRequested) {
        const linePrefix = document.lineAt(position).text.substring(0, position.character)
        return completionItems.filter((item) => item.label.toString().startsWith(linePrefix))
      }
      return []
    },
  }
}


/* The above code is registering a completion item provider for markdown. */
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
