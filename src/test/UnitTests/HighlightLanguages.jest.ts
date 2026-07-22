import * as fs from 'fs'
import * as path from 'path'
import * as vm from 'vm'

const workspaceRoot = path.resolve(__dirname, '../../..')
const languagesPath = path.join(workspaceRoot, 'libs/reveal.js/6.0.1/plugin/vscode-reveal-languages.js')

describe('additional Highlight.js languages', () => {
  test('registers SPARQL and Turtle grammars with the bundled Reveal highlighter API', () => {
    type Language = { name: string; aliases: string[]; keywords: { keyword: string }; contains: unknown[] }
    const languages = new Map<string, (api: unknown) => Language>()
    const highlighter = {
      registerLanguage: (name: string, definition: (api: unknown) => Language) => languages.set(name, definition),
    }
    const window = { RevealHighlight: () => ({ hljs: highlighter }) }
    vm.runInNewContext(fs.readFileSync(languagesPath, 'utf8'), { window })

    expect(languages.get('sparql')).toBeDefined()
    expect(languages.get('turtle')).toBeDefined()

    const api = { C_LINE_COMMENT_MODE: {}, C_BLOCK_COMMENT_MODE: {}, QUOTE_STRING_MODE: {}, APOS_STRING_MODE: {} }
    const sparql = languages.get('sparql')!(api)
    const turtle = languages.get('turtle')!(api)

    expect(sparql.aliases).toContain('rq')
    expect(sparql.keywords.keyword).toContain('SELECT')
    expect(turtle.aliases).toContain('ttl')
    expect(turtle.keywords.keyword).toContain('@prefix')
  })
})
