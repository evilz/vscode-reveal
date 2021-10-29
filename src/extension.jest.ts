
import * as vscode from 'vscode'


test('Should start extension @integration', async () => {
    const testDocument = await vscode.workspace.openTextDocument('../sample.md')
    await sleep(2000)

    const vscodereveal = vscode.extensions.getExtension('evilz.vscode-reveal')

    // vscodereveal!.should.exist('vscode extension')

    const started = vscodereveal!.isActive
    expect(started).toBeTruthy();
});


async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
