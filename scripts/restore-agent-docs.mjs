import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
for (const name of ['agents', 'adr']) {
  const source = path.join(root, 'website', name)
  const target = path.join(root, 'docs', name)
  fs.mkdirSync(target, { recursive: true })
  for (const file of fs.readdirSync(source)) {
    fs.copyFileSync(path.join(source, file), path.join(target, file))
  }
}
