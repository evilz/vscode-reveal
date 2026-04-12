import open from 'open'
import { commands, env, Uri } from 'vscode'

const trimOrNull = (value: string | null | undefined): string | null => {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export const openInBrowser = async (targetUrl: string, browserPath?: string | null) => {
  const customBrowserPath = trimOrNull(browserPath)
  if (customBrowserPath) {
    return open(targetUrl, {
      app: {
        name: customBrowserPath,
      },
    })
  }
  return env.openExternal(Uri.parse(targetUrl))
}

export const openFolder = async (folderPath: string) => {
  const folderUri = Uri.file(folderPath)

  try {
    await commands.executeCommand('revealFileInOS', folderUri)
    return
  } catch {
    return env.openExternal(folderUri)
  }
}
