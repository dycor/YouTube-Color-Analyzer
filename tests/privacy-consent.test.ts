import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  hasCurrentPrivacyConsent,
  PRIVACY_CONSENT_KEY,
  PRIVACY_CONSENT_VERSION,
} from '../src/shared/protocol'

describe('privacy consent version gate', () => {
  it('uses the single documented local-storage key and version', () => {
    expect(PRIVACY_CONSENT_KEY).toBe('privacyConsentVersion')
    expect(PRIVACY_CONSENT_VERSION).toBe(1)
  })

  it('accepts only the current numeric consent version', () => {
    expect(hasCurrentPrivacyConsent(1)).toBe(true)
    expect(hasCurrentPrivacyConsent(undefined)).toBe(false)
    expect(hasCurrentPrivacyConsent(null)).toBe(false)
    expect(hasCurrentPrivacyConsent(false)).toBe(false)
    expect(hasCurrentPrivacyConsent('1')).toBe(false)
    expect(hasCurrentPrivacyConsent(0)).toBe(false)
    expect(hasCurrentPrivacyConsent(2)).toBe(false)
  })

  it('keeps the classic content-script gate aligned with the shared contract', async () => {
    const source = await readFile(
      resolve(import.meta.dirname, '../src/content-script/index.ts'),
      'utf8',
    )

    expect(source).toContain(
      `const PRIVACY_CONSENT_KEY = '${PRIVACY_CONSENT_KEY}'`,
    )
    expect(source).toContain(
      `const PRIVACY_CONSENT_VERSION = ${PRIVACY_CONSENT_VERSION}`,
    )
    expect(source).toContain('chrome.storage.local')
    expect(source).toContain("type: 'player:observation:ready'")
    expect(source).toContain("message.type === 'player:observation:start'")
    expect(source).toContain("message.type === 'player:observation:stop'")
    expect(source).toContain('requestObservationState(message.sessionId)')
    expect(source).toContain('startObservation(sessionId)')
    expect(source).not.toContain('startObservation()')
  })

  it('limits player observation and snapshots to the active capture session', async () => {
    const [contentScript, serviceWorker, offscreen] = await Promise.all([
      readFile(resolve(import.meta.dirname, '../src/content-script/index.ts'), 'utf8'),
      readFile(resolve(import.meta.dirname, '../src/service-worker/index.ts'), 'utf8'),
      readFile(resolve(import.meta.dirname, '../src/offscreen/main.ts'), 'utf8'),
    ])

    expect(contentScript).toContain('activeSessionId: string | null = null')
    expect(contentScript).toContain('sessionId,\n    snapshot: createSnapshot()')
    expect(serviceWorker).toContain('startPlayerObservation(tabId, sessionId)')
    expect(serviceWorker).toContain(
      'stopPlayerObservation(capture.tabId, capture.sessionId)',
    )
    expect(serviceWorker).toContain('captureStartQueue.cancel()')
    expect(serviceWorker).toContain('generation !== actionClickGeneration')
    expect(serviceWorker).not.toContain('actionClickInFlight')
    expect(
      serviceWorker.match(/captureRequestMayContinue\(generation\)/g)?.length,
    ).toBeGreaterThanOrEqual(5)
    expect(offscreen).toContain(
      'message.sessionId === analysisRequests.sessionId',
    )
  })
})
