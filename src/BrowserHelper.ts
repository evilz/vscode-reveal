import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'
import * as opn from 'opn'
import { window } from 'vscode'
import { IExtensionOptions } from './Models';

const WIN_APPDATA = process.env.LOCALAPPDATA || '/'

const DEFAULT_CHROME_PATH = {
    LINUX: '/usr/bin/google-chrome',
    OSX: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    WIN: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    WIN_LOCALAPPDATA: path.join(WIN_APPDATA, 'Google\\Chrome\\Application\\chrome.exe'),
    WINx86: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',

    CHROMIUM_BROWSER: '/usr/bin/chromium-browser',
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

export function getBrowserPath(extensionOptions: IExtensionOptions): string {

    if (extensionOptions.browserPath !== null) {
        return extensionOptions.browserPath
    }


    const platform = getPlatform()
    if (platform === Platform.OSX) {
        return existsSync(DEFAULT_CHROME_PATH.OSX) ? DEFAULT_CHROME_PATH.OSX : null
    } else if (platform === Platform.Windows) {
        if (existsSync(DEFAULT_CHROME_PATH.WINx86)) {
            return DEFAULT_CHROME_PATH.WINx86
        } else if (existsSync(DEFAULT_CHROME_PATH.WIN)) {
            return DEFAULT_CHROME_PATH.WIN
        } else if (existsSync(DEFAULT_CHROME_PATH.WIN_LOCALAPPDATA)) {
            return DEFAULT_CHROME_PATH.WIN_LOCALAPPDATA
        } else {
            return null
        }
    } else {
        return existsSync(DEFAULT_CHROME_PATH.LINUX) ? DEFAULT_CHROME_PATH.LINUX :
            existsSync(DEFAULT_CHROME_PATH.CHROMIUM_BROWSER) ? DEFAULT_CHROME_PATH.CHROMIUM_BROWSER :
                null
    }
}

export const openInBrowser = async (extensionOptions: IExtensionOptions, url: string, headless?: boolean) => {
    try {
        const browserApp = getBrowserPath(extensionOptions);
        if (headless) {
            return await opn(url, { app: [browserApp, '--headless'] })
        }
        return await opn(url, { app: browserApp })
    } catch (error) {
        window.showWarningMessage('Can find Chrome on your computer, try with default browser...')
        await opn(url)
    }
}
