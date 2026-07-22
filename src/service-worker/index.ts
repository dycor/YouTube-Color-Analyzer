import { PANEL_DISCONNECT_GRACE_MS, PANEL_PORT } from '../shared/constants'
import { translate as t } from '../shared/i18n'
import type {
  CaptureEndedMessage,
  CaptureStartMessage,
  CaptureStopMessage,
  PanelFrameRequestMessage,
  PanelPortMessage,
  PlayerObservationStartMessage,
  PlayerObservationState,
  PlayerObservationStopMessage,
  RuntimeMessage,
  SessionState,
  SessionStateMessage,
  SessionStopReason,
} from '../shared/protocol'
import {
  hasCurrentPrivacyConsent,
  PRIVACY_CONSENT_KEY,
} from '../shared/protocol'
import { LatestCaptureStartQueue } from './capture-start-queue'

const ACTIVE_CAPTURE_KEY = 'activeCapture'
const LAST_SESSION_STATE_KEY = 'lastSessionState'

interface ActiveCapture {
  tabId: number
  sessionId: string
}

interface PendingCaptureTarget {
  tabId: number
  windowId: number
}

let activeCapture: ActiveCapture | null = null
let pendingCaptureTarget: PendingCaptureTarget | null = null
let actionClickGeneration = 0
const captureStartQueue = new LatestCaptureStartQueue<chrome.tabs.Tab>()
const panelPorts = new Set<chrome.runtime.Port>()
let pendingPanelClose: ReturnType<typeof globalThis.setTimeout> | null = null

function cancelPendingPanelClose(): void {
  if (pendingPanelClose !== null) {
    globalThis.clearTimeout(pendingPanelClose)
    pendingPanelClose = null
  }
}

async function getActiveCapture(): Promise<ActiveCapture | null> {
  if (activeCapture !== null) {
    return activeCapture
  }

  const stored = await chrome.storage.session.get(ACTIVE_CAPTURE_KEY)
  const candidate = stored[ACTIVE_CAPTURE_KEY] as Partial<ActiveCapture> | undefined

  if (
    typeof candidate?.tabId === 'number' &&
    typeof candidate.sessionId === 'string'
  ) {
    activeCapture = {
      tabId: candidate.tabId,
      sessionId: candidate.sessionId,
    }
  }

  return activeCapture
}

async function setActiveCapture(capture: ActiveCapture | null): Promise<void> {
  activeCapture = capture

  if (capture === null) {
    await chrome.storage.session.remove(ACTIVE_CAPTURE_KEY)
  } else {
    await chrome.storage.session.set({ [ACTIVE_CAPTURE_KEY]: capture })
  }
}

async function publishSessionState(state: SessionState): Promise<void> {
  await chrome.storage.session.set({ [LAST_SESSION_STATE_KEY]: state })
  const message: SessionStateMessage = {
    type: 'session:state',
    target: 'sidepanel',
    state,
  }
  await chrome.runtime.sendMessage(message).catch(() => undefined)
}

async function hasPrivacyConsent(): Promise<boolean> {
  const stored = await chrome.storage.local.get(PRIVACY_CONSENT_KEY)
  return hasCurrentPrivacyConsent(stored[PRIVACY_CONSENT_KEY])
}

async function startPlayerObservation(
  tabId: number,
  sessionId: string,
): Promise<void> {
  const message: PlayerObservationStartMessage = {
    type: 'player:observation:start',
    sessionId,
  }
  await chrome.tabs.sendMessage(tabId, message).catch(() => undefined)
}

async function stopPlayerObservation(
  tabId: number,
  sessionId: string,
): Promise<void> {
  const message: PlayerObservationStopMessage = {
    type: 'player:observation:stop',
    sessionId,
  }
  await chrome.tabs.sendMessage(tabId, message).catch(() => undefined)
}

async function getPlayerObservationState(
  tabId: number | undefined,
): Promise<PlayerObservationState> {
  if (tabId === undefined || !(await hasPrivacyConsent())) {
    return { sessionId: null }
  }

  const capture = await getActiveCapture()
  return {
    sessionId: capture?.tabId === tabId ? capture.sessionId : null,
  }
}

function isSupportedWatchPage(url: string | undefined): boolean {
  if (!url) {
    return false
  }

  try {
    const parsed = new URL(url)
    return parsed.origin === 'https://www.youtube.com' && parsed.pathname === '/watch'
  } catch {
    return false
  }
}

