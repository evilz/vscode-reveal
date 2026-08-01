import markdownit, { createMarkdownIt } from '../../Markdown-it'
import pako from 'pako'

const getDiagramSource = (html: string): string => {
  const encoded = html.match(/\/svg\/([^"']+)/)?.[1]
  if (!encoded) throw new Error('Expected a Kroki diagram URL')
  const compressed = Buffer.from(encoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
  return Buffer.from(pako.inflate(compressed)).toString('utf8')
}

describe('Markdown-it diagram server configuration', () => {
  test('uses the configured diagram server base URL', () => {
    const markdownit = createMarkdownIt({ serverBaseUrl: 'http://localhost:8000/' })

    const html = markdownit.render('```mermaid\nflowchart LR\nA-->B\n```')

    expect(html).toContain('src="http://localhost:8000/mermaid/svg/')
  })

  test('maps dot fences to Kroki Graphviz diagrams', () => {
    const markdownit = createMarkdownIt({ serverBaseUrl: 'https://kroki.example' })

    const html = markdownit.render('```dot\ndigraph example { A -> B }\n```')

    expect(html).toContain('class="dot"')
    expect(html).toContain('src="https://kroki.example/graphviz/svg/')
  })

  test('falls back to a local code block when diagram rendering is disabled', () => {
    const markdownit = createMarkdownIt({ enabled: false })

    const html = markdownit.render('```plantuml\nAlice -> Bob: hello\n```')

    expect(html).toContain('<pre><code class="language-plantuml">')
    expect(html).toContain('Alice -&gt; Bob: hello')
    expect(html).not.toContain('<img class="plantuml"')
  })

  test('trims server base URL and falls back to default when empty', () => {
    const markdownit = createMarkdownIt({ serverBaseUrl: '   ' })
    const html = markdownit.render('```mermaid\nflowchart LR\nA-->B\n```')
    expect(html).toContain('src="https://kroki.io/mermaid/svg/')
  })

  test('uses Mermaid dark mode for dark Reveal themes without overriding an author directive', () => {
    const markdownit = createMarkdownIt({ mermaidTheme: 'dark' })

    const themedHtml = markdownit.render('```mermaid\nflowchart LR\nA-->B\n```')
    const explicitHtml = markdownit.render("```mermaid\n%%{init: {'theme':'forest'}}%%\nflowchart LR\nA-->B\n```")

    expect(getDiagramSource(themedHtml)).toBe("%%{init: {'theme':'dark'}}%%\nflowchart LR\nA-->B\n")
    expect(getDiagramSource(explicitHtml)).toBe("%%{init: {'theme':'forest'}}%%\nflowchart LR\nA-->B\n")
  })

  test('keeps diagram rendering configuration isolated between renderers', async () => {
    const darkRenderer = createMarkdownIt({ serverBaseUrl: 'https://dark.example', mermaidTheme: 'dark' })
    const disabledRenderer = createMarkdownIt({ enabled: false, serverBaseUrl: 'https://disabled.example' })
    const source = '```mermaid\nflowchart LR\nA-->B\n```'

    const [darkHtml, disabledHtml] = await Promise.all([
      Promise.resolve().then(() => darkRenderer.render(source)),
      Promise.resolve().then(() => disabledRenderer.render(source)),
    ])

    expect(darkHtml).toContain('src="https://dark.example/mermaid/svg/')
    expect(getDiagramSource(darkHtml)).toBe("%%{init: {'theme':'dark'}}%%\nflowchart LR\nA-->B\n")
    expect(disabledHtml).toContain('<pre><code class="language-mermaid">')
    expect(disabledHtml).not.toContain('dark.example')
  })

  test('renders regular markdown syntax and speaker notes conversion', () => {
    const html = markdownit.render('Paragraph text\n\nnote: this is speaker only')
    expect(html).toContain('<p>Paragraph text</p>')
    expect(html).toContain('<aside class="notes"> this is speaker only</aside>')
  })

  test('preserves escaped braces in inline LaTeX expressions', () => {
    const html = markdownit.render('$\\{x\\}$')
    expect(html).toContain('$\\{x\\}$')
  })

  test('preserves inline math spanning an escaped dollar sign', () => {
    const html = markdownit.render('$a \\$ b$')
    expect(html).toContain('$a \\$ b$')
  })

  test('preserves inline math when closing delimiter follows even number of backslashes', () => {
    const html = markdownit.render('$x\\\\$')
    expect(html).toContain('$x\\\\$')
  })
})
