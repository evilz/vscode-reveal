import * as fs from 'fs-extra'
import * as path from 'path'
import * as vscode from 'vscode'

export const saveHtml = async (url, dir) => {
  const asyncFiles = [
    '/lib/js/classList.js',
    '/plugin/markdown/marked.js',
    '/plugin/markdown/markdown.js',
    '/plugin/highlight/highlight.js',
    '/plugin/notes/notes.js',
    '/plugin/math/math.js',
    '/css/print/paper.css'
  ]

  const options = {
    urls: [url, ...asyncFiles.map(f => url + f)],
    directory: dir
  }

  try {
    fs.removeSync(options.directory)
    // with promise
    // const result = await scrape(options)
    return options.directory
  } catch (err) {
    vscode.window.showErrorMessage('Cannot save slides in html: ' + err)
  }
}