async function ensureOffscreenDocument(): Promise<void> {
  const url = chrome.runtime.getURL('offscreen.html')
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [url],
  })

  if (contexts.length > 0) {
    return
  }

  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['USER_MEDIA', 'WORKERS'],
    justification: t('offscreenJustification'),
  })
}

async function stopActiveCapture(reason: SessionStopReason): Promise<boolean> {
  const capture = await getActiveCapture()

  if (capture === null) {
    return false
  }

  const message: CaptureStopMessage = {
    type: 'capture:stop',
    reason,
    tabId: capture.tabId,
    sessionId: capture.sessionId,
  }

  await setActiveCapture(null)
  await Promise.all([
    chrome.runtime.sendMessage(message).catch(() => undefined),
    stopPlayerObservation(capture.tabId, capture.sessionId),
  ])
  await publishSessionState(
    reason === 'manual'
      ? { status: 'idle', sessionId: null }
      : { status: 'idle', reason: 'capture_stopped', sessionId: null },
  )
  return true
}

async function cancelCapture(reason: SessionStopReason): Promise<void> {
  captureStartQueue.cancel()
  pendingCaptureTarget = null
  await stopActiveCapture(reason)
}

async function cancelCaptureForTab(
  tabId: number,
  reason: SessionStopReason,
): Promise<void> {
  if (captureStartQueue.latestTarget()?.id === tabId) {
    await cancelCapture(reason)
    return
  }

  const capture = await getActiveCapture()

  if (capture?.tabId === tabId) {
    await stopActiveCapture(reason)
  }
}

async function requestCurrentFrame(): Promise<void> {
  if (!(await hasPrivacyConsent())) {
    return
  }

  const capture = await getActiveCapture()

  if (!capture) {
    return
  }

  const message: PanelFrameRequestMessage = {
    type: 'panel:request-frame',
    target: 'offscreen',
    sessionId: capture.sessionId,
  }
  await chrome.runtime.sendMessage(message).catch(() => undefined)
}

async function handleCaptureEnded(message: CaptureEndedMessage): Promise<void> {
  const capture = await getActiveCapture()

  if (
    capture?.tabId !== message.tabId ||
    capture.sessionId !== message.sessionId
  ) {
    return
  }

  await setActiveCapture(null)
  await stopPlayerObservation(capture.tabId, capture.sessionId)
}

async function handleOffscreenSessionState(
  message: SessionStateMessage,
): Promise<void> {
  const capture = await getActiveCapture()
  const sessionId = message.state.sessionId

  if (
    (sessionId === null && capture !== null) ||
    (sessionId !== null && sessionId !== capture?.sessionId)
  ) {
    return
  }

  await publishSessionState(message.state)
}

async function captureRequestMayContinue(generation: number): Promise<boolean> {
  if (!captureStartQueue.isCurrent(generation)) {
    return false
  }

  const consented = await hasPrivacyConsent()
  return consented && captureStartQueue.isCurrent(generation)
}

async function startCaptureForTab(
  tab: chrome.tabs.Tab,
  generation: number,
): Promise<void> {
  if (tab.id === undefined) {
    return
  }

  const tabId = tab.id
  const sessionId = crypto.randomUUID()

  try {
    if (!(await captureRequestMayContinue(generation))) {
      return
    }

    if (!isSupportedWatchPage(tab.url)) {
      await stopActiveCapture('navigation')

      if (captureStartQueue.isCurrent(generation)) {
        await publishSessionState({
          status: 'suspended',
          reason: 'unsupported_page',
          sessionId: null,
        })
      }
      return
    }

    await stopActiveCapture('replaced')

    if (!(await captureRequestMayContinue(generation))) {
      return
    }

    const streamIdPromise = chrome.tabCapture.getMediaStreamId({ targetTabId: tabId })
    const [streamId] = await Promise.all([streamIdPromise, ensureOffscreenDocument()])

    if (!(await captureRequestMayContinue(generation))) {
      return
    }

    await setActiveCapture({ tabId, sessionId })

    if (!(await captureRequestMayContinue(generation))) {
      await stopActiveCapture('manual')
      return
    }

    await publishSessionState({ status: 'starting', sessionId })

    if (!(await captureRequestMayContinue(generation))) {
      await stopActiveCapture('manual')
      return
    }

    const message: CaptureStartMessage = {
      type: 'capture:start',
      streamId,
      tabId,
      sessionId,
    }

    await chrome.runtime.sendMessage(message)

    if (!(await captureRequestMayContinue(generation))) {
      await stopActiveCapture('manual')
      return
    }

    await startPlayerObservation(tabId, sessionId)
  } catch (error) {
    const capture = await getActiveCapture()

    if (capture?.sessionId === sessionId) {
      await stopActiveCapture('manual')
    } else {
      await stopPlayerObservation(tabId, sessionId)
    }

    if (!captureStartQueue.isCurrent(generation)) {
      return
    }

    console.error('Unable to start tab capture.', error)
    await publishSessionState({
      status: 'error',
      sessionId: null,
      message: t('captureFailed'),
    })
  }
}

