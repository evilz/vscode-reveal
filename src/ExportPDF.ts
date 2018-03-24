import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'
import { getBrowserPath } from './BrowserHelper'
import { spawn } from 'child_process'
import { getExtensionOptions } from './Configuration';

/*
 * export a html to a pdf file (html-pdf)
//  */

export const savePdf = async (url, filename): Promise<string> => {
  vscode.window.setStatusBarMessage('$(markdown) export to pdf...')
  const promise = new Promise<string>((resolve, reject) => {
    const chromePath = getBrowserPath(getExtensionOptions())
    const chromeFlags = ['--headless', '--disable-gpu', '--no-margins', '--remote-debugging-port=9222', url]
    // const chromeFlags = ['--headless', '--disable-gpu', '--print-to-pdf=' + filename, '--no-margins', '--remote-debugging-port=9222', url]
    const chromeProc = spawn(chromePath, chromeFlags, {})
    chromeProc.on('exit', function (code, signal) {
      console.log('child process exited with ' + `code ${code} and signal ${signal}`)
    })
    chromeProc.stdout.on('data', data => {
      console.log(`child stdout:\n${data}`)
    })
    chromeProc.stderr.on('data', data => {
      if (data.toString().indexOf('Written to file') === -1) {
        console.error(`child stderr:\n${data}`)
        reject(data)
      }
    })
    chromeProc.on('exit', function (code, signal) {
      console.log('child process exited with ' + `code ${code} and signal ${signal}`)
      if (code === 0) {
        resolve(filename)
      } else {
        reject(code)
      }
    })
  })

  return promise
}
