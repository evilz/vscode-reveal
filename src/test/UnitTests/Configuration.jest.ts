import { defaultConfiguration, configPrefix, getConfigurationDescription } from '../../Configuration'

const packageJson = require('../../../package.json')

type ContributedProperty = {
  type?: unknown
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

test('getConfigurationDescription preserves union types as arrays in configuration description', () => {
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
  expect(desc.find((x) => x.label === 'boolOption')?.type).toEqual(['boolean', 'null'])
  expect(desc.find((x) => x.label === 'stringOption')?.type).toEqual(['string', 'null'])
})

test('getConfigurationDescription preserves order of types in union', () => {
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
  expect(desc.find((x) => x.label === 'stringOrObject')?.type).toEqual(['object', 'string'])
  expect(desc.find((x) => x.label === 'numberOrArray')?.type).toEqual(['array', 'number'])
})

test('getConfigurationDescription preserves all scalar types in union without reordering', () => {
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
  expect(desc.find((x) => x.label === 'numberThenString')?.type).toEqual(['number', 'string'])
  expect(desc.find((x) => x.label === 'booleanThenNumber')?.type).toEqual(['boolean', 'number'])
})

test('contributed reveal config exposes slide-number formats and PDF export options', () => {
  expect(contributedProperties['revealjs.slideNumber'].type).toEqual(['boolean', 'string'])
  expect(contributedProperties['revealjs.pdfSeparateFragments'].default).toBe(true)
  expect(contributedProperties['revealjs.pdfMaxPagesPerSlide'].type).toEqual(['number', 'null'])
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
