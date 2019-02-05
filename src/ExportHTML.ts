import { outputFileSync } from 'fs-extra'
import * as path from 'path'

export const saveContent = (getExportFolderPath: () => string | null, url: string, data: string) => {
  const exportFolderName = getExportFolderPath()
  if (exportFolderName === null) {
    return
  }

  const file = url.endsWith('/') ? `${url}index.html` : url
  const filePath = path.join(exportFolderName, file)
  console.log(`Saving file ${filePath}`)

  try {
    outputFileSync(filePath, data)
  } catch (error) {
    console.error(error)
  }
}
