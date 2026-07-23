import * as fs from 'fs'
import * as path from 'path'

const workspaceRoot = path.resolve(__dirname, '../../..')
const revealPaths = [
  path.join(workspaceRoot, 'libs/reveal.js/6.0.1/reveal.js'),
  path.join(workspaceRoot, 'libs/reveal.js/6.0.1/reveal.mjs'),
]

describe('bundled Reveal background transitions', () => {
  test('does not include missing background attributes in the transition hash', () => {
    for (const revealPath of revealPaths) {
      const source = fs.readFileSync(revealPath, 'utf8')

      expect(source).toContain('r.background')
      expect(source).toContain('r.backgroundTransition')
      expect(source).not.toContain('r.background+r.backgroundSize+r.backgroundImage+r.backgroundVideo+r.backgroundIframe+r.backgroundColor+r.backgroundGradient+r.backgroundRepeat+r.backgroundPosition+r.backgroundTransition+r.backgroundOpacity')
      expect(source).not.toContain('r.background + r.backgroundSize + r.backgroundImage + r.backgroundVideo + r.backgroundIframe + r.backgroundColor + r.backgroundGradient + r.backgroundRepeat + r.backgroundPosition + r.backgroundTransition + r.backgroundOpacity')
    }
  })
})
