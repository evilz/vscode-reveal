import { createMarkdownIt } from '../../Markdown-it'

describe('presentation Markdown table rendering', () => {
  test('renders multiline table rows as block content within each cell', () => {
    const markdown = createMarkdownIt()

    const rendered = markdown.render(`| Markdown | Rendered HTML |
|----------|---------------|
| - Item 1 | - Item 1      | \\
| - Item 2 | - Item 2      |`)

    expect(rendered).toContain('<ul>\n<li>Item 1</li>\n<li>Item 2</li>\n</ul>')
    expect(rendered).not.toContain('<td>\\</td>')
  })

  test('merges cells marked as continuing the row above', () => {
    const markdown = createMarkdownIt()

    const rendered = markdown.render(`Stage | Direct Products | ATP Yields
----: | --------------: | ---------:
Glycolysis | 2 ATP ||
^^ | 2 NADH | 3--5 ATP |`)

    expect(rendered).toContain('<td style="text-align:right" rowspan="2">Glycolysis</td>')
    expect(rendered).not.toContain('^^')
  })

  test('renders tables without a header row', () => {
    const markdown = createMarkdownIt()

    const rendered = markdown.render(`|--|--|--|--|--|--|--|--|
|♜|  |♝|♛|♚|♝|♞|♜|
|  |♟|♟|♟|  |♟|♟|♟|`)

    expect(rendered).toContain('<td>♜</td>')
    expect(rendered).toContain('<td>♟</td>')
    expect(rendered).not.toContain('<th>')
  })
})
