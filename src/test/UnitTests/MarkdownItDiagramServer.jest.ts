import markdownit, { setDiagramRenderingConfig } from '../../Markdown-it'

describe('Markdown-it diagram server configuration', () => {
  afterEach(() => {
    setDiagramRenderingConfig({ enabled: true, serverBaseUrl: 'https://kroki.io' })
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

  test('renders regular markdown syntax and speaker notes conversion', () => {
    const html = markdownit.render('Paragraph text\n\nnote: this is speaker only')
    expect(html).toContain('<p>Paragraph text</p>')
    expect(html).toContain('<aside class="notes"> this is speaker only</aside>')
  })
})
