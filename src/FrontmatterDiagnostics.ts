import fs from 'fs'
import path from 'path'
import { Diagnostic, DiagnosticSeverity, Position, Range, TextDocument } from 'vscode'
import { ConfigurationDescription } from './Configuration'
import { RevealContext } from './RevealContext'

const frontmatterRange = (document: TextDocument): { start: number; end: number } | null => {
  const text = document.getText()
  if (!text.startsWith('---')) return null

  const lines = text.split(/\r?\n/)
  let end = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      end = i
      break
    }
  }

  if (end < 0) return null
  return { start: 0, end }
}

const keyRangesByName = (document: TextDocument): Map<string, Range> => {
  const map = new Map<string, Range>()
  const range = frontmatterRange(document)
  if (!range) return map

  for (let i = range.start + 1; i < range.end; i++) {
    const line = document.lineAt(i).text
    const match = /^\s*([a-zA-Z_][\w-]*)\s*:/.exec(line)
    if (!match) continue
    const key = match[1]
    const start = new Position(i, match.index + line.slice(match.index).indexOf(key))
    const end = new Position(i, start.character + key.length)
    map.set(key, new Range(start, end))
  }

  return map
}

const wholeFrontmatterRange = (document: TextDocument): Range => {
  const range = frontmatterRange(document)
  if (!range) {
    return new Range(new Position(0, 0), new Position(0, 0))
  }
  return new Range(new Position(range.start, 0), new Position(range.end, document.lineAt(range.end).text.length))
}

const toDiagnostic = (range: Range, message: string, severity: DiagnosticSeverity = DiagnosticSeverity.Warning): Diagnostic => {
  const diagnostic = new Diagnostic(range, message, severity)
  diagnostic.source = 'vscode-revealjs'
  return diagnostic
}

const valueType = (value: unknown): string => {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

const acceptsType = (value: unknown, expectedType: ConfigurationDescription['type']) => {
  if (expectedType === 'null') return value === null
  if (expectedType === 'array') return Array.isArray(value)
  if (expectedType === 'object') return typeof value === 'object' && value !== null && !Array.isArray(value)
  return typeof value === expectedType
}

export const collectDiagnostics = (context: RevealContext, configDesc: ConfigurationDescription[]): Diagnostic[] => {
  const diagnostics: Diagnostic[] = []
  const doc = context.editor.document
  const keyRanges = keyRangesByName(doc)
  const configByKey = new Map(configDesc.map((d) => [d.label, d]))

  if (context.parseError) {
    const parseRange = context.parseError.line !== undefined
      ? new Range(
        new Position(context.parseError.line, context.parseError.column ?? 0),
        new Position(context.parseError.line, (context.parseError.column ?? 0) + 1)
      )
      : wholeFrontmatterRange(doc)
    diagnostics.push(toDiagnostic(parseRange, `Front matter parse error: ${context.parseError.message}`, DiagnosticSeverity.Error))
    return diagnostics
  }

  const attrs = context.frontmatter?.attributes ?? {}
  for (const [key, value] of Object.entries(attrs)) {
    const keyRange = keyRanges.get(key) ?? wholeFrontmatterRange(doc)
    const desc = configByKey.get(key)
    if (!desc) {
      diagnostics.push(toDiagnostic(keyRange, `Unsupported front matter key "${key}".`))
      continue
    }

    if (!acceptsType(value, desc.type)) {
      diagnostics.push(toDiagnostic(keyRange, `Invalid value type for "${key}". Expected ${desc.type}, found ${valueType(value)}.`))
      continue
    }

    if (desc.values && typeof value === 'string' && !desc.values.includes(value)) {
      diagnostics.push(toDiagnostic(keyRange, `Invalid value "${value}" for "${key}". Allowed values: ${desc.values.join(', ')}.`))
    }
  }

  const customThemePath = context.configuration.customTheme
    ? path.resolve(context.dirname, `${context.configuration.customTheme}.css`)
    : null
  if (customThemePath && !fs.existsSync(customThemePath)) {
    diagnostics.push(toDiagnostic(
      keyRanges.get('customTheme') ?? wholeFrontmatterRange(doc),
      `Missing custom theme file: ${customThemePath}.`
    ))
  }

  for (const css of context.configuration.css) {
    if (!css || /^(https?:)?\/\//i.test(css) || /^data:/i.test(css)) continue
    const cssPath = path.resolve(context.dirname, css)
    if (fs.existsSync(cssPath)) continue
    diagnostics.push(toDiagnostic(
      keyRanges.get('css') ?? wholeFrontmatterRange(doc),
      `Missing CSS file: ${cssPath}.`
    ))
  }

  return diagnostics
}
