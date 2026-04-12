import { DiagnosticSeverity, Position, Range } from 'vscode'
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
    lineAt: (line: number) => ({ text: lines[line] ?? '' })
  }
}

const createContext = (text: string, overrides?: Record<string, unknown>): any => ({
  editor: { document: createDoc(text) },
  parseError: undefined,
  frontmatter: { attributes: {} },
  configuration: defaultConfiguration,
  dirname: '/tmp',
  ...overrides
})

test('collectDiagnostics reports unsupported front matter key and invalid enum', () => {
  const text = `---\nunsupportedKey: true\ntheme: "purple"\n---\n# Slide`
  const context = createContext(text, {
    frontmatter: { attributes: { unsupportedKey: true, theme: 'purple' } }
  })

  const diagnostics = collectDiagnostics(context, configDesc)
  expect(diagnostics).toHaveLength(2)
  expect(diagnostics[0].message).toContain('Unsupported front matter key')
  expect(diagnostics[1].message).toContain('Invalid value "purple"')
})

test('collectDiagnostics reports parse error as an error diagnostic', () => {
  const context = createContext('---\n: bad yaml', {
    parseError: { message: 'bad indentation', line: 1, column: 2 }
  })

  const diagnostics = collectDiagnostics(context, configDesc)
  expect(diagnostics).toHaveLength(1)
  expect(diagnostics[0].severity).toBe(DiagnosticSeverity.Error)
  expect(diagnostics[0].range).toEqual(new Range(new Position(1, 2), new Position(1, 3)))
})
