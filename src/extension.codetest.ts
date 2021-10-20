import * as assert from 'assert'
import * as vscode from 'vscode'

suite('Extension Tests', function () {
  this.timeout(25000)

  test('Should start extension @integration', async () => {
    const testDocument = await vscode.workspace.openTextDocument('../sample.md')
    await sleep(2000)

    const vscodereveal = vscode.extensions.getExtension('evilz.vscode-reveal')

    //vscodereveal!.should.exist('vscode extension')

    const started = vscodereveal!.isActive
    assert.equal(started, true)
  })
})

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
