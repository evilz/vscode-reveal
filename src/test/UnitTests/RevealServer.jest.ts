import { RevealServer } from '../../RevealServer'
import Logger, { LogLevel } from '../../Logger'
import { defaultConfiguration } from '../../Configuration'
import request from 'supertest'
import { RevealContext } from '../../RevealContext'
import { TextEditor } from 'vscode'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as os from 'os'

const createContext = (options?: { inExport?: boolean; dirname?: string; onExportError?: (error: unknown) => void }) => {
  const logger = new Logger(() => undefined, LogLevel.Error)
  const inExport = options?.inExport ?? false
  const fileName = path.join(options?.dirname ?? os.tmpdir(), 'deck.md')
  return new RevealContext(
    { document: { fileName } } as TextEditor,
    logger,
    () => defaultConfiguration,
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

  test('loads init.js content when present in markdown folder', async () => {
    const dirname = await fs.mkdtemp(path.join(os.tmpdir(), 'vscode-reveal-'))
    const initPath = path.join(dirname, 'init.js')
    await fs.writeFile(initPath, 'window.testInitLoaded = true;')
    const context = createContext({ dirname })
    const server = new RevealServer(context)
    try {
      const response = await request(server.app).get('/')

      expect(response.status).toEqual(200)
      expect(response.text).toContain('window.testInitLoaded = true;')
    } finally {
      server.dispose()
      context.dispose()
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
    const middleware = (server as any).exportMiddleware(exporter, () => true) as (
      req: any,
      res: any,
      next: () => void
    ) => Promise<void>
    const next = jest.fn()
    const req = { originalUrl: '/index.html?x=1' }
    const res = {
      write: jest.fn(() => true),
      end: jest.fn(() => true),
    }

    await middleware(req, res, next)
    await (res.write as any)('<html>')
    await (res.end as any)('</html>')

    expect(next).toHaveBeenCalledTimes(1)
    expect(exporter).toHaveBeenCalledTimes(1)
    expect(onExportError).toHaveBeenCalledTimes(1)
    expect(onExportError.mock.calls[0][0]).toBeInstanceOf(Error)

    server.dispose()
    context.dispose()
  })
})
