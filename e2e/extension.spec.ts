import { resolve } from 'node:path'

import { chromium, expect, test, type BrowserContext } from '@playwright/test'

let context: BrowserContext
let extensionId: string

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
  const extensionPath = resolve(import.meta.dirname, '../dist')

  context = await chromium.launchPersistentContext('', {
    channel: 'chromium',
    headless: true,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  })

  let serviceWorker = context.serviceWorkers()[0]

  if (!serviceWorker) {
    serviceWorker = await context.waitForEvent('serviceworker')
  }

  extensionId = new URL(serviceWorker.url()).host
})

test.afterAll(async () => {
  await context.close()
})

async function getServiceWorker() {
  const existing = context.serviceWorkers()[0]

  if (existing) {
    return existing
  }

  const workerStarted = context.waitForEvent('serviceworker')
  const wakePage = await context.newPage()
  await wakePage.goto(`chrome-extension://${extensionId}/sidepanel.html`)
  const worker = await workerStarted
  await wakePage.close()
  return worker
}

test('requires explicit consent and stores only its current version', async () => {
  const serviceWorker = await getServiceWorker()
  await serviceWorker.evaluate(async () => {
    await chrome.storage.local.remove('privacyConsentVersion')
  })

  const page = await context.newPage()
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`)

  const dialog = page.getByRole('dialog', { name: 'Local video analysis' })
  await expect(dialog).toBeVisible()
  await expect(
    dialog.getByRole('link', { name: 'Privacy Policy' }),
  ).toHaveAttribute(
    'href',
    'https://dycor.github.io/YouTube-Color-Analyzer/privacy/',
  )

  await dialog.getByRole('button', { name: 'Cancel' }).click()
  await expect(
    dialog.getByText('Analysis was not started. Your choice has not been stored.'),
  ).toBeVisible()
  expect(
    await serviceWorker.evaluate(async () =>
      chrome.storage.local.get('privacyConsentVersion'),
    ),
  ).toEqual({})

  await dialog.getByRole('button', { name: 'Accept and start analysis' }).click()
  await expect(dialog).toBeHidden()
  expect(
    await serviceWorker.evaluate(async () =>
      chrome.storage.local.get('privacyConsentVersion'),
    ),
  ).toEqual({ privacyConsentVersion: 1 })
  await expect(page.getByText('V1.0.0')).toBeVisible()
  await expect(
    page.locator('footer').getByRole('link', { name: 'Privacy Policy' }),
  ).toHaveAttribute(
    'href',
    'https://dycor.github.io/YouTube-Color-Analyzer/privacy/',
  )
})

test('observes YouTube only while an analysis session is active', async () => {
  const serviceWorker = await getServiceWorker()
  const youtubeUrl = 'https://www.youtube.com/watch?v=privacy-gate-test'
  const sessionId = 'privacy-gate-session'

  await serviceWorker.evaluate(async () => {
    await chrome.storage.local.remove('privacyConsentVersion')
    await chrome.storage.session.remove('activeCapture')
    const state = globalThis as typeof globalThis & {
      privacyGateSnapshotCount?: number
      privacyGateListenerInstalled?: boolean
    }
    state.privacyGateSnapshotCount = 0

    if (!state.privacyGateListenerInstalled) {
      state.privacyGateListenerInstalled = true
      chrome.runtime.onMessage.addListener((message: { type?: string }) => {
        if (message.type === 'player:snapshot') {
          state.privacyGateSnapshotCount =
            (state.privacyGateSnapshotCount ?? 0) + 1
        }
      })
    }
  })

  await context.route('https://www.youtube.com/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html>
        <html><body>
          <div id="movie_player"></div>
          <video class="html5-main-video"></video>
        </body></html>`,
    }),
  )

  const page = await context.newPage()
  await page.goto(youtubeUrl)
  await page.waitForTimeout(650)

  expect(
    await serviceWorker.evaluate(() =>
      (globalThis as typeof globalThis & { privacyGateSnapshotCount?: number })
        .privacyGateSnapshotCount ?? 0,
    ),
  ).toBe(0)

  const requestObservation = async (requestedSessionId = sessionId) => {
    await serviceWorker.evaluate(async ({ url, activeSessionId }) => {
      const [tab] = await chrome.tabs.query({ url })
      if (tab?.id === undefined) {
        throw new Error('The routed YouTube test tab was not found.')
      }
      await chrome.tabs.sendMessage(tab.id, {
        type: 'player:observation:start',
        sessionId: activeSessionId,
      })
    }, { url: youtubeUrl, activeSessionId: requestedSessionId })
  }

  await requestObservation()
  await page.waitForTimeout(400)
  expect(
    await serviceWorker.evaluate(() =>
      (globalThis as typeof globalThis & { privacyGateSnapshotCount?: number })
        .privacyGateSnapshotCount ?? 0,
    ),
  ).toBe(0)

  await serviceWorker.evaluate(async () => {
    await chrome.storage.local.set({ privacyConsentVersion: 1 })
  })
  await requestObservation()
  await page.waitForTimeout(400)
  expect(
    await serviceWorker.evaluate(() =>
      (globalThis as typeof globalThis & { privacyGateSnapshotCount?: number })
        .privacyGateSnapshotCount ?? 0,
    ),
  ).toBe(0)

  await serviceWorker.evaluate(async ({ url, activeSessionId }) => {
    const [tab] = await chrome.tabs.query({ url })
    if (tab?.id === undefined) {
      throw new Error('The routed YouTube test tab was not found.')
    }
    await chrome.storage.session.set({
      activeCapture: { tabId: tab.id, sessionId: activeSessionId },
    })
  }, { url: youtubeUrl, activeSessionId: sessionId })
  await requestObservation()

  await expect
    .poll(() =>
      serviceWorker.evaluate(() =>
        (globalThis as typeof globalThis & { privacyGateSnapshotCount?: number })
          .privacyGateSnapshotCount ?? 0,
      ),
    )
    .toBeGreaterThan(0)

  const countBeforeStaleStart = await serviceWorker.evaluate(() =>
    (globalThis as typeof globalThis & { privacyGateSnapshotCount?: number })
      .privacyGateSnapshotCount ?? 0,
  )
  await requestObservation('stale-session')
  await page.waitForTimeout(400)
  expect(
    await serviceWorker.evaluate(() =>
      (globalThis as typeof globalThis & { privacyGateSnapshotCount?: number })
        .privacyGateSnapshotCount ?? 0,
    ),
  ).toBeGreaterThan(countBeforeStaleStart)

  const youtubeTabId = await serviceWorker.evaluate(async (url) => {
    const [tab] = await chrome.tabs.query({ url })
    if (tab?.id === undefined) {
      throw new Error('The routed YouTube test tab was not found.')
    }
    return tab.id
  }, youtubeUrl)
  const extensionSender = await context.newPage()
  await extensionSender.goto(`chrome-extension://${extensionId}/sidepanel.html`)
  await extensionSender.evaluate(async ({ tabId, activeSessionId }) => {
    await chrome.runtime.sendMessage({
      type: 'capture:ended',
      tabId,
      sessionId: activeSessionId,
    })
  }, { tabId: youtubeTabId, activeSessionId: sessionId })
  await extensionSender.close()

  await page.waitForTimeout(100)
  const countAfterStop = await serviceWorker.evaluate(() =>
    (globalThis as typeof globalThis & { privacyGateSnapshotCount?: number })
      .privacyGateSnapshotCount ?? 0,
  )
  await page.waitForTimeout(650)
  expect(
    await serviceWorker.evaluate(() =>
      (globalThis as typeof globalThis & { privacyGateSnapshotCount?: number })
        .privacyGateSnapshotCount ?? 0,
    ),
  ).toBe(countAfterStop)

  await page.close()
  await context.unroute('https://www.youtube.com/**')
})

