import { access, readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const projectRoot = resolve(import.meta.dirname, '..')
const outputDirectory = resolve(projectRoot, 'dist')

async function listFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name

    if (entry.isDirectory()) {
      files.push(...await listFiles(resolve(directory, entry.name), relativePath))
    } else {
      files.push(relativePath)
    }
  }

  return files
}

await access(resolve(outputDirectory, 'manifest.json'))

const files = await listFiles(outputDirectory)
const forbidden = files.filter(
  (file) =>
    file.endsWith('.map') ||
    file.endsWith('/logo-master.png') ||
    file.endsWith('/.DS_Store') ||
    file === '.DS_Store',
)

if (forbidden.length > 0) {
  throw new Error(`Release build contains source-only files: ${forbidden.join(', ')}`)
}

const contentScript = await readFile(
  resolve(outputDirectory, 'content-script.js'),
  'utf8',
)

if (/^\s*import(?:\s|\{|\*)/m.test(contentScript) || /\bimport\s*\(/.test(contentScript)) {
  throw new Error(
    'The manifest content script contains an ESM import and cannot run as a classic script.',
  )
}

if (
  !contentScript.includes('privacyConsentVersion') ||
  !contentScript.includes('chrome.storage.local')
) {
  throw new Error('The packaged content script is missing its privacy-consent gate.')
}

console.log(
  `Release build verified (${files.length} files, standalone consent-gated content script, no source maps or master artwork).`,
)
