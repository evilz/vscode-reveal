'use strict'
import * as vscode from 'vscode'
import BrowserContentProvider from './BrowserContentProvider'
import { StatusBarController } from './StatusBarController'

import open = require('open')
import { findContextBy } from './EditorContexts'
import { SlideTreeProvider } from './SlideExplorer'
import { VSodeRevealContext } from './VSodeRevealContext'

export function activate(context: vscode.ExtensionContext) {
  // BrowserContentProvider
  const provider = new BrowserContentProvider()
  const previewProviderRegistration = vscode.workspace.registerTextDocumentContentProvider(
    'reveal',
    provider
  )

  // Status
  const statusBarController = new StatusBarController()

  let contexts = new Array<VSodeRevealContext>()

  const getActiveEditor = () => {
    return vscode.window.activeTextEditor
  }

  console.log('Congratulations, your extension "vscode-reveal" is now active!')

  const showRevealJS = () => {
    if (getActiveEditor().document.languageId !== 'markdown') {
      vscode.window.showInformationMessage('revealjs presentation can only be markdown file')
      return null
    }
    const docContext = getContext()
    docContext.server.start()
    return docContext.uri
  }

  const getContext = () => {
    const editor = getActiveEditor()
    let actualContext = findContextBy(contexts)(editor)
    if (!actualContext) {
      actualContext = new VSodeRevealContext(editor)
      contexts = [...contexts, actualContext]
    }
    return actualContext
  }

  const currentContext = getContext()

  statusBarController.update(currentContext)

  const slidesExplorer = new SlideTreeProvider(currentContext)
  vscode.window.registerTreeDataProvider('slidesExplorer', slidesExplorer)

  // COMMAND : showRevealJS
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-revealjs.showRevealJS', () => {
      const uri = showRevealJS()
      if (uri) {
        return vscode.commands
          .executeCommand(
            'vscode.previewHtml',
            `reveal://${uri}`,
            vscode.ViewColumn.Two,
            'Reveal JS presentation'
          )
          .then(
            success => {
              console.log('show RevealJS presentation in new tab')
            },
            error => {
              vscode.window.showErrorMessage(error)
            }
          )
      } else {
        return null
      }
    })
  )

  // COMMAND : showRevealJSInBrowser
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-revealjs.showRevealJSInBrowser', () => {
      const uri = showRevealJS()
      return open(uri.toString())
    })
  )

  // COMMAND : KillRevealJSServer
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-revealjs.KillRevealJSServer', () => {
      const docContext = getContext()
      docContext.server.stop()
      statusBarController.update(docContext)
    })
  )

  // ON TAB CHANGE
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor) => {
      if (e) {
        statusBarController.update(getContext())
      }
    })
  )

  // ON CHANGE TEXT
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(_ => {
      statusBarController.update(getContext())
    })
  )

  // ON SAVE
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
      if (document === vscode.window.activeTextEditor.document) {
        const docContext = getContext()
        statusBarController.update(docContext)

        if (docContext.server.uri) {
          provider.update(vscode.Uri.parse(`reveal://${docContext.uri}`))
        }
      }
    })
  )
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('"vscode-reveal" is now deactivated')
}
