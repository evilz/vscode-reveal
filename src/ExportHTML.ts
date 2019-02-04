import * as fs from 'fs'
import * as path from 'path'
import util = require('util')
const writeFile = util.promisify(fs.writeFile)
const stat = util.promisify(fs.stat)
const mkdir = util.promisify(fs.mkdir)
import { outputFileSync } from 'fs-extra'

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
