import * as chromeLauncher from 'chrome-launcher'
import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'
import * as which from 'which'
import { getBrowserPath } from './ChromeHelper'
import { execFile } from 'child_process'
import * as puppeteer from 'puppeteer'
/*
 * export a html to a pdf file (html-pdf)
 */
export const savePdf = async (url, filename) => {
  vscode.window.setStatusBarMessage('$(markdown) export to pdf...')

  const browser = await puppeteer.launch({ executablePath: getBrowserPath() })
  const page = await browser.newPage()
  await page.goto('https://news.ycombinator.com', { waitUntil: 'networkidle2' })
  // page.pdf() is currently supported only in headless mode.
  // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
  await page.pdf({
    path: 'hn.pdf',
    format: 'letter'
  })

  await browser.close()

  // const chromePath = getBrowserPath()
  // const chromeFlags = ['--headless', '--disable-gpu', '--print-to-pdf', 'https://www.evilznet.com']
  // const chromeProc = execFile(chromePath, chromeFlags, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error('stderr', stderr)
  //     throw error
  //   }
  //   console.log('stdout', stdout)
  // })
  // chromeProc.unref()
  // return chromeProc

  // "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --headless --print-to-pdf="d:\\sample.pdf" http://localhost:50241/?print-pdf#/

  // const instance = await chromeLauncher.launch({
  //   startingUrl: url,
  //   chromeFlags: ['--headless', '--disable-gpu', `--print-to-pdf="d:\\tessssst.pdf"`],
  //   logLevel: 'verbose'
  // })

  // console.log(`Chrome debugging port running on ${instance.port}`)

  vscode.window.setStatusBarMessage('$(markdown) export to pdf DONE...')

  return filename
}
