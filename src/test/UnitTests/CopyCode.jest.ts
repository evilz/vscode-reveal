import * as fs from 'fs'
import * as path from 'path'
import * as vm from 'vm'

const workspaceRoot = path.resolve(__dirname, '../../..')
const copyCodePath = path.join(workspaceRoot, 'libs/reveal.js/6.0.1/plugin/copycode/copycode.js')

describe('bundled CopyCode plugin', () => {
  test('exposes the Reveal plugin factory', () => {
    const context = vm.createContext({})

    vm.runInContext(fs.readFileSync(copyCodePath, 'utf8'), context)

    const copyCode = (context as { CopyCode?: () => { id: string } }).CopyCode
    expect(copyCode).toEqual(expect.any(Function))
    expect(copyCode?.().id).toBe('copycode')
  })
})
