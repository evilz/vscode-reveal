import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const published = path.join(root, 'docs')
const pages = [path.join(published, 'index.html'), path.join(published, 'features', 'examples.html'), path.join(published, 'reference', 'front-matter.html')]
const iframePattern = /<iframe[^>]+src="([^"]+)"/g
const localAssetPattern = /<(?:script[^>]+src|link[^>]+href)="([^"]+)"/g

const toFile = (url, page) => {
  const clean = url.split(/[?#]/, 1)[0]
  if (clean.startsWith('/vscode-reveal/')) return path.join(published, clean.slice('/vscode-reveal/'.length))
  if (clean.startsWith('/')) return path.join(published, clean.slice(1))
  return path.resolve(path.dirname(page), clean)
}

let iframeCount = 0
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8')
  for (const match of html.matchAll(iframePattern)) {
    iframeCount += 1
    const url = match[1]
    if (!url.endsWith('.html')) throw new Error(`${page} iframe is not a pre-rendered HTML page: ${url}`)
    const file = toFile(url, page)
    if (!file || !fs.existsSync(file)) throw new Error(`${page} iframe target is missing: ${url}`)
    const preview = fs.readFileSync(file, 'utf8')
    if (!/^<!doctype html>/i.test(preview)) throw new Error(`${url} is not a standalone HTML document`)
    for (const dependency of preview.matchAll(localAssetPattern)) {
      const dependencyUrl = dependency[1]
      if (/^(https?:)?\/\//.test(dependencyUrl)) continue
      const dependencyFile = path.resolve(path.dirname(file), dependencyUrl)
      if (!fs.existsSync(dependencyFile)) throw new Error(`${url} dependency is missing: ${dependencyUrl}`)
    }
  }
}

if (iframeCount === 0) throw new Error('No documentation iframe examples were found')
console.log(`Checked ${iframeCount} iframe(s): pre-rendered HTML and local dependencies resolve.`)
