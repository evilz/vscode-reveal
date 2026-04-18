import { getConfigurationDescription } from '../../Configuration'

test('getConfigurationDescription should prefer primary type over null in unions', () => {
  const props = {
    'revealjs.boolOption': {
      type: ['boolean', 'null'],
      default: false,
      description: 'Boolean option'
    },
    'revealjs.stringOption': {
      type: ['string', 'null'],
      default: 'value',
      description: 'String option'
    }
  }

  const desc = getConfigurationDescription(props)
  expect(desc.find((x) => x.label === 'boolOption')?.type).toBe('boolean')
  expect(desc.find((x) => x.label === 'stringOption')?.type).toBe('string')
})

test('getConfigurationDescription should prefer scalar types over object-like union members', () => {
  const props = {
    'revealjs.stringOrObject': {
      type: ['object', 'string'],
      description: 'String/object option'
    },
    'revealjs.numberOrArray': {
      type: ['array', 'number'],
      description: 'Number/array option'
    }
  }

  const desc = getConfigurationDescription(props)
  expect(desc.find((x) => x.label === 'stringOrObject')?.type).toBe('string')
  expect(desc.find((x) => x.label === 'numberOrArray')?.type).toBe('number')
})

test('getConfigurationDescription should keep markdown documentation when available', () => {
  const props = {
    'revealjs.richDoc': {
      type: 'string',
      default: 'x',
      description: 'Plain text',
      markdownDescription: '**Rich** text'
    }
  }

  const [desc] = getConfigurationDescription(props)
  expect(desc.label).toBe('richDoc')
  expect(desc.detail).toBe('Plain text')
  expect(desc.documentation).toBe('**Rich** text')
})
