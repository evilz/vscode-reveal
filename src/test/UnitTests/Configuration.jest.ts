import { defaultConfiguration, configPrefix, getConfigurationDescription } from '../../Configuration'

const packageJson = require('../../../package.json')

type ContributedProperty = {
  default?: unknown
}

const contributedProperties = packageJson.contributes.configuration.properties as Record<string, ContributedProperty>

const getContributedKey = (key: string) => key.replace(`${configPrefix}.`, '')

const contributedRevealKeys = Object.keys(contributedProperties)
  .filter((key) => key.startsWith(`${configPrefix}.`))
  .map(getContributedKey)

const runtimeKeys = Object.keys(defaultConfiguration)

// Runtime-only keys are still supported via frontmatter or internal extension behavior.
const intentionallyRuntimeOnlyKeys = [
  'author',
  'autoPlayMedia',
  'customHighlightTheme',
  'customTheme',
  'defaultTiming',
  'description',
  'display',
  'enableTitleFooter',
  'fragmentInURL',
  'logLevel',
  'logoImg',
  'notesSeparator',
  'separator',
  'verticalSeparator'
]

// VS Code-contributed keys that intentionally have no runtime defaults in this extension.
const intentionallyContributedOnlyKeys = ['hashOneBasedIndex', 'showSlideNumber']

const stringify = (value: unknown) => JSON.stringify(value)

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

test('getConfigurationDescription should enforce scalar priority regardless of union order', () => {
  const props = {
    'revealjs.numberThenString': {
      type: ['number', 'string'],
      description: 'Number/string option'
    },
    'revealjs.booleanThenNumber': {
      type: ['boolean', 'number'],
      description: 'Boolean/number option'
    }
  }

  const desc = getConfigurationDescription(props)
  expect(desc.find((x) => x.label === 'numberThenString')?.type).toBe('string')
  expect(desc.find((x) => x.label === 'booleanThenNumber')?.type).toBe('number')
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

describe('configuration contract tests', () => {
  test('runtime-only keys remain intentional and documented', () => {
    const runtimeOnlyKeys = runtimeKeys
      .filter((key) => !contributedRevealKeys.includes(key))
      .sort()

    expect(runtimeOnlyKeys).toEqual([...intentionallyRuntimeOnlyKeys].sort())
  })

  test('contributed-only keys remain intentional and documented', () => {
    const contributedOnlyKeys = contributedRevealKeys
      .filter((key) => !runtimeKeys.includes(key))
      .sort()

    expect(contributedOnlyKeys).toEqual([...intentionallyContributedOnlyKeys].sort())
  })

  test('shared keys keep aligned default values between package.json and runtime defaults', () => {
    const defaultMismatches = contributedRevealKeys
      .filter((key) => runtimeKeys.includes(key))
      .filter((key) => stringify(contributedProperties[`${configPrefix}.${key}`].default) !== stringify(defaultConfiguration[key]))

    expect(defaultMismatches).toEqual([])
  })
})
