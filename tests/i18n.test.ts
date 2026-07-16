import { describe, expect, it } from 'vitest'

import {
  resolveLocale,
  translateForLocale,
} from '../src/shared/i18n'

describe('browser language localization', () => {
  it.each([
    ['en-US', 'en'],
    ['fr-FR', 'fr'],
    ['zh-CN', 'zh'],
    ['zh-TW', 'zh'],
    ['es-MX', 'es'],
    ['pt-BR', 'pt'],
    ['pt_PT', 'pt'],
  ] as const)('maps %s to the supported %s language', (language, expected) => {
    expect(resolveLocale(language)).toBe(expected)
  })

  it.each(['de-DE', 'it-IT', 'ja-JP', '', null, undefined])(
    'falls back to English for unsupported language %s',
    (language) => {
      expect(resolveLocale(language)).toBe('en')
    },
  )

  it('provides the requested translations in all five languages', () => {
    expect(translateForLocale('en', 'stop')).toBe('Stop')
    expect(translateForLocale('fr', 'stop')).toBe('Arrêter')
    expect(translateForLocale('zh', 'stop')).toBe('停止')
    expect(translateForLocale('es', 'stop')).toBe('Detener')
    expect(translateForLocale('pt', 'stop')).toBe('Parar')
  })

  it('interpolates measurement dimensions without changing technical values', () => {
    expect(
      translateForLocale('es', 'qualityDetailed', {
        width: 1920,
        height: 1080,
      }),
    ).toBe('Detallado · 1920×1080')
  })
})
