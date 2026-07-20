import * as path from 'path'

const parseMock = jest.fn()
const mergeConfigMock = jest.fn((workspace, document) => ({ ...workspace, ...document }))
const countLinesToSlideMock = jest.fn(() => 5)

const serverStartMock = jest.fn(() => 'http://localhost:1948/')
const serverStopMock = jest.fn()

jest.mock('../../SlideParser', () => ({
  __esModule: true,
  default: { parse: (...args: unknown[]) => (parseMock as any)(...args) },
}))

jest.mock('../../RevealServer', () => ({
  RevealServer: jest.fn().mockImplementation(() => ({
    uri: 'http://localhost:1948/',
    start: (...args: unknown[]) => (serverStartMock as any)(...args),
    stop: (...args: unknown[]) => (serverStopMock as any)(...args),
    onDidStart: jest.fn(),
    onDidStop: jest.fn(),
    dispose: jest.fn(),
  })),
}))

jest.mock('../../Configuration', () => {
  const real = jest.requireActual('../../Configuration')
  return {
    ...real,
    mergeConfig: (...args: unknown[]) => (mergeConfigMock as any)(...args),
  }
})

jest.mock('../../utils', () => ({
  countLinesToSlide: (...args: unknown[]) => (countLinesToSlideMock as any)(...args),
}))

jest.mock('vscode', () => {
  class Position {
    constructor(
      public line: number,
      public character: number,
    ) {}
    translate(deltaLine: number, deltaCharacter = 0) {
      return new Position(this.line + deltaLine, this.character + deltaCharacter)
    }
  }

  class Range {
    constructor(
      public start: Position,
      public end: Position,
    ) {}
  }

  class Selection {
    constructor(
      public anchor: Position,
      public active: Position,
    ) {}
  }

  class EventEmitter<T> {
    private listener: ((e: T) => void) | undefined
    get event() {
      return (cb: (e: T) => void) => {
        this.listener = cb
      }
    }
    fire(event: T) {
      this.listener?.(event)
    }
    dispose() {}
  }

  return { Position, Range, Selection, EventEmitter }
})

import { defaultConfiguration } from '../../Configuration'
import { LogLevel } from '../../Logger'
import { RevealContext, RevealContexts } from '../../RevealContext'

describe('RevealContext', () => {
  const makeEditor = () => ({
    document: {
      fileName: '/workspace/slides/main.md',
      uri: 'doc-uri',
      getText: jest.fn(() => '# slide'),
    },
    revealRange: jest.fn(),
    selection: undefined,
  })

  const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    LogLevel: LogLevel.Error,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('computes asset paths and uri helpers', () => {
    const editor = makeEditor()
    const context = new RevealContext(
      editor as any,
      logger as any,
      () => ({ ...defaultConfiguration, exportHTMLPath: 'dist' }),
      '/ext',
      () => false,
    )
    const slidesDir = path.dirname(editor.document.fileName)

    expect(context.dirname).toBe(slidesDir)
    expect(context.exportPath).toBe(path.join(slidesDir, 'dist'))
    expect(context.baseUri).toBe('http://localhost:1948/')

    const cssPath = context.resolveLocalAssetPath('styles/custom', true)
    const absoluteCssPath = path.join(path.sep, 'tmp', 'file.css')
    const absolutePath = context.resolveLocalAssetPath(absoluteCssPath)
    const externalPath = context.resolveLocalAssetPath('https://example.com/a.css')
    const dataPath = context.resolveLocalAssetPath('data:text/plain,hello')
    const queryPath = context.resolveLocalAssetPath('theme.css?v=1#hash')

    expect(cssPath).toBe(path.resolve(slidesDir, 'styles', 'custom.css'))
    expect(absolutePath).toBe(absoluteCssPath)
    expect(externalPath).toBeNull()
    expect(dataPath).toBeNull()
    expect(queryPath).toBe(path.resolve(slidesDir, 'theme.css'))

    context.configuration = {
      ...defaultConfiguration,
      customTheme: 'styles/site',
      css: ['a.css', ' ', 'http://cdn/style.css', 'a.css', 'data:text/plain,hello'],
    }

    expect(context.getReferencedAssetPaths()).toEqual([path.join(slidesDir, 'init.js'), path.join(slidesDir, 'init.esm.js'), path.resolve(slidesDir, 'styles', 'site.css'), path.resolve(slidesDir, 'a.css')])
  })

  test('refresh updates configuration, updates position, goToSlide and lifecycle methods', () => {
    const editor = makeEditor()
    const context = new RevealContext(
      editor as any,
      logger as any,
      () => ({ ...defaultConfiguration, logLevel: LogLevel.Warning }),
      '/ext',
      () => false,
    )

    parseMock
      .mockReturnValueOnce({
        frontmatter: { attributes: { logLevel: LogLevel.Debug }, frontmatter: true, bodyBegin: 3 },
        slides: [{}, {}],
        parseError: undefined,
      })
      .mockReturnValueOnce({
        frontmatter: { attributes: { logLevel: LogLevel.Debug }, frontmatter: true, bodyBegin: 3 },
        slides: [{ verticalChildren: ['v'] }],
        parseError: undefined,
      })
      .mockReturnValueOnce({
        frontmatter: undefined,
        slides: [{}, { verticalChildren: [1, 2] }],
        parseError: undefined,
      })

    const refreshed = context.refresh()
    expect(refreshed.slides).toHaveLength(2)
    expect(mergeConfigMock).toHaveBeenCalled()
    expect(logger.LogLevel).toBe(LogLevel.Debug)

    context.refresh()
    expect(mergeConfigMock).toHaveBeenCalledTimes(1)

    context.updatePosition({ line: 2, character: 1 } as any)

    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(12345)
    expect(context.uriWithPosition).toBe('http://localhost:1948/#/1/2/12345')
    nowSpy.mockRestore()

    context.slides = [{}, {}] as any
    context.frontmatter = { frontmatter: true, bodyBegin: 4 } as any
    context.goToSlide(1, 0)
    expect(countLinesToSlideMock).toHaveBeenCalledWith(context.slides, 1, 0)
    expect(editor.selection).toBeDefined()
    expect(editor.revealRange).toHaveBeenCalled()

    expect(context.is({ uri: 'doc-uri' } as any)).toBe(true)
    expect(context.startServer()).toBe('http://localhost:1948/')
    context.stopServer()
    expect(serverStopMock).toHaveBeenCalled()

    const onDispose = jest.fn()
    context.onDidDispose(onDispose)
    context.dispose()
    expect(onDispose).toHaveBeenCalled()
  })
})

describe('RevealContexts', () => {
  test('adds, reuses and removes contexts', () => {
    const logger = { info: jest.fn(), debug: jest.fn(), LogLevel: LogLevel.Error }
    const contexts = new RevealContexts(
      logger as any,
      () => defaultConfiguration,
      '/ext',
      () => false,
      () => {},
      () => {},
      () => {},
    )

    const editor = {
      document: {
        fileName: '/workspace/slides/main.md',
        uri: 'doc-uri',
        getText: jest.fn(() => ''),
      },
      revealRange: jest.fn(),
    }

    const context = contexts.getOrAdd(editor as any)
    const sameContext = contexts.getOrAdd(editor as any)
    expect(context).toBe(sameContext)

    contexts.remove('doc-uri' as any)
    expect(logger.info).toHaveBeenCalledWith('CONTEXT: doc-uri disposed')

    contexts.remove('unknown-uri' as any)
  })
})
