import * as fs from 'fs'
import * as open from 'open'
import * as os from 'os'
import { DEFAULT_CHROME_PATH, getChromePath, openInBrowser } from '../src/BrowserHelper'
import { mocked } from 'ts-jest/utils'

jest.mock('os');
jest.mock('fs');
jest.mock('open')

const mockedOpen = mocked(open, true)


test('Should use windows path on windows', () => {
    (fs.statSync as any).mockImplementation((_) => true);
    (os.platform as any).mockImplementation(() => 'win32');
    const path = getChromePath()
    expect(path).toBe(DEFAULT_CHROME_PATH.WINx86)
})



test('Should use linux path on linux', () => {
    (fs.statSync as any).mockImplementation((_) => true);
    (os.platform as any).mockImplementation(() => 'linux');
    const path = getChromePath()
    expect(path).toBe(DEFAULT_CHROME_PATH.LINUX)
})


test('Should use osx path on darwin', () => {
    (fs.statSync as any).mockImplementation((_) => true);
    (os.platform as any).mockImplementation(() => 'darwin');
    const path = getChromePath()
    expect(path).toBe(DEFAULT_CHROME_PATH.OSX)
})

test('Should use headless chrome only when needed', async () => {
    (fs.statSync as any).mockImplementation((_) => true);
    (os.platform as any).mockImplementation(() => 'win32');
    (open as any).mockImplementation(async (url, opts) => { })
    await openInBrowser(DEFAULT_CHROME_PATH.WINx86, "http://theurl")

    expect(mockedOpen.mock.calls.length).toBe(1);
    expect(mockedOpen.mock.calls[0][0]).toBe("http://theurl")
    // TODO : expect(mockedOpen.mock.calls[0][1]).toStrictEqual({ app: DEFAULT_CHROME_PATH.WINx86 })

    await openInBrowser(DEFAULT_CHROME_PATH.WINx86, "http://theurl", true)

    expect(mockedOpen.mock.calls.length).toBe(2);
    expect(mockedOpen.mock.calls[1][0]).toBe("http://theurl")
    // TODO : expect(mockedOpen.mock.calls[1][1]).toStrictEqual({ app: [DEFAULT_CHROME_PATH.WINx86, "--headless"] })
})
