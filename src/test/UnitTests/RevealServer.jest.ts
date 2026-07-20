import { RevealServer } from '../../RevealServer'
import Logger, { LogLevel } from '../../Logger'
import { Configuration, defaultConfiguration } from '../../Configuration'
import request from 'supertest'
import { RevealContext } from '../../RevealContext'
import { TextEditor } from 'vscode'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as fsSync from 'fs'
import * as os from 'os'

const localAssetPattern = /(?:href|src)="(libs\/[^"]+)"/g
const collectLocalAssets = (html: string) => [...html.matchAll(localAssetPattern)].map((match) => match[1])
const tempDirectoryPrefix = 'vscode-reveal-'
const moduleInitSource = 'import "./plugin.js";'

const createContext = (options?: { inExport?: boolean; dirname?: string; onExportError?: (error: unknown) => void; configuration?: Partial<Configuration> & Record<string, unknown> }) => {
  const logger = new Logger(() => undefined, LogLevel.Error)
  const inExport = options?.inExport ?? false
  const fileName = path.join(options?.dirname ?? os.tmpdir(), 'deck.md')
  return new RevealContext(
    { document: { fileName } } as TextEditor,
    logger,
    () => ({ ...defaultConfiguration, ...options?.configuration }),
    process.cwd(),
    () => inExport,
    options?.onExportError ?? (() => undefined),
  )
}

