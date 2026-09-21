#!/usr/bin/env node
/**
 * Copy markdown into a Pages site folder and write content/index.json.
 *   node scripts/write-content-index.mjs [destDir]
 */
import { cp, mkdir, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const srcDir = path.join(repoRoot, "content")
const destDir = path.resolve(process.argv[2] || path.join(repoRoot, "site/content"))

async function walkMarkdown(dir, prefix = "") {
  const out = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name
    const abs = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...(await walkMarkdown(abs, rel)))
      continue
    }
    if (/\.(md|mdx)$/i.test(entry.name)) out.push(rel)
  }
  return out.sort()
}

const files = await walkMarkdown(srcDir)

if (files.length === 0) {
  throw new Error(`No markdown in ${srcDir}`)
}

await mkdir(destDir, { recursive: true })
for (const rel of files) {
  const dest = path.join(destDir, rel)
  await mkdir(path.dirname(dest), { recursive: true })
  await cp(path.join(srcDir, rel), dest)
}
await writeFile(
  path.join(destDir, "index.json"),
  `${JSON.stringify({ posts: files }, null, 2)}\n`
)
console.log(`Wrote ${files.length} posts → ${destDir}`)