test('the packaged side panel exposes the three instruments', async () => {
  const page = await context.newPage()
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`)

  await expect(page.getByRole('heading', { name: 'Color Analyzer' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Parade' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Waveform' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Vectorscope' })).toBeVisible()
  await expect(page.locator('#scope-canvas')).toBeVisible()
})

test('the panel remembers the selected instrument', async () => {
  const page = await context.newPage()
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`)
  await page.getByRole('button', { name: 'Waveform' }).click()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Waveform' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('the panel renders scope data received through extension messaging', async () => {
  const page = await context.newPage()
  const sender = await context.newPage()
  await page.setViewportSize({ width: 390, height: 820 })
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`)
  await sender.goto(`chrome-extension://${extensionId}/sidepanel.html`)
  await page.getByRole('button', { name: 'Waveform' }).click()

  await sender.evaluate(async () => {
    const xBins = 128
    const levelBins = 256
    const vectorSize = 256
    const channelIntensity = new Uint8Array(4 * xBins * levelBins)
    const vectorIntensity = new Uint8Array(vectorSize * vectorSize)

    for (let x = 0; x < xBins; x += 1) {
      const levels = [
        Math.round(38 + Math.sin(x / 14) * 18),
        Math.round(72 + Math.sin(x / 11) * 42),
        Math.round(108 + Math.sin(x / 17) * 34),
        Math.round(148 + Math.sin(x / 9) * 28),
      ]

      levels.forEach((level, channel) => {
        for (let spread = -3; spread <= 3; spread += 1) {
          const boundedLevel = Math.min(255, Math.max(0, level + spread))
          const index = (channel * xBins + x) * levelBins + boundedLevel
          channelIntensity[index] = 255 - Math.abs(spread) * 28
        }
      })
    }

    const encode = (bytes: Uint8Array): string => {
      let binary = ''

      for (const byte of bytes) {
        binary += String.fromCharCode(byte)
      }

      return btoa(binary)
    }

    await chrome.runtime.sendMessage({
      type: 'session:state',
      target: 'sidepanel',
      state: {
        status: 'active',
        sessionId: 'e2e-session',
        captionsVisible: false,
        hdrDetected: false,
      },
    })
    await chrome.runtime.sendMessage({
      type: 'analysis:frame',
      target: 'sidepanel',
      sessionId: 'e2e-session',
      frame: {
        frameId: 1,
        capturedAt: Date.now(),
        detailed: false,
        sourceWidth: 640,
        sourceHeight: 360,
        xBins,
        levelBins,
        vectorSize,
        sampleCount: 230400,
        computeMs: 8.2,
        channelIntensityBase64: encode(channelIntensity),
        vectorIntensityBase64: encode(vectorIntensity),
      },
    })
  })

  await expect(page.getByText('Live · 640×360')).toBeVisible()
  await expect(page.getByText('Live analysis')).toBeVisible()
  await page.screenshot({ path: 'test-results/sidepanel-waveform.png', fullPage: true })
})