describe('RevealServer', () => {
  test('default state has no active URI before start', () => {
    const context = createContext()
    const server = new RevealServer(context)

    expect(server.isListening).toBeFalsy()
    expect(server.uri).toBe('')

    server.dispose()
    context.dispose()
  })

  test('start and stop toggle listening state and preserve uri shape', () => {
    const context = createContext()
    const server = new RevealServer(context)

    const uri = server.start()
    expect(server.isListening).toBeTruthy()
    expect(uri).toMatch(/^http:\/\/localhost:\d+\/$/)
    expect(uri).toBe(server.uri)

    server.stop()
    expect(server.isListening).toBeFalsy()
    expect(server.uri).toBe('')

    server.dispose()
    context.dispose()
  })

  test('root request returns rendered HTML with no-store cache header', async () => {
    const context = createContext()
    const server = new RevealServer(context)

    const response = await request(server.app).get('/')

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('text/html')
    expect(response.headers['cache-control']).toBe('no-store')

    server.dispose()
    context.dispose()
  })

  test('root request references only bundled local assets', async () => {
    const context = createContext()
    const server = new RevealServer(context)

    const response = await request(server.app).get('/')
    const localAssets = collectLocalAssets(response.text)
    const missingAssets = localAssets.filter((asset) => !fsSync.existsSync(path.join(process.cwd(), asset)))

    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/markdown.js')
    expect(response.text).not.toContain('libs/reveal.js/6.0.1/plugin/markdown/markdown.js')
    expect(response.text).not.toContain('maxcdn.bootstrapcdn.com/font-awesome')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/menu/font-awesome/css/all.css')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/menu/font-awesome/css/v4-shims.min.css')
    expect(missingAssets).toEqual([])

    server.dispose()
    context.dispose()
  })

  test('renders formatted slide numbers and PDF export options into reveal config', async () => {
    const context = createContext({
      configuration: {
        slideNumber: 'h/v',
        pdfSeparateFragments: false,
        pdfMaxPagesPerSlide: 1,
      },
    })
    const server = new RevealServer(context)

    const response = await request(server.app).get('/')

    expect(response.text).toContain('slideNumber: "h/v",')
    expect(response.text).toContain('pdfMaxPagesPerSlide: 1,')
    expect(response.text).toContain('pdfSeparateFragments: false,')

    server.dispose()
    context.dispose()
  })

  test('root request includes default-enabled optional plugin assets and registrations', async () => {
    const context = createContext()
    const server = new RevealServer(context)

    const response = await request(server.app).get('/')

    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/menu/menu.js')
    expect(response.text).toContain("path: 'libs/reveal.js/6.0.1/plugin/menu/'")
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/loadcontent/plugin.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/fullscreen/plugin.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/anything/plugin.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/chart/chart.min.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/chart/plugin.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/audio-slideshow/plugin.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/audio-slideshow/RecordRTC.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/audio-slideshow/recorder.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/seminar/plugin.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/poll/plugin.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/questions/plugin.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/animate/svg.min.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/animate/plugin.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/chalkboard/plugin.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/chalkboard/style.css')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/customcontrols/plugin.js')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/customcontrols/style.css')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/poll/style.css')
    expect(response.text).toContain('libs/reveal.js/6.0.1/plugin/questions/style.css')
    expect(response.text).toContain('window.RevealLoadContent')
    expect(response.text).toContain('window.RevealFullscreen')
    expect(response.text).toContain('window.RevealAnything')
    expect(response.text).toContain('window.RevealChart')
    expect(response.text).toContain('window.RevealAudioSlideshow')
    expect(response.text).toContain('window.RevealAudioRecorder')
    expect(response.text).toContain('window.RevealMenu')
    expect(response.text).toContain('window.RevealAnimate')
    expect(response.text).toContain('window.RevealChalkboard')
    expect(response.text).toContain('window.RevealCustomControls')
    expect(response.text).toContain('const hasSeminarConfig = false;')
    expect(response.text).not.toContain('cdnjs.cloudflare.com/ajax/libs/socket.io')
    expect(response.text).toContain('RevealChalkboard.toggleChalkboard();')
    expect(response.text).toContain('RevealChalkboard.toggleNotesCanvas();')

    server.dispose()
    context.dispose()
  })

  test('root request omits optional plugin assets when disabled', async () => {
    const context = createContext({ configuration: { enableMenu: false, enableChalkboard: false, enableZoom: false, enableSearch: false } })
    const server = new RevealServer(context)

    const response = await request(server.app).get('/')

    expect(response.text).not.toContain('libs/reveal.js/6.0.1/plugin/menu/menu.js')
    expect(response.text).not.toContain("path: 'libs/reveal.js/6.0.1/plugin/menu/'")
    expect(response.text).not.toContain('libs/reveal.js/6.0.1/plugin/chalkboard/plugin.js')
    expect(response.text).not.toContain('libs/reveal.js/6.0.1/plugin/chalkboard/style.css')
    expect(response.text).not.toContain('libs/reveal.js/6.0.1/plugin/customcontrols/plugin.js')
    expect(response.text).not.toContain('libs/reveal.js/6.0.1/plugin/customcontrols/style.css')
    expect(response.text).not.toContain('window.RevealMenu')
    expect(response.text).not.toContain('window.RevealChalkboard')
    expect(response.text).not.toContain('window.RevealCustomControls')

    server.dispose()
    context.dispose()
  })

  test('registers seminar plugins only when seminar configuration is provided', async () => {
    const context = createContext({
      configuration: {
        seminar: {
          server: 'http://localhost:4433',
          hash: 'integration-test',
        },
      },
    })
    const server = new RevealServer(context)

    const response = await request(server.app).get('/')

    expect(response.text).toContain('cdnjs.cloudflare.com/ajax/libs/socket.io/4.6.1/socket.io.js')
    expect(response.text).toContain('const hasSeminarConfig = true;')
    expect(response.text).toContain('window.RevealSeminar, window.RevealPoll, window.RevealQnA')
    expect(response.text).toContain('"server":"http://localhost:4433"')
    expect(response.text).toContain('"hash":"integration-test"')

    server.dispose()
    context.dispose()
  })

  test('renders keyboard object configuration as JavaScript object', async () => {
    const context = createContext({
      configuration: {
        keyboard: {
          66: 'togglePause',
          191: null,
          192: '</script>\u2028\u2029',
        },
      },
    })
    const server = new RevealServer(context)

    const response = await request(server.app).get('/')

    expect(response.text).toContain('keyboard: {"66":"togglePause","191":null,"192":"\\u003c/script>\\u2028\\u2029"}')
    expect(response.text).not.toContain('"192":"</script>')

    server.dispose()
    context.dispose()
  })

  test('serves rendered bundled assets through static middleware', async () => {
    const context = createContext()
    const server = new RevealServer(context)

    const response = await request(server.app).get('/')
    const localAssets = collectLocalAssets(response.text)

    for (const asset of localAssets) {
      const assetResponse = await request(server.app).get(`/${asset}`)
      expect(assetResponse.status).toBe(200)
    }

    server.dispose()
    context.dispose()
  })

  test('serves secondary assets loaded by default optional plugins', async () => {
    const context = createContext()
    const server = new RevealServer(context)
    const pluginAssets = [
      '/libs/reveal.js/6.0.1/plugin/loadcontent/plugin.js',
      '/libs/reveal.js/6.0.1/plugin/fullscreen/plugin.js',
      '/libs/reveal.js/6.0.1/plugin/anything/d3/d3.v3.min.js',
      '/libs/reveal.js/6.0.1/plugin/anything/d3.patch.js',
      '/libs/reveal.js/6.0.1/plugin/anything/d3/queue.v1.min.js',
      '/libs/reveal.js/6.0.1/plugin/anything/d3/topojson.v1.min.js',
      '/libs/reveal.js/6.0.1/plugin/anything/function-plot.js',
      '/libs/reveal.js/6.0.1/plugin/anything/plugin.js',
      '/libs/reveal.js/6.0.1/plugin/chart/chart.min.js',
      '/libs/reveal.js/6.0.1/plugin/chart/plugin.js',
      '/libs/reveal.js/6.0.1/plugin/audio-slideshow/plugin.js',
      '/libs/reveal.js/6.0.1/plugin/audio-slideshow/RecordRTC.js',
      '/libs/reveal.js/6.0.1/plugin/audio-slideshow/recorder.js',
      '/libs/reveal.js/6.0.1/plugin/seminar/plugin.js',
      '/libs/reveal.js/6.0.1/plugin/poll/plugin.js',
      '/libs/reveal.js/6.0.1/plugin/poll/style.css',
      '/libs/reveal.js/6.0.1/plugin/questions/plugin.js',
      '/libs/reveal.js/6.0.1/plugin/questions/style.css',
      '/libs/reveal.js/6.0.1/plugin/animate/svg.min.js',
      '/libs/reveal.js/6.0.1/plugin/animate/plugin.js',
      '/libs/reveal.js/6.0.1/plugin/menu/menu.css',
      '/libs/reveal.js/6.0.1/plugin/menu/font-awesome/css/all.css',
      '/libs/reveal.js/6.0.1/plugin/menu/font-awesome/css/v4-shims.min.css',
      '/libs/reveal.js/6.0.1/plugin/chalkboard/img/blackboard.png',
      '/libs/reveal.js/6.0.1/plugin/chalkboard/img/boardmarker-black.png',
      '/libs/reveal.js/6.0.1/plugin/chalkboard/img/chalk-white.png',
    ]

    for (const asset of pluginAssets) {
      const response = await request(server.app).get(asset)
      expect(response.status).toBe(200)
    }

    server.dispose()
    context.dispose()
  })

  test('loads init.js content when present in markdown folder', async () => {
    const dirname = await fs.mkdtemp(path.join(os.tmpdir(), tempDirectoryPrefix))
    let context: RevealContext | undefined
    let server: RevealServer | undefined
    try {
      const initPath = path.join(dirname, 'init.js')
      await fs.writeFile(initPath, 'window.testInitLoaded = true;')
      context = createContext({ dirname })
      server = new RevealServer(context)
      const response = await request(server.app).get('/')

      expect(response.status).toEqual(200)
      expect(response.text).toContain('window.testInitLoaded = true;')
    } finally {
      server?.dispose()
      context?.dispose()
      await fs.rm(dirname, { recursive: true, force: true })
    }
  })

  test('loads init.esm.js as a module when present in markdown folder', async () => {
    const dirname = await fs.mkdtemp(path.join(os.tmpdir(), tempDirectoryPrefix))
    let context: RevealContext | undefined
    let server: RevealServer | undefined
    try {
      const initPath = path.join(dirname, 'init.esm.js')
      await fs.writeFile(initPath, moduleInitSource)
      context = createContext({ dirname })
      server = new RevealServer(context)
      const response = await request(server.app).get('/')

      expect(response.status).toEqual(200)
      expect(response.text).toContain('<script type="module" src="init.esm.js"></script>')
      expect(response.text).not.toContain(moduleInitSource)
    } finally {
      server?.dispose()
      context?.dispose()
      await fs.rm(dirname, { recursive: true, force: true })
    }
  })

  test('prefers init.esm.js over init.js when both are present', async () => {
    const dirname = await fs.mkdtemp(path.join(os.tmpdir(), tempDirectoryPrefix))
    let context: RevealContext | undefined
    let server: RevealServer | undefined
    try {
      await fs.writeFile(path.join(dirname, 'init.js'), 'window.legacyInitLoaded = true;')
      await fs.writeFile(path.join(dirname, 'init.esm.js'), moduleInitSource)
      context = createContext({ dirname })
      server = new RevealServer(context)
      const response = await request(server.app).get('/')

      expect(response.status).toEqual(200)
      expect(response.text).toContain('<script type="module" src="init.esm.js"></script>')
      expect(response.text).not.toContain('window.legacyInitLoaded = true;')
    } finally {
      server?.dispose()
      context?.dispose()
      await fs.rm(dirname, { recursive: true, force: true })
    }
  })

  test('export middleware calls onExportError when exporter fails', async () => {
    const onExportError = jest.fn()
    const context = createContext({ inExport: true, onExportError })
    const server = new RevealServer(context)
    const exporter = jest.fn(async () => {
      throw new Error('boom')
    })
    type TestRequest = { originalUrl: string }
    type TestResponse = { write: (chunk: string) => boolean; end: (chunk: string) => boolean | Promise<boolean> }
    type ExportMiddleware = (req: TestRequest, res: TestResponse, next: () => void) => Promise<void>
    const middleware = (server as unknown as {
      exportMiddleware: (exportFn: typeof exporter, isInExport: () => boolean) => ExportMiddleware
    }).exportMiddleware(exporter, () => true)
    const next = jest.fn()
    const req = { originalUrl: '/index.html?x=1' }
    const res: TestResponse = {
      write: jest.fn((_chunk: string) => true),
      end: jest.fn((_chunk: string) => true),
    }

    await middleware(req, res, next)
    await res.write('<html>')
    await res.end('</html>')

    expect(next).toHaveBeenCalledTimes(1)
    expect(exporter).toHaveBeenCalledTimes(1)
    expect(onExportError).toHaveBeenCalledTimes(1)
    expect(onExportError.mock.calls[0][0]).toBeInstanceOf(Error)

    server.dispose()
    context.dispose()
  })
})
