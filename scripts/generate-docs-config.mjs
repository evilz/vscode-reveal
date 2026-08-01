import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const properties = manifest.contributes?.configuration?.properties ?? {}

const describe = (value) => {
  if (value === undefined) return ''
  if (value === null) return '`null`'
  if (typeof value === 'string') return `\`${value.replaceAll('`', '\\`')}\``
  if (typeof value === 'boolean' || typeof value === 'number') return `\`${value}\``
  return `\`${JSON.stringify(value).replaceAll('|', '\\|')}\``
}

const rows = Object.entries(properties).map(([name, setting]) => {
  const type = Array.isArray(setting.type) ? setting.type.join(', ') : (setting.type ?? '')
  const values = setting.enum?.map((value) => `\`${value}\``).join(', ') ?? ''
  const notes = [setting.description ?? '', values ? `Values: ${values}` : ''].filter(Boolean).join(' ')
  return `| \`${name}\` | ${describe(setting.default)} | ${type} | ${notes.replaceAll('|', '\\|')} |`
})

const output = `# Configuration reference\n\nVS Code Reveal contributes settings under the \`revealjs.*\` namespace. This table is generated from \`package.json\` during the docs build.\n\n| Setting | Default | Type | Description and accepted values |\n| --- | --- | --- | --- |\n${rows.join('\n')}\n`
fs.writeFileSync(path.join(root, 'website/reference/configuration.md'), output)

const allowedValues = (setting) => {
  if (setting.enum) return setting.enum.map((value) => `\`${value}\``).join(', ')
  const types = Array.isArray(setting.type) ? setting.type : [setting.type]
  if (types.includes('boolean')) return '`true`, `false`'
  if (types.includes('number')) return 'Any number'
  if (types.includes('string')) return 'Any string'
  if (types.includes('object')) return 'Object matching the setting schema'
  return 'See the VS Code Settings UI'
}

const frontMatterRows = Object.entries(properties).map(([name, setting]) => {
  const type = Array.isArray(setting.type) ? setting.type.join(' | ') : (setting.type ?? '')
  return `| \`${name}\` | ${describe(setting.default)} | ${type} | ${allowedValues(setting)} |`
})

const frontMatter = `# Front matter reference\n\nFront matter lets a presentation override its \`revealjs.*\` settings without changing the global VS Code configuration. This complete list is generated from \`package.json\` during the docs build.\n\n<iframe class="parameter-preview" src="../examples/front-matter/index.html" title="Visual front matter parameter preview" loading="lazy"></iframe>\n\n| Setting | Default | Type | Allowed values |\n| --- | --- | --- | --- |\n${frontMatterRows.join('\n')}\n`
fs.writeFileSync(path.join(root, 'website/reference/front-matter.md'), frontMatter)
