import * as fs from 'fs'
import * as path from 'path'

const workspaceRoot = path.resolve(__dirname, '../../..')
const revealPath = path.join(workspaceRoot, 'libs/reveal.js/6.0.1/reveal.js')
const emptyTemplateLiteral = String.fromCharCode(96, 96)

describe('bundled Reveal background transitions', () => {
  test('does not include missing background attributes in the transition hash', () => {
    const source = fs.readFileSync(revealPath, 'utf8')

    expect(source).toContain('(r.background??' + emptyTemplateLiteral + ')')
    expect(source).toContain('(r.backgroundTransition??' + emptyTemplateLiteral + ')')
    expect(source).not.toContain('r.background+r.backgroundSize+r.backgroundImage+r.backgroundVideo+r.backgroundIframe+r.backgroundColor+r.backgroundGradient+r.backgroundRepeat+r.backgroundPosition+r.backgroundTransition+r.backgroundOpacity')
  })
})
