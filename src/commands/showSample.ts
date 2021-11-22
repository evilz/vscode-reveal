import { window, commands, Uri } from 'vscode'
import path from 'path'
export const SHOW_SAMPLE = 'vscode-revealjs.showSample'
export type SHOW_SAMPLE = typeof SHOW_SAMPLE

export const showSample = async (extensionPath) => {
  const result = await window.showQuickPick(
    [
      'animation',
      'anything',
      'audio-slideshow',
      'block-embed',
      'chalkboard',
      'chart',
      'customcontrols',
      'demo',
      'frontmatter',
      'fullscreen',
      'html-comments',
      'layout',
      'markdown-syntax',
      'math',
      'mermaid',
      'speaker-view',
      'table',
      'task',
    ],
    {
      placeHolder: 'Choose a sample file',
    }
  )
  const filepath = path.join(extensionPath, 'samples', result + '.md')
  const uri = Uri.file(filepath)
  commands.executeCommand('vscode.open', uri)
  window.showInformationMessage(`Open: ${result} sample`)
}
