// import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
test('Should start extension @integration', async () => {
    await vscode.workspace.openTextDocument('../sample.md')
    await sleep(2000)

    const vscodereveal = vscode.extensions.getExtension('evilz.vscode-reveal')

    // vscodereveal!.should.exist('vscode extension')

    const started = vscodereveal!.isActive
    expect(started).toBeTruthy();
});


async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
