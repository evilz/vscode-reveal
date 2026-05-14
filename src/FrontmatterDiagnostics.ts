import { Diagnostic, DiagnosticSeverity, Position, Range, TextDocument, Uri, workspace } from 'vscode'
import { ConfigurationDescription } from './Configuration'
import { RevealContext } from './RevealContext'

type FrontmatterLineRange = { start: number; end: number }

const findFrontmatterLineRange = (document: TextDocument): FrontmatterLineRange | null => {
  if (document.lineCount < 1 || document.lineAt(0).text.trim() !== '---') {
    return null
  }

  for (let line = 1; line < document.lineCount; line++) {
    if (document.lineAt(line).text.trim() === '---') {
      return { start: 0, end: line }
    }
  }

  return null
}

const keyRangesByName = (document: TextDocument, frontmatterLineRange: FrontmatterLineRange | null): Map<string, Range> => {
  const map = new Map<string, Range>()
  if (!frontmatterLineRange) return map

  for (let i = frontmatterLineRange.start + 1; i < frontmatterLineRange.end; i++) {
    const line = document.lineAt(i).text
    const match = /^\s*([a-zA-Z_][\w-]*)\s*:/.exec(line)
    if (!match) continue
    const key = match[1]
    const keyOffset = line.indexOf(key, match.index)
    const start = new Position(i, keyOffset)
    const end = new Position(i, start.character + key.length)
    map.set(key, new Range(start, end))
  }

  return map
}

const wholeFrontmatterRange = (document: TextDocument, frontmatterLineRange: FrontmatterLineRange | null): Range => {
  if (!frontmatterLineRange) {
    return new Range(new Position(0, 0), new Position(0, 0))
  }
  const endLine = frontmatterLineRange.end
  return new Range(new Position(frontmatterLineRange.start, 0), new Position(endLine, document.lineAt(endLine).text.length))
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
  const types = Array.isArray(expectedType) ? expectedType : [expectedType]
  return types.some(t => {
    if (t === 'null') return value === null
    if (t === 'array') return Array.isArray(value)
    if (t === 'object') return typeof value === 'object' && value !== null && !Array.isArray(value)
    return typeof value === t
  })
}

const pathExists = async (fsPath: string) => {
  try {
    await workspace.fs.stat(Uri.file(fsPath))
    return true
  } catch {
    return false
  }
}

const getCssEntries = (css: unknown): string[] => {
  if (!Array.isArray(css)) return []
  return css.filter((entry): entry is string => typeof entry === 'string')
}

export const collectDiagnostics = async (
  context: RevealContext,
  configByKey: Map<string, ConfigurationDescription>
): Promise<Diagnostic[]> => {
  const diagnostics: Diagnostic[] = []
  const doc = context.editor.document
  const frontmatterLineRange = findFrontmatterLineRange(doc)
  const keyRanges = keyRangesByName(doc, frontmatterLineRange)
  const fullFrontmatterRange = wholeFrontmatterRange(doc, frontmatterLineRange)

  if (context.parseError) {
    const parseRange = context.parseError.line !== undefined
      ? new Range(
        new Position(context.parseError.line, context.parseError.column ?? 0),
        new Position(context.parseError.line, (context.parseError.column ?? 0) + 1)
      )
      : fullFrontmatterRange
    diagnostics.push(toDiagnostic(parseRange, `Front matter parse error: ${context.parseError.message}`, DiagnosticSeverity.Error))
    return diagnostics
  }

  const attrs = context.frontmatter?.attributes ?? {}
  for (const [key, value] of Object.entries(attrs)) {
    const keyRange = keyRanges.get(key) ?? fullFrontmatterRange
    const desc = configByKey.get(key)
    if (!desc) {
      diagnostics.push(toDiagnostic(keyRange, `Unsupported front matter key "${key}".`))
      continue
    }

    if (!acceptsType(value, desc.type)) {
      const typeLabel = Array.isArray(desc.type) ? desc.type.join(' or ') : desc.type
      diagnostics.push(toDiagnostic(keyRange, `Invalid value type for "${key}". Expected ${typeLabel}, found ${valueType(value)}.`))
      continue
    }

    if (desc.values && typeof value === 'string' && !desc.values.includes(value)) {
      diagnostics.push(toDiagnostic(keyRange, `Invalid value "${value}" for "${key}". Allowed values: ${desc.values.join(', ')}.`))
    }
  }

  const customThemePath = context.resolveLocalAssetPath(context.configuration.customTheme, true)
  if (customThemePath && !(await pathExists(customThemePath))) {
    diagnostics.push(toDiagnostic(keyRanges.get('customTheme') ?? fullFrontmatterRange, `Missing custom theme file: ${customThemePath}.`))
  }

  for (const cssEntry of getCssEntries(context.configuration.css)) {
    const cssPath = context.resolveLocalAssetPath(cssEntry)
    if (!cssPath || await pathExists(cssPath)) continue
    diagnostics.push(toDiagnostic(keyRanges.get('css') ?? fullFrontmatterRange, `Missing CSS file: ${cssPath}.`))
  }

  return diagnostics
}
