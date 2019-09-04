
import * as path from 'path'
//import { promises as fs } from 'fs'

import * as jetpack from "fs-jetpack";

export type ExportOptions = {
  folderPath: string,
  url: string,
  data: string | null
  srcFilePath: string | null
}

export const exportHTML = async (options: ExportOptions) => {
  const { folderPath, url, data, srcFilePath } = options

  const file = url.endsWith('/') ? `${url}index.html` : url
  const filePath = path.join(folderPath ? folderPath  : ".", file)
  //console.log(`Saving file ${filePath}`)
  //await fs.mkdir(path.dirname(filePath), {recursive:true})
  
  if (data) {
    try {
      await jetpack.writeAsync(filePath, data)
      return
     
    } catch (error) {
      console.error(error)
    }
  }
  if (srcFilePath) {

    try {
      await jetpack.copyAsync(srcFilePath, filePath, {overwrite : true})
      return
    } catch (error) {
      console.error(error)
    }
  }

}