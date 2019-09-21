
import * as jetpack from "fs-jetpack";
import * as path from 'path'

export interface IExportOptions {
  folderPath: string,
  url: string,
  data: string | null
  srcFilePath: string | null
}

export const exportHTML = async (options: IExportOptions) => {
  const { folderPath, url, data, srcFilePath } = options

  const file = url.endsWith('/') ? `${url}index.html` : url
  const filePath = path.join(folderPath ? folderPath  : ".", file)

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
