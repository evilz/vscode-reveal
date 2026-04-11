import { commands, Uri, window, workspace } from 'vscode'
import path from 'path'

export const NEW_PRESENTATION = 'vscode-revealjs.newPresentation'
export type NEW_PRESENTATION = typeof NEW_PRESENTATION

export type SupportFile = {
  filename: string
  content: string
}

type PresentationTemplate = {
  label: string
  description: string
  markdown: (title: string, localCssFile?: string) => string
  getSupportFiles?: (presentationFilepath: string) => SupportFile[]
}

const templates: PresentationTemplate[] = [
  {
    label: 'Minimal',
    description: 'Simple slide deck with front matter and two slides',
    markdown: (title: string) => `---\ntitle: "${title}"\ntheme: "black"\ntransition: "slide"\n---\n\n# ${title}\n\nWelcome to your new Reveal.js presentation.\n\n---\n\n## Agenda\n\n- Introduce the topic\n- Walk through key points\n- Wrap up with questions\n`,
  },
  {
    label: 'Code-heavy',
    description: 'Starter deck focused on code snippets',
    markdown: (title: string) => `---\ntitle: "${title}"\ntheme: "night"\nhighlightTheme: "monokai"\ntransition: "fade"\n---\n\n# ${title}\n\nPractical examples and implementation details.\n\n---\n\n## Example\n\n\`\`\`ts\nconst greet = (name: string) => "Hello \${name}"\n\nconsole.log(greet('Reveal'))\n\`\`\`\n\n---\n\n## Takeaways\n\n- Keep examples small\n- Explain the why\n- Leave time for Q&A\n`,
  },
  {
    label: 'Speaker notes',
    description: 'Includes presenter notes in each section',
    markdown: (title: string) => `---\ntitle: "${title}"\ntheme: "league"\nshowNotes: true\n---\n\n# ${title}\n\nPresenter-ready outline.\n\nNote:\nStart with a short story to set context.\n\n---\n\n## Key point\n\nUse this slide for your main argument.\n\nNote:\nPause here and check audience understanding.\n`,
  },
  {
    label: 'Custom theme',
    description: 'Deck with local CSS override file',
    markdown: (title: string, localCssFile?: string) => `---\ntitle: "${title}"\ntheme: "white"\ncss:\n  - "${localCssFile}"\n---\n\n# ${title}\n\nA presentation with local styling.\n\n---\n\n## Styled content\n\nThis template uses a local CSS file for customization.\n`,
    getSupportFiles: () => [
      {
        filename: 'presentation.css',
        content: `:root {\n  --r-heading-color: #005fb8;\n}\n\n.reveal .slides section {\n  text-align: left;\n}\n`,
      },
    ],
  },
]

export const getTemplateChoices = () => templates.map((t) => ({ label: t.label, description: t.description }))

export const scaffoldTemplate = (templateLabel: string, targetUri: Uri) => {
  const selectedTemplate = templates.find((t) => t.label === templateLabel)
  if (!selectedTemplate) {
    return null
  }

  const title = path.basename(targetUri.fsPath, path.extname(targetUri.fsPath)) || 'New Presentation'
  const supportFiles = selectedTemplate.getSupportFiles?.(targetUri.fsPath) ?? []
  const cssRef = supportFiles.length > 0 ? supportFiles[0].filename : undefined

  return {
    content: selectedTemplate.markdown(title, cssRef),
    supportFiles,
  }
}

export const createPresentationFromTemplate = async () => {
  const template = await window.showQuickPick(getTemplateChoices(), {
    placeHolder: 'Choose a starter template for your presentation',
  })

  if (!template) {
    return
  }

  const workspaceFolder = workspace.workspaceFolders?.[0]
  const defaultUri = workspaceFolder ? Uri.joinPath(workspaceFolder.uri, 'presentation.md') : undefined

  const targetUri = await window.showSaveDialog({
    defaultUri,
    saveLabel: 'Create Presentation',
    filters: {
      Markdown: ['md'],
    },
  })

  if (!targetUri) {
    return
  }

  const scaffold = scaffoldTemplate(template.label, targetUri)
  if (!scaffold) {
    return
  }

  for (const supportFile of scaffold.supportFiles) {
    const supportUri = Uri.joinPath(targetUri, '..', supportFile.filename)
    await workspace.fs.writeFile(supportUri, new TextEncoder().encode(supportFile.content))
  }

  await workspace.fs.writeFile(targetUri, new TextEncoder().encode(scaffold.content))

  await commands.executeCommand('vscode.open', targetUri)
  window.showInformationMessage(`Created presentation: ${path.basename(targetUri.fsPath)}`)
}
