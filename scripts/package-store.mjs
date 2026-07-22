import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, rm, utimes, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)
const projectRoot = resolve(import.meta.dirname, '..')
const outputDirectory = resolve(projectRoot, 'dist')
const releaseDirectory = resolve(projectRoot, 'release')
const packageJson = JSON.parse(
  await readFile(resolve(projectRoot, 'package.json'), 'utf8'),
)
const archivePath = resolve(
  releaseDirectory,
  `color-analyzer-${packageJson.version}.zip`,
)
const checksumPath = resolve(releaseDirectory, 'SHA256SUMS.txt')
const reproducibleTimestamp = new Date('1980-01-01T00:00:00.000Z')

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

await mkdir(releaseDirectory, { recursive: true })
await rm(archivePath, { force: true })
const expectedFiles = (await listFiles(outputDirectory)).sort()

await Promise.all(
  expectedFiles.map((file) =>
    utimes(resolve(outputDirectory, file), reproducibleTimestamp, reproducibleTimestamp),
  ),
)
await run('zip', ['-q', '-X', archivePath, ...expectedFiles], {
  cwd: outputDirectory,
  env: { ...process.env, TZ: 'UTC' },
})
await run('unzip', ['-tq', archivePath])

const { stdout } = await run('unzip', ['-Z1', archivePath])
const archivedFiles = stdout
  .split('\n')
  .map((entry) => entry.replace(/^\.\//, ''))
  .filter((entry) => entry && !entry.endsWith('/'))
  .sort()

if (!archivedFiles.includes('manifest.json')) {
  throw new Error('The packaged manifest is not at the ZIP root.')
}

if (JSON.stringify(archivedFiles) !== JSON.stringify(expectedFiles)) {
  throw new Error('The ZIP content does not exactly match the verified release build.')
}

const checksum = createHash('sha256')
  .update(await readFile(archivePath))
  .digest('hex')
await writeFile(
  checksumPath,
  `${checksum}  ${archivePath.split('/').at(-1)}\n`,
  'utf8',
)

console.log(
  `Chrome Web Store package created: ${archivePath} (${archivedFiles.length} files, SHA-256 ${checksum}).`,
)
