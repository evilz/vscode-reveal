/**
 * @summary Helpers to launch Chrome Browser
 * @author Vincent B. <evilznet@gmail.com>
 */

import * as fs from 'fs'
import * as opn from 'opn'
import * as os from 'os'
import * as path from 'path'

const WIN_APPDATA = process.env.LOCALAPPDATA || '/'

export const DEFAULT_CHROME_PATH = {
  LINUX: '/usr/bin/google-chrome',
  OSX: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  WIN: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  WIN_LOCALAPPDATA: path.join(WIN_APPDATA, 'Google\\Chrome\\Application\\chrome.exe'),
  WINx86: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',

  CHROMIUM_BROWSER: '/usr/bin/chromium-browser'
}

export const enum Platform {
  Windows,
  OSX,
  Linux
}

export function getPlatform(): Platform {
  const platform = os.platform()
  return platform === 'darwin' ? Platform.OSX : platform === 'win32' ? Platform.Windows : Platform.Linux
}

export function existsSync(filepath: string): boolean {
  try {
    fs.statSync(filepath)
    return true
  } catch (e) {
    // doesn't exist
    return false
  }
}

const getOSXChrome = () => (existsSync(DEFAULT_CHROME_PATH.OSX) ? DEFAULT_CHROME_PATH.OSX : null)

const getWindowsChrome = () => {
  if (existsSync(DEFAULT_CHROME_PATH.WINx86)) {
    return DEFAULT_CHROME_PATH.WINx86
  } else if (existsSync(DEFAULT_CHROME_PATH.WIN)) {
    return DEFAULT_CHROME_PATH.WIN
  } else if (existsSync(DEFAULT_CHROME_PATH.WIN_LOCALAPPDATA)) {
    return DEFAULT_CHROME_PATH.WIN_LOCALAPPDATA
  } else {
    return null
  }
}

const getLinuxChrome = () => {
  if (existsSync(DEFAULT_CHROME_PATH.LINUX)) {
    return DEFAULT_CHROME_PATH.LINUX
  }
  if (existsSync(DEFAULT_CHROME_PATH.CHROMIUM_BROWSER)) {
    return DEFAULT_CHROME_PATH.CHROMIUM_BROWSER
  }
  return null
}

export function getChromePath(): string | null {
  switch (getPlatform()) {
    case Platform.OSX:
      return getOSXChrome()
    case Platform.Windows:
      return getWindowsChrome()
    case Platform.Linux:
      return getLinuxChrome()
    default:
      return null
  }
}

export const openInBrowser = async (browserPath: string, url: string, headless = false) => {
  try {
    if (headless) {
      return await opn(url, { app: [browserPath, '--headless'] })
    }
    return await opn(url, { app: browserPath })
  } catch (error) {
    await opn(url)
    throw new Error('Can find Chrome on your computer, try with default browser...')
  }
}
