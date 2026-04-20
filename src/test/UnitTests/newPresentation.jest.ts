import { Uri, window, workspace } from 'vscode'
import { createPresentationFromTemplate, getTemplateChoices, scaffoldTemplate } from '../../commands/newPresentation'

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
  const showQuickPickSpy = jest.fn().mockResolvedValue({ label: 'Custom theme', description: '' })
  const showSaveDialogSpy = jest.fn().mockResolvedValue({ fsPath: '/tmp/demo.md' } as Uri)
  const infoSpy = jest.fn().mockResolvedValue(undefined)
  ;(window as any).showQuickPick = showQuickPickSpy
  ;(window as any).showSaveDialog = showSaveDialogSpy
  ;(window as any).showInformationMessage = infoSpy

  const writeFileSpy = jest.fn().mockResolvedValue(undefined)
  const execSpy = jest.fn().mockResolvedValue(undefined)
  ;(workspace as any).fs = { writeFile: writeFileSpy }
  ;(workspace as any).workspaceFolders = undefined
  ;(require('vscode') as any).commands = { executeCommand: execSpy }
  ;(require('vscode') as any).Uri.joinPath = (base: Uri, ...segments: string[]) => ({ fsPath: [base.fsPath, ...segments].join('/') })

  await createPresentationFromTemplate()

  expect(showQuickPickSpy).toHaveBeenCalledTimes(1)
  expect(showSaveDialogSpy).toHaveBeenCalledTimes(1)
  expect(writeFileSpy).toHaveBeenCalledTimes(2)
  expect(writeFileSpy.mock.calls[0][0].fsPath).toContain('presentation.css')
  expect(writeFileSpy.mock.calls[1][0].fsPath).toBe('/tmp/demo.md')
  expect(execSpy).toHaveBeenCalledWith('vscode.open', expect.objectContaining({ fsPath: '/tmp/demo.md' }))
  expect(infoSpy).toHaveBeenCalledWith('Created presentation: demo.md')

})
