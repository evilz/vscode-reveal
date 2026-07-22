import markdownit, { setDiagramRenderingConfig } from '../../Markdown-it'
import pako from 'pako'

const getDiagramSource = (html: string): string => {
  const encoded = html.match(/\/svg\/([^"']+)/)?.[1]
  if (!encoded) throw new Error('Expected a Kroki diagram URL')
  const compressed = Buffer.from(encoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
  return Buffer.from(pako.inflate(compressed)).toString('utf8')
}

describe('Markdown-it diagram server configuration', () => {
  afterEach(() => {
    setDiagramRenderingConfig({ enabled: true, serverBaseUrl: 'https://kroki.io', mermaidTheme: null })
  })

  test('uses the configured diagram server base URL', () => {
    setDiagramRenderingConfig({ serverBaseUrl: 'http://localhost:8000/' })

    const html = markdownit.render('```mermaid\nflowchart LR\nA-->B\n```')

    expect(html).toContain('src="http://localhost:8000/mermaid/svg/')
  })

  test('falls back to a local code block when diagram rendering is disabled', () => {
    setDiagramRenderingConfig({ enabled: false })

    const html = markdownit.render('```plantuml\nAlice -> Bob: hello\n```')

    expect(html).toContain('<pre><code class="language-plantuml">')
    expect(html).toContain('Alice -&gt; Bob: hello')
    expect(html).not.toContain('<img class="plantuml"')
  })

  test('trims server base URL and falls back to default when empty', () => {
    setDiagramRenderingConfig({ serverBaseUrl: '   ' })
    const html = markdownit.render('```mermaid\nflowchart LR\nA-->B\n```')
    expect(html).toContain('src="https://kroki.io/mermaid/svg/')
  })

  test('uses Mermaid dark mode for dark Reveal themes without overriding an author directive', () => {
    setDiagramRenderingConfig({ mermaidTheme: 'dark' })

    const themedHtml = markdownit.render('```mermaid\nflowchart LR\nA-->B\n```')
    const explicitHtml = markdownit.render("```mermaid\n%%{init: {'theme':'forest'}}%%\nflowchart LR\nA-->B\n```")

    expect(getDiagramSource(themedHtml)).toBe("%%{init: {'theme':'dark'}}%%\nflowchart LR\nA-->B\n")
    expect(getDiagramSource(explicitHtml)).toBe("%%{init: {'theme':'forest'}}%%\nflowchart LR\nA-->B\n")
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
