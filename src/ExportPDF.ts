import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'
import * as which from 'which'
import { getBrowserPath } from './ChromeHelper'
import { spawn } from 'child_process'
import * as CDP from 'chrome-remote-interface'


/*
 * export a html to a pdf file (html-pdf)
//  */


export const savePdf = async (url, filename): Promise<string> => {
  vscode.window.setStatusBarMessage('$(markdown) export to pdf...')
  const promise = new Promise<string>((resolve, reject) => {
    const chromePath = getBrowserPath()
    const chromeFlags = ['--headless', '--disable-gpu', '--no-margins', '--remote-debugging-port=9222', url]
    // const chromeFlags = ['--headless', '--disable-gpu', '--print-to-pdf=' + filename, '--no-margins', '--remote-debugging-port=9222', url]
    const chromeProc = spawn(chromePath, chromeFlags, {})
    chromeProc.on('exit', function (code, signal) {
      console.log('child process exited with ' +
        `code ${code} and signal ${signal}`);
    });
    chromeProc.stdout.on('data', (data) => {
      console.log(`child stdout:\n${data}`);
    });
    chromeProc.stderr.on('data', (data) => {
      if (data.toString().indexOf('Written to file') === -1) {
        console.error(`child stderr:\n${data}`);
        reject(data)
      }
    });
    chromeProc.on('exit', function (code, signal) {
      console.log('child process exited with ' +
        `code ${code} and signal ${signal}`);
      if (code === 0) { resolve(filename) }
      else {
        reject(code)
      }
    });
  })


  remoteConnection(url, filename)


  return promise
  //   (error, stdout, stderr) => {
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
  // vscode.window.setStatusBarMessage('$(markdown) export to pdf DONE...')
  //return filename
}


const remoteConnection = (url, filename) => {

  CDP(async (client) => {
    const { Page } = client;
    try {
      await Page.enable();
      await Page.navigate({ url: url });
      await Page.loadEventFired();
      const { data } = await Page.printToPDF({
        landscape: true,
        printBackground: true,
        marginTop: '10cm',
        marginBottom: '10cm',
        marginLeft: '10cm',
        marginRight: '10cm',
        displayHeaderFooter: false,
        scale: 1
      });
      fs.writeFileSync(filename, Buffer.from(data, 'base64'));
    } catch (err) {
      console.error(err);
    } finally {
      await client.close();
    }
  }).on('error', (err) => {
    console.error(err);
  });
}

