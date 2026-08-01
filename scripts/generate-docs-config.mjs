import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const properties = manifest.contributes?.configuration?.properties ?? {}
const configPrefix = 'revealjs'
const contributedOnlyFrontMatterExclusions = new Set(['hashOneBasedIndex', 'showSlideNumber'])
const frontMatterOnlyProperties = {
  author: { type: 'string', default: '', description: 'Presentation author metadata.' },
  autoPlayMedia: { type: 'boolean', default: false, description: 'Automatically start embedded media.' },
  customHighlightTheme: { type: ['string', 'null'], default: null, description: 'Path or URL to a custom highlight theme file.' },
  customTheme: { type: ['string', 'null'], default: null, description: 'Path or URL to a custom Reveal.js theme file.' },
  defaultTiming: { type: 'number', default: 120, description: 'Default pacing for presentations that use timing features.' },
  description: { type: 'string', default: '', description: 'Presentation description metadata.' },
  display: { type: 'string', default: 'block', description: 'Reveal.js display mode.', enum: ['block'] },
  enableTitleFooter: { type: 'boolean', default: true, description: 'Enable the title footer plugin.' },
  fragmentInURL: { type: 'boolean', default: false, description: 'Include the current fragment in the URL.' },
  logLevel: { type: 'number', default: 3, description: 'Extension log verbosity.', enum: [0, 1, 2, 3, 4] },
  logoImg: { type: ['string', 'null'], default: null, description: 'Path or URL to a logo image.' },
  notesSeparator: { type: 'string', default: 'note:', description: 'Revealjs markdown note delimiter' },
  separator: { type: 'string', default: '^\\r?\\n---\\r?\\n$', description: 'Revealjs markdown slide separator' },
  verticalSeparator: { type: 'string', default: '^\\r?\\n--\\r?\\n$', description: 'Revealjs markdown vertical separator' }
}

const escapeTableCell = (value) => String(value).replaceAll('|', '\\|')

const describe = (value) => {
  if (value === undefined) return ''
  if (value === null) return '`null`'
  if (typeof value === 'string') return `\`${escapeTableCell(value.replaceAll('`', '\\`'))}\``
  if (typeof value === 'boolean' || typeof value === 'number') return `\`${value}\``
  return `\`${escapeTableCell(JSON.stringify(value))}\``
}

const formatType = (type) => escapeTableCell(Array.isArray(type) ? type.join(', ') : (type ?? ''))
const stripPrefix = (name) => name.startsWith(`${configPrefix}.`) ? name.slice(configPrefix.length + 1) : name

const rows = Object.entries(properties).map(([name, setting]) => {
  const type = formatType(setting.type)
  const values = setting.enum?.map((value) => `\`${value}\``).join(', ') ?? ''
  const notes = [setting.description ?? '', values ? `Values: ${values}` : ''].filter(Boolean).join(' ')
  return `| \`${name}\` | ${describe(setting.default)} | ${type} | ${notes.replaceAll('|', '\\|')} |`
})

const output = `# Configuration reference\n\nVS Code Reveal contributes settings under the \`revealjs.*\` namespace. This table is generated from \`package.json\` during the docs build.\n\n| Setting | Default | Type | Description and accepted values |\n| --- | --- | --- | --- |\n${rows.join('\n')}\n`
fs.writeFileSync(path.join(root, 'website/reference/configuration.md'), output)

const allowedValues = (setting) => {
  if (setting.enum) return setting.enum.map((value) => describe(value)).join(', ')
  const types = Array.isArray(setting.type) ? setting.type : [setting.type]
  const descriptions = types
    .filter(Boolean)
    .map((type) => ({
      boolean: '`true`, `false`',
      number: 'Any number',
      string: 'Any string',
      object: 'Object matching the setting schema',
      array: 'Array value',
      null: '`null`'
    })[type] ?? 'See the VS Code Settings UI')

  return [...new Set(descriptions)].join('; ') || 'See the VS Code Settings UI'
}

const frontMatterProperties = new Map(
  Object.entries(properties)
    .filter(([name]) => name.startsWith(`${configPrefix}.`))
    .map(([name, setting]) => [stripPrefix(name), setting])
    .filter(([name]) => !contributedOnlyFrontMatterExclusions.has(name))
)

Object.entries(frontMatterOnlyProperties).forEach(([name, setting]) => {
  frontMatterProperties.set(name, setting)
})

const frontMatterRows = [...frontMatterProperties.entries()].map(([name, setting]) => (
  `| \`${name}\` | ${describe(setting.default)} | ${formatType(setting.type)} | ${escapeTableCell(allowedValues(setting))} |`
))

const frontMatter = `# Front matter reference\n\nFront matter lets a presentation override its \`revealjs.*\` settings without changing the global VS Code configuration. This complete list is generated from \`package.json\` and the runtime configuration contract during the docs build.\n\n<iframe class="parameter-preview" src="../examples/front-matter/index.html" title="Visual front matter parameter preview" loading="lazy"></iframe>\n\n| Setting | Default | Type | Allowed values |\n| --- | --- | --- | --- |\n${frontMatterRows.join('\n')}\n`
fs.writeFileSync(path.join(root, 'website/reference/front-matter.md'), frontMatter)
