import { DiagnosticSeverity, Position, Range, workspace } from 'vscode'
import { collectDiagnostics } from '../../FrontmatterDiagnostics'
import { ConfigurationDescription, defaultConfiguration } from '../../Configuration'

const configDesc: ConfigurationDescription[] = [
  { label: 'theme', detail: '', documentation: '', type: 'string', values: ['black', 'white'] },
  { label: 'transition', detail: '', documentation: '', type: 'string', values: ['slide', 'fade'] },
  { label: 'css', detail: '', documentation: '', type: 'array' },
]

const createDoc = (text: string) => {
  const lines = text.split('\n')
  return {
    uri: { path: '/tmp/demo.md' },
    getText: () => text,
    lineCount: lines.length,
    lineAt: (line: number) => ({ text: lines[line] ?? '' })
  }
}

const createContext = (text: string, overrides?: Record<string, unknown>): any => ({
  editor: { document: createDoc(text) },
  parseError: undefined,
  frontmatter: { attributes: {} },
  configuration: defaultConfiguration,
  dirname: '/tmp',
  resolveLocalAssetPath: (assetPath: string | null | undefined, appendCssIfMissing = false) => {
    if (!assetPath) return null
    const basePath = `/tmp/${assetPath}`
    return appendCssIfMissing && !basePath.includes('.') ? `${basePath}.css` : basePath
  },
  ...overrides
})

test('collectDiagnostics reports unsupported front matter key and invalid enum', async () => {
  const text = `---\nunsupportedKey: true\ntheme: "purple"\n---\n# Slide`
  const context = createContext(text, {
    frontmatter: { attributes: { unsupportedKey: true, theme: 'purple' } }
  })
  const configByKey = new Map(configDesc.map((d) => [d.label, d]))

  const diagnostics = await collectDiagnostics(context, configByKey)
  expect(diagnostics).toHaveLength(2)
  expect(diagnostics[0].message).toContain('Unsupported front matter key')
  expect(diagnostics[1].message).toContain('Invalid value "purple"')
})

test('collectDiagnostics reports parse error as an error diagnostic', async () => {
  const context = createContext('---\n: bad yaml', {
    parseError: { message: 'bad indentation', line: 1, column: 2 }
  })
  const configByKey = new Map(configDesc.map((d) => [d.label, d]))

  const diagnostics = await collectDiagnostics(context, configByKey)
  expect(diagnostics).toHaveLength(1)
  expect(diagnostics[0].severity).toBe(DiagnosticSeverity.Error)
  expect(diagnostics[0].range).toEqual(new Range(new Position(1, 2), new Position(1, 3)))
})

test('collectDiagnostics ignores css checks when css is not an array', async () => {
  jest.spyOn(workspace.fs, 'stat').mockRejectedValue(new Error('not found'))

  const text = `---\ncss: "bad.css"\n---\n# Slide`
  const context = createContext(text, {
    frontmatter: { attributes: { css: 'bad.css' } },
    configuration: { ...defaultConfiguration, css: 'bad.css' }
  })
  const configByKey = new Map(configDesc.map((d) => [d.label, d]))

  const diagnostics = await collectDiagnostics(context, configByKey)
  expect(diagnostics).toHaveLength(1)
  expect(diagnostics[0].message).toContain('Invalid value type for "css"')
})

test('collectDiagnostics accepts boolean and string for slideNumber union type', async () => {
  const unionConfigDesc: ConfigurationDescription[] = [
    { label: 'slideNumber', detail: '', documentation: '', type: ['boolean', 'string'] },
  ]
  const configByKey = new Map(unionConfigDesc.map((d) => [d.label, d]))

  const boolContext = createContext('---\nslideNumber: true\n---\n# Slide', {
    frontmatter: { attributes: { slideNumber: true } }
  })
  expect(await collectDiagnostics(boolContext, configByKey)).toHaveLength(0)

  const strContext = createContext('---\nslideNumber: h/v\n---\n# Slide', {
    frontmatter: { attributes: { slideNumber: 'h/v' } }
  })
  expect(await collectDiagnostics(strContext, configByKey)).toHaveLength(0)

  const numContext = createContext('---\nslideNumber: 5\n---\n# Slide', {
    frontmatter: { attributes: { slideNumber: 5 } }
  })
  const numDiag = await collectDiagnostics(numContext, configByKey)
  expect(numDiag).toHaveLength(1)
  expect(numDiag[0].message).toContain('Expected boolean or string')
})

test('collectDiagnostics accepts null and number for pdfMaxPagesPerSlide union type', async () => {
  const unionConfigDesc: ConfigurationDescription[] = [
    { label: 'pdfMaxPagesPerSlide', detail: '', documentation: '', type: ['number', 'null'] },
  ]
  const configByKey = new Map(unionConfigDesc.map((d) => [d.label, d]))

  const nullContext = createContext('---\npdfMaxPagesPerSlide: null\n---\n# Slide', {
    frontmatter: { attributes: { pdfMaxPagesPerSlide: null } }
  })
  expect(await collectDiagnostics(nullContext, configByKey)).toHaveLength(0)

  const numContext = createContext('---\npdfMaxPagesPerSlide: 3\n---\n# Slide', {
    frontmatter: { attributes: { pdfMaxPagesPerSlide: 3 } }
  })
  expect(await collectDiagnostics(numContext, configByKey)).toHaveLength(0)

  const strContext = createContext('---\npdfMaxPagesPerSlide: "bad"\n---\n# Slide', {
    frontmatter: { attributes: { pdfMaxPagesPerSlide: 'bad' } }
  })
  const strDiag = await collectDiagnostics(strContext, configByKey)
  expect(strDiag).toHaveLength(1)
  expect(strDiag[0].message).toContain('Expected number or null')
})
