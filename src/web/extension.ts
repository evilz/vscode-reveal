import * as vscode from 'vscode'

const SHOW_REVEALJS = 'vscode-revealjs.showRevealJS'
const SHOW_REVEALJS_IN_BROWSER = 'vscode-revealjs.showRevealJSInBrowser'

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const renderMarkdown = (markdown: string) => {
  const escaped = escapeHtml(markdown.trim())
  return escaped
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

export const renderSlides = (markdown: string) => markdown
  .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
  .split(/^---$/gm)
  .map((slide) => `<section>${renderMarkdown(slide)}</section>`)
  .join('\n')

export const createPresentationHtml = (
  markdown: string,
  assetUri: (path: string) => string,
  documentBaseUri: string,
) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <base href="${documentBaseUri}/">
  <link rel="stylesheet" href="${assetUri('libs/reveal.js/6.0.1/reset.css')}">
  <link rel="stylesheet" href="${assetUri('libs/reveal.js/6.0.1/reveal.css')}">
  <link rel="stylesheet" href="${assetUri('libs/reveal.js/6.0.1/theme/black.css')}">
</head>
<body>
  <div class="reveal"><div class="slides">${renderSlides(markdown)}</div></div>
  <script src="${assetUri('libs/reveal.js/6.0.1/reveal.js')}"></script>
  <script>Reveal.initialize({ hash: true });</script>
</body>
</html>`

const showPresentation = (context: vscode.ExtensionContext) => {
  const editor = vscode.window.activeTextEditor
  if (!editor || editor.document.languageId !== 'markdown') {
    void vscode.window.showErrorMessage('Open a Markdown document to preview it with Reveal.js.')
    return
  }

  const documentFolder = vscode.Uri.joinPath(editor.document.uri, '..')
  const panel = vscode.window.createWebviewPanel(
    'RevealJS',
    'Reveal JS presentation',
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      localResourceRoots: [context.extensionUri, documentFolder],
    },
  )
  const assetUri = (assetPath: string) => panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, assetPath)).toString()
  const documentBaseUri = panel.webview.asWebviewUri(documentFolder).toString().replace(/\/$/, '')
  panel.webview.html = createPresentationHtml(editor.document.getText(), assetUri, documentBaseUri)
}

export const activate = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand(SHOW_REVEALJS, () => showPresentation(context)),
    vscode.commands.registerCommand(SHOW_REVEALJS_IN_BROWSER, () => showPresentation(context)),
  )
}