test('the panel ignores a delayed frame from an older capture session', async () => {
  const page = await context.newPage()
  const sender = await context.newPage()
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`)
  await sender.goto(`chrome-extension://${extensionId}/sidepanel.html`)

  await sender.evaluate(async () => {
    const encode = (bytes: Uint8Array): string => {
      let binary = ''

      for (const byte of bytes) {
        binary += String.fromCharCode(byte)
      }

      return btoa(binary)
    }
    const frame = {
      frameId: 9,
      capturedAt: Date.now(),
      detailed: false,
      sourceWidth: 1,
      sourceHeight: 1,
      xBins: 1,
      levelBins: 256,
      vectorSize: 256,
      sampleCount: 1,
      computeMs: 0.1,
      channelIntensityBase64: encode(new Uint8Array(4 * 256)),
      vectorIntensityBase64: encode(new Uint8Array(256 * 256)),
    }

    await chrome.runtime.sendMessage({
      type: 'session:state',
      target: 'sidepanel',
      state: { status: 'starting', sessionId: 'current-session' },
    })
    await chrome.runtime.sendMessage({
      type: 'analysis:frame',
      target: 'sidepanel',
      sessionId: 'old-session',
      frame,
    })
  })

  await expect(page.getByText('No measurement')).toBeVisible()

  await sender.evaluate(async () => {
    const encode = (bytes: Uint8Array): string => {
      let binary = ''

      for (const byte of bytes) {
        binary += String.fromCharCode(byte)
      }

      return btoa(binary)
    }

    await chrome.runtime.sendMessage({
      type: 'analysis:frame',
      target: 'sidepanel',
      sessionId: 'current-session',
      frame: {
        frameId: 10,
        capturedAt: Date.now(),
        detailed: false,
        sourceWidth: 1,
        sourceHeight: 1,
        xBins: 1,
        levelBins: 256,
        vectorSize: 256,
        sampleCount: 1,
        computeMs: 0.1,
        channelIntensityBase64: encode(new Uint8Array(4 * 256)),
        vectorIntensityBase64: encode(new Uint8Array(256 * 256)),
      },
    })
  })

  await expect(page.getByText('Live · 1×1')).toBeVisible()
})

test('a reconnected paused panel requests the last scope frame', async () => {
  const page = await context.newPage()
  const sender = await context.newPage()
  await sender.goto(`chrome-extension://${extensionId}/sidepanel.html`)

  await sender.evaluate(async () => {
    const sessionId = 'paused-reconnect-session'
    const encode = (bytes: Uint8Array): string => {
      let binary = ''

      for (const byte of bytes) {
        binary += String.fromCharCode(byte)
      }

      return btoa(binary)
    }
    const frame = {
      frameId: 11,
      capturedAt: Date.now(),
      detailed: true,
      sourceWidth: 1,
      sourceHeight: 1,
      xBins: 1,
      levelBins: 256,
      vectorSize: 256,
      sampleCount: 1,
      computeMs: 0.1,
      channelIntensityBase64: encode(new Uint8Array(4 * 256)),
      vectorIntensityBase64: encode(new Uint8Array(256 * 256)),
    }

    chrome.runtime.onMessage.addListener((message) => {
      if (
        message.type === 'panel:request-frame' &&
        message.sessionId === sessionId
      ) {
        void chrome.runtime.sendMessage({
          type: 'analysis:frame',
          target: 'sidepanel',
          sessionId,
          frame,
        })
      }
    })

    await chrome.storage.session.set({
      activeCapture: { tabId: 123, sessionId },
      lastSessionState: {
        status: 'paused',
        sessionId,
        captionsVisible: false,
        hdrDetected: false,
      },
    })
  })

  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`)

  await expect(page.getByText('Detailed · 1×1')).toBeVisible()

  await sender.evaluate(async () => {
    await chrome.runtime.sendMessage({
      type: 'capture:ended',
      tabId: 123,
      sessionId: 'paused-reconnect-session',
    })
    await chrome.storage.session.remove(['activeCapture', 'lastSessionState'])
  })
})
