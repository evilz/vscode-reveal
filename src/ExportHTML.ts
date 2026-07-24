
import * as jetpack from "fs-jetpack";
import * as path from 'path'
import * as fs from 'fs/promises'

const assetMimeTypes: Record<string, string> = {
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const isExternalReference = (value: string) => /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)
const dataUri = (data: Buffer, filePath: string) => `data:${assetMimeTypes[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream'};base64,${data.toString('base64')}`

const resolveLocalExportAsset = (folderPath: string, reference: string) => {
  if (!reference || isExternalReference(reference)) return null
  const pathname = reference.split(/[?#]/, 1)[0]
  if (!pathname) return null
  const resolvedPath = path.resolve(folderPath, pathname)
  const relativePath = path.relative(folderPath, resolvedPath)
  return relativePath === '..' || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath) ? null : resolvedPath
}

const inlineCssUrls = async (css: string, cssDirectory: string, exportFolderPath: string) => {
  const matches = [...css.matchAll(/url\((['"]?)([^)'"\\]+)\1\)/gi)]
  let result = css
  for (const match of matches) {
    const reference = match[2].trim()
    if (!reference || isExternalReference(reference)) continue
    const pathname = reference.split(/[?#]/, 1)[0]
    const assetPath = pathname ? path.resolve(cssDirectory, pathname) : null
    const relativePath = assetPath ? path.relative(exportFolderPath, assetPath) : '..'
    if (!assetPath || relativePath === '..' || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) continue
    try {
      result = result.replace(match[0], `url(${dataUri(await fs.readFile(assetPath), assetPath)})`)
    } catch {
      // Keep a missing optional asset reference unchanged.
    }
  }
  return result
}

export interface IExportOptions {
  folderPath: string,
  url: string,
  data: string | Buffer | null
  srcFilePath: string | null
}

export const exportHTML = async (options: IExportOptions) => {
  const { folderPath, url, data, srcFilePath } = options

  const file = url.endsWith('/') ? `${url}index.html` : url
  const filePath = path.join(folderPath ? folderPath : ".", file)

  if (data) {
    await jetpack.writeAsync(filePath, data)
  }
  else if (srcFilePath) {
    await jetpack.copyAsync(srcFilePath, filePath, { overwrite: true })
  }
}

/**
 * Replace local assets in an exported deck with data URIs so index.html can be
 * distributed on its own. External URLs remain external by design.
 */
export const createSelfContainedExport = async (folderPath: string) => {
  const indexPath = path.join(folderPath, 'index.html')
  let html = await fs.readFile(indexPath, 'utf8')

  // The extension-generated export has bounded script tags; attributes cannot contain unescaped quotes.
  // eslint-disable-next-line sonarjs/slow-regex
  const scriptMatches = [...html.matchAll(/<script([^>]*)\s+src=(['"])([^'"]+)\2([^>]*)><\/script>/gi)]
  for (const match of scriptMatches) {
    const assetPath = resolveLocalExportAsset(folderPath, match[3])
    if (!assetPath) continue
    try {
      html = html.replace(match[0], `<script${match[1]}${match[4]}>${await fs.readFile(assetPath, 'utf8')}</script>`)
    } catch {
      // Keep external or unavailable scripts as their original references.
    }
  }

  // The extension-generated export has bounded link tags; attributes cannot contain unescaped quotes.
  // eslint-disable-next-line sonarjs/slow-regex
  const stylesheetMatches = [...html.matchAll(/<link([^>]*)\s+href=(['"])([^'"]+)\2([^>]*)>/gi)]
  for (const match of stylesheetMatches) {
    if (!/\bstylesheet\b/i.test(match[1] + match[4])) continue
    const assetPath = resolveLocalExportAsset(folderPath, match[3])
    if (!assetPath) continue
    try {
      html = html.replace(match[0], `<style>${await inlineCssUrls(await fs.readFile(assetPath, 'utf8'), path.dirname(assetPath), folderPath)}</style>`)
    } catch {
      // Keep a missing optional stylesheet reference unchanged.
    }
  }

  const resourceMatches = [...html.matchAll(/\s(src|href)=(['"])([^'"]+)\2/gi)]
  for (const match of resourceMatches) {
    const assetPath = resolveLocalExportAsset(folderPath, match[3])
    if (!assetPath) continue
    try {
      html = html.replace(match[0], ` ${match[1]}=${match[2]}${dataUri(await fs.readFile(assetPath), assetPath)}${match[2]}`)
    } catch {
      // Keep a missing optional resource reference unchanged.
    }
  }

  await fs.writeFile(indexPath, html)
  await Promise.all((await fs.readdir(folderPath)).filter((entry) => entry !== 'index.html').map((entry) => fs.rm(path.join(folderPath, entry), { recursive: true, force: true })))
}