function requestCaptureStart(tab: chrome.tabs.Tab): Promise<void> {
  return captureStartQueue.request(tab, ({ target, generation }) =>
    startCaptureForTab(target, generation),
  )
}

async function handleActionClick(
  tab: chrome.tabs.Tab,
  generation: number,
): Promise<void> {
  const openPanelPromise = chrome.sidePanel.open({ windowId: tab.windowId })

  if (tab.id === undefined) {
    await openPanelPromise
    return
  }

  const consented = await hasPrivacyConsent()

  if (generation !== actionClickGeneration) {
    await openPanelPromise
    return
  }

  if (!consented) {
    await cancelCapture('manual')

    if (generation !== actionClickGeneration) {
      await openPanelPromise
      return
    }

    pendingCaptureTarget = {
      tabId: tab.id,
      windowId: tab.windowId,
    }
    await publishSessionState({ status: 'idle', sessionId: null })
    await openPanelPromise
    return
  }

  pendingCaptureTarget = null
  await Promise.all([requestCaptureStart(tab), openPanelPromise])
}

async function acceptConsentAndStart(): Promise<void> {
  if (!(await hasPrivacyConsent())) {
    return
  }

  const target = pendingCaptureTarget
  pendingCaptureTarget = null

  let tab: chrome.tabs.Tab | undefined

  if (target) {
    tab = await chrome.tabs.get(target.tabId).catch(() => undefined)
  } else {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    tab = tabs[0]
  }

  if (tab) {
    await requestCaptureStart(tab)
  }
}

chrome.action.onClicked.addListener((tab) => {
  const generation = ++actionClickGeneration
  void handleActionClick(tab, generation).catch((error: unknown) => {
    console.error('Unable to handle the extension action.', error)
  })
})

chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender, sendResponse) => {
  if (message.type === 'session:state' && message.target === 'service-worker') {
    void handleOffscreenSessionState(message).then(
      () => sendResponse(),
      () => sendResponse(),
    )
    return true
  }

  if (message.type === 'capture:ended') {
    void handleCaptureEnded(message).then(
      () => sendResponse(),
      () => sendResponse(),
    )
    return true
  }

  if (message.type === 'player:observation:ready') {
    void getPlayerObservationState(sender.tab?.id).then(
      (state) => sendResponse(state),
      () => sendResponse({ sessionId: null } satisfies PlayerObservationState),
    )
    return true
  }

  return undefined
})

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== PANEL_PORT) {
    return
  }

  cancelPendingPanelClose()
  panelPorts.add(port)

  port.onMessage.addListener((message: PanelPortMessage) => {
    if (message.type === 'panel:ready') {
      void requestCurrentFrame()
    } else if (message.type === 'panel:stop') {
      void cancelCapture('manual')
    } else if (message.type === 'panel:accept-and-start') {
      void acceptConsentAndStart()
    } else if (message.type === 'panel:cancel-consent') {
      pendingCaptureTarget = null
    }
  })

  port.onDisconnect.addListener(() => {
    panelPorts.delete(port)
    cancelPendingPanelClose()

    pendingPanelClose = globalThis.setTimeout(() => {
      pendingPanelClose = null

      if (panelPorts.size === 0) {
        void cancelCapture('panel_closed')
      }
    }, PANEL_DISCONNECT_GRACE_MS)
  })
})

chrome.tabs.onRemoved.addListener((tabId) => {
  void cancelCaptureForTab(tabId, 'tab_closed')
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url === undefined || isSupportedWatchPage(changeInfo.url)) {
    return
  }

  void cancelCaptureForTab(tabId, 'navigation')
})

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (
    areaName === 'local' &&
    PRIVACY_CONSENT_KEY in changes &&
    !hasCurrentPrivacyConsent(changes[PRIVACY_CONSENT_KEY]?.newValue)
  ) {
    pendingCaptureTarget = null
    void cancelCapture('manual')
  }
})

void hasPrivacyConsent().then((consented) => {
  if (!consented) {
    void cancelCapture('manual')
  }
})
