import { Uri } from 'vscode'
import { getTemplateChoices, scaffoldTemplate } from '../../commands/newPresentation'

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
