jest.mock('vscode', () => ({}))

import { createPresentationHtml, renderSlides } from '../../web/extension'

describe('web extension preview', () => {
  test('renders front matter and horizontal Markdown slides', () => {
    const slides = renderSlides('---\ntitle: Demo\n---\n# First\n\n---\n## Second')

    expect(slides).toContain('<h1>First</h1>')
    expect(slides).toContain('<h2>Second</h2>')
    expect(slides).not.toContain('title: Demo')
  })

  test('uses supplied webview URIs for Reveal assets and local document references', () => {
    const html = createPresentationHtml('# Demo', (asset) => `webview://${asset}`, 'webview://workspace/slides')

    expect(html).toContain('<base href="webview://workspace/slides/">')
    expect(html).toContain('webview://libs/reveal.js/6.0.1/reveal.js')
    expect(html).toContain('Reveal.initialize')
  })
})
