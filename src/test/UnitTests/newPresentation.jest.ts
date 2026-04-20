import { Uri, window, workspace } from 'vscode'
import { createPresentationFromTemplate, getTemplateChoices, scaffoldTemplate } from '../../commands/newPresentation'
import * as path from 'path'
import * as os from 'os'

test('new presentation templates include required starter options', () => {
  const labels = getTemplateChoices().map((choice) => choice.label)

  expect(labels).toContain('Minimal')
  expect(labels).toContain('Code-heavy')
  expect(labels).toContain('Speaker notes')
})

test('custom theme scaffold creates a markdown css reference and support file', () => {
  const targetUri = { fsPath: '/tmp/demo.md' } as Uri
  const scaffold = scaffoldTemplate('Custom theme', targetUri)

  expect(scaffold).toBeTruthy()
  expect(scaffold?.content).toContain('css:')
  expect(scaffold?.content).toContain('presentation.css')
  expect(scaffold?.supportFiles).toHaveLength(1)
  expect(scaffold?.supportFiles[0].filename).toBe('presentation.css')
})

test('scaffoldTemplate returns null for an unknown template', () => {
  const targetUri = { fsPath: '/tmp/demo.md' } as Uri
  expect(scaffoldTemplate('Missing template', targetUri)).toBeNull()
})

test('createPresentationFromTemplate writes support file and opens created markdown file', async () => {
  const vscodeModule = require('vscode') as typeof import('vscode')
  const makeUri = (filepath: string) => Object.assign(Uri.file(filepath), { fsPath: filepath })
  const previousShowQuickPick = (window as any).showQuickPick
  const previousShowSaveDialog = (window as any).showSaveDialog
  const previousShowInformationMessage = (window as any).showInformationMessage
  const previousWorkspaceFs = (workspace as any).fs
  const previousWorkspaceFolders = (workspace as any).workspaceFolders
  const previousCommands = (vscodeModule as any).commands
  const previousJoinPath = (vscodeModule as any).Uri.joinPath

  const showQuickPickSpy = jest.fn().mockResolvedValue({ label: 'Custom theme', description: '' })
  const targetUri = makeUri(path.join(os.tmpdir(), 'demo.md'))
  const showSaveDialogSpy = jest.fn().mockResolvedValue(targetUri)
  const infoSpy = jest.fn().mockResolvedValue(undefined)
  try {
    ;(window as any).showQuickPick = showQuickPickSpy
    ;(window as any).showSaveDialog = showSaveDialogSpy
    ;(window as any).showInformationMessage = infoSpy

    const writeFileSpy = jest.fn().mockResolvedValue(undefined)
    const execSpy = jest.fn().mockResolvedValue(undefined)
    ;(workspace as any).fs = { writeFile: writeFileSpy }
    ;(workspace as any).workspaceFolders = undefined
    ;(vscodeModule as any).commands = { executeCommand: execSpy }
    ;(vscodeModule as any).Uri.joinPath = (base: Uri, ...segments: string[]) => makeUri(path.join((base as any).fsPath, ...segments))

    await createPresentationFromTemplate()

    expect(showQuickPickSpy).toHaveBeenCalledTimes(1)
    expect(showSaveDialogSpy).toHaveBeenCalledTimes(1)
    expect(writeFileSpy).toHaveBeenCalledTimes(2)
    expect(writeFileSpy.mock.calls[0][0].fsPath).toContain('presentation.css')
    expect(writeFileSpy.mock.calls[1][0].fsPath).toBe(targetUri.fsPath)
    expect(execSpy).toHaveBeenCalledWith('vscode.open', expect.objectContaining({ fsPath: targetUri.fsPath }))
    expect(infoSpy).toHaveBeenCalledWith('Created presentation: demo.md')
  } finally {
    ;(window as any).showQuickPick = previousShowQuickPick
    ;(window as any).showSaveDialog = previousShowSaveDialog
    ;(window as any).showInformationMessage = previousShowInformationMessage
    ;(workspace as any).fs = previousWorkspaceFs
    ;(workspace as any).workspaceFolders = previousWorkspaceFolders
    ;(vscodeModule as any).commands = previousCommands
    ;(vscodeModule as any).Uri.joinPath = previousJoinPath
  }

})
