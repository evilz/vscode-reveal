import * as fs from 'fs'
import * as copyFile from 'quickly-copy-file'
import * as path from 'path'
import * as vscode from 'vscode'
import { VSCodeRevealContext } from './VSCodeRevealContext'

const exportFolderName = 'export'

export const getExportFolderPath = (context: VSCodeRevealContext) => {
  const rootDir = path.dirname(context.editor.document.fileName)
  return path.join(rootDir, exportFolderName)
}

export const saveIndex = (rootdir, data) => {
  const destDir = path.join(rootdir, exportFolderName)
  const destFile = path.join(destDir, 'index.html')
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir)
  }

  fs.writeFile(destFile, data, err => {
    if (err) {
      console.log(err)
    } else {
      console.log(`create ${destFile}`)
    }
  })
}

const copy = async (file, dest) => {
  try {
    await copyFile(file, dest)
    console.log(`${file} was copied to ${dest}`)
  } catch (err) {
    console.error(err)
  }
}

export const saveContent = async (rootdir, revealjsDir, req) => {
  const staticDirs = ['/css', '/js', '/images', '/plugin', '/lib']

  // highlight JS Module
  if (req.url.indexOf(`/lib/css/`) === 0) {
    const highlightPath = path.resolve(require.resolve('highlight.js'), '..', '..')
    // save
    const file = path.join(highlightPath, 'styles', req.url.replace(`/lib/css/`, ''))
    const dest = path.join(rootdir, 'export', req.url)
    await copy(file, dest)
  } else if (staticDirs.find(dir => req.url.indexOf(dir) === 0)) {
    // RevealJS Module or relative files
    const file = path.join(revealjsDir, req.url)
    const dest = path.join(rootdir, 'export', req.url)
    await copy(file, dest)
  } else if (req.url !== '/') {
    const file = path.join(rootdir, req.url)
    const dest = path.join(rootdir, 'export', req.url)
    await copy(file, dest)
  }
}

// export const saveHtml = async (url, dir) => {
//   const asyncFiles = [
//     '/lib/js/classList.js',
//     '/plugin/markdown/marked.js',
//     '/plugin/markdown/markdown.js',
//     '/plugin/highlight/highlight.js',
//     '/plugin/notes/notes.js',
//     '/plugin/math/math.js',
//     '/css/print/paper.css'
//   ]

//   const options = {
//     urls: [url, ...asyncFiles.map(f => url + f)],
//     directory: dir
//   }

//   try {
//     fs.removeSync(options.directory)
//     // with promise
//     // const result = await scrape(options)
//     return options.directory
//   } catch (err) {
//     vscode.window.showErrorMessage('Cannot save slides in html: ' + err)
//   }
// }
