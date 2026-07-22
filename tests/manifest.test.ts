import { readFile, readdir } from 'node:fs/promises'

import { describe, expect, it } from 'vitest'

interface ExtensionManifest {
  manifest_version: number
  default_locale: string
  name: string
  short_name: string
  description: string
  minimum_chrome_version: string
  host_permissions: string[]
  permissions: string[]
  icons: Record<string, string>
  action: {
    default_title: string
    default_icon: Record<string, string>
  }
  background: { service_worker: string }
  side_panel: { default_path: string }
}

async function readManifest(): Promise<ExtensionManifest> {
  const content = await readFile(new URL('../public/manifest.json', import.meta.url), 'utf8')
  return JSON.parse(content) as ExtensionManifest
}

function pngHasAlpha(bytes: Buffer): boolean {
  const colorType = bytes[25]

  if (colorType === 4 || colorType === 6) {
    return true
  }

  let offset = 8

  while (offset + 12 <= bytes.length) {
    const chunkLength = bytes.readUInt32BE(offset)
    const chunkType = bytes.toString('ascii', offset + 4, offset + 8)

    if (chunkType === 'tRNS') {
      return true
    }

    offset += chunkLength + 12
  }

  return false
}

describe('extension manifest', () => {
  it('uses Manifest V3 and Chrome 116 as its minimum', async () => {
    const manifest = await readManifest()
    expect(manifest.manifest_version).toBe(3)
    expect(manifest.minimum_chrome_version).toBe('116')
  })

  it('uses English as the manifest fallback and localizes its metadata', async () => {
    const manifest = await readManifest()
    expect(manifest.default_locale).toBe('en')
    expect(manifest.name).toBe('__MSG_extensionName__')
    expect(manifest.short_name).toBe('__MSG_extensionShortName__')
    expect(manifest.description).toBe('__MSG_extensionDescription__')

    const localesUrl = new URL('../public/_locales/', import.meta.url)
    const localeDirectories = (await readdir(localesUrl)).sort()
    expect(localeDirectories).toEqual([
      'en',
      'es',
      'fr',
      'pt_BR',
      'pt_PT',
      'zh_CN',
      'zh_TW',
    ])

    for (const locale of localeDirectories) {
      const content = await readFile(
        new URL(`../public/_locales/${locale}/messages.json`, import.meta.url),
        'utf8',
      )
      const messages = JSON.parse(content) as Record<string, { message?: string }>
      expect(messages.extensionName?.message).toBeTruthy()
      expect(messages.extensionShortName?.message).toBeTruthy()
      expect(messages.extensionDescription?.message).toBeTruthy()
      expect(messages.actionTitle?.message).toBeTruthy()
    }
  })

  it('keeps the English short name within Chrome’s 12-character limit', async () => {
    const content = await readFile(
      new URL('../public/_locales/en/messages.json', import.meta.url),
      'utf8',
    )
    const messages = JSON.parse(content) as Record<string, { message?: string }>
    const shortName = messages.extensionShortName?.message

    expect(shortName).toBe('Color Scope')
    expect(shortName?.length).toBeLessThanOrEqual(12)
  })

  it('limits host access to YouTube', async () => {
    const manifest = await readManifest()
    expect(manifest.host_permissions).toEqual(['https://www.youtube.com/*'])
  })

  it('declares the capture and side panel capabilities', async () => {
    const manifest = await readManifest()
    expect(manifest.permissions).toEqual([
      'offscreen',
      'sidePanel',
      'storage',
      'tabCapture',
    ])
    expect(manifest.background.service_worker).toBe('service-worker.js')
    expect(manifest.side_panel.default_path).toBe('sidepanel.html')
  })

  it('declares the generated logo at every Chrome icon size', async () => {
    const manifest = await readManifest()
    const expectedIcons = {
      '16': 'icons/icon-16.png',
      '32': 'icons/icon-32.png',
      '48': 'icons/icon-48.png',
      '128': 'icons/icon-128.png',
    }

    expect(manifest.icons).toEqual(expectedIcons)
    expect(manifest.action.default_icon).toEqual({
      '16': expectedIcons['16'],
      '32': expectedIcons['32'],
    })

    await Promise.all(
      Object.entries(expectedIcons).map(async ([size, iconPath]) => {
        const bytes = await readFile(
          new URL(`../public/${iconPath}`, import.meta.url),
        )
        expect(bytes.readUInt32BE(16)).toBe(Number(size))
        expect(bytes.readUInt32BE(20)).toBe(Number(size))
        expect(pngHasAlpha(bytes)).toBe(true)
      }),
    )
  })
})
