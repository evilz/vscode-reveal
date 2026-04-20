import { Position } from 'vscode'
import TextDecorator from '../../TextDecorator'
import { ConfigurationDescription } from '../../Configuration'

const makeEditor = (text: string) => {
  const document = {
    getText: jest.fn(() => text),
    positionAt: jest.fn((offset: number) => new Position(0, offset)),
  }

  const setDecorations = jest.fn()
  const editor = {
    document,
    setDecorations,
  }

  return { editor, document, setDecorations }
}

describe('TextDecorator', () => {
  const configDesc: ConfigurationDescription[] = [
    {
      label: 'title',
      detail: 'Presentation title',
      documentation: 'Shown in browser tab and exported HTML metadata.',
      type: 'string',
    },
    {
      label: 'theme',
      detail: 'Reveal theme',
      documentation: 'Theme for slide deck styling.',
      type: 'string',
      values: ['black', 'white'],
    },
  ]

  test('adds decorations for matching frontmatter keys with hover metadata', () => {
    const { editor, setDecorations } = makeEditor('title: Demo\ntheme: black\nunknown: true\n')
    const decorator = new TextDecorator(configDesc)

    decorator.update(editor as never)

    expect(setDecorations).toHaveBeenCalledTimes(1)
    const [, decorations] = setDecorations.mock.calls[0]
    expect(decorations).toHaveLength(2)
    expect(decorations[0].hoverMessage).toEqual(expect.objectContaining({ isTrusted: true, supportThemeIcons: true }))
    expect(decorations[1].hoverMessage).toEqual(expect.objectContaining({ isTrusted: true, supportThemeIcons: true }))
  })

  test('sets empty decorations when no configured keys are present', () => {
    const { editor, setDecorations } = makeEditor('foo: 1\nbar: 2\n')
    const decorator = new TextDecorator(configDesc)

    decorator.update(editor as never)

    expect(setDecorations).toHaveBeenCalledTimes(1)
    const [, decorations] = setDecorations.mock.calls[0]
    expect(decorations).toEqual([])
  })
})
