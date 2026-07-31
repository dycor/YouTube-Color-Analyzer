import { PANEL_DISCONNECT_GRACE_MS, PANEL_PORT } from '../shared/constants'
import { translate as t } from '../shared/i18n'
import type {
  CaptureEndedMessage,
  CaptureStartMessage,
  CaptureStopMessage,
  FrameExportErrorMessage,
  FrameExportReadyMessage,
  FrameExportReleaseMessage,
  FrameExportRequestMessage,
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
const SCOPE_WINDOW_PATH = 'scope-window.html'

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
let scopeWindowOpenPromise: Promise<void> | null = null

interface PendingFrameExport {
  port: chrome.runtime.Port
  sessionId: string
  frameId: number
  objectUrl?: string
}

const pendingFrameExports = new Map<string, PendingFrameExport>()

function cancelPendingPanelClose(): void {
  if (pendingPanelClose !== null) {
    globalThis.clearTimeout(pendingPanelClose)
    pendingPanelClose = null
  }
}

function postToPanel(port: chrome.runtime.Port, message: PanelPortMessage): boolean {
  try {
    port.postMessage(message)
    return true
  } catch {
    return false
  }
}

async function openOrFocusScopeWindow(): Promise<void> {
  const url = chrome.runtime.getURL(SCOPE_WINDOW_PATH)
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ['TAB'],
    documentUrls: [url],
  })
  const existing = contexts.find((context) => context.windowId >= 0)

  if (existing) {
    await chrome.windows.update(existing.windowId, { focused: true })
    return
  }

  await chrome.windows.create({
    type: 'popup',
    url,
    width: 1440,
    height: 1000,
    focused: true,
  })
}

function requestScopeWindow(): void {
  scopeWindowOpenPromise ??= openOrFocusScopeWindow()
    .catch((error: unknown) => {
      console.error('Unable to open the analysis window.', error)
    })
    .finally(() => {
      scopeWindowOpenPromise = null
    })
}

function releaseFrameExport(
  requestId: string,
  pending: PendingFrameExport,
): void {
  if (!pending.objectUrl) {
    return
  }

  const message: FrameExportReleaseMessage = {
    type: 'frame-export:release',
    target: 'offscreen',
    requestId,
    sessionId: pending.sessionId,
    objectUrl: pending.objectUrl,
  }
  void chrome.runtime.sendMessage(message).catch(() => undefined)
}

function clearPendingFrameExports(port?: chrome.runtime.Port): void {
  for (const [requestId, pending] of pendingFrameExports) {
    if (port && pending.port !== port) {
      continue
    }

    // A download can already have started when a surface closes or capture stops.
    // Keep its Blob URL alive for the same grace period used by the UI; the
    // offscreen document also enforces a 60-second safety TTL.
    if (pending.objectUrl) {
      globalThis.setTimeout(
        () => releaseFrameExport(requestId, pending),
        5_000,
      )
    }
    pendingFrameExports.delete(requestId)
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
    reasons: ['USER_MEDIA', 'WORKERS', 'BLOBS'],
    justification: t('offscreenJustification'),
  })
}

async function stopActiveCapture(reason: SessionStopReason): Promise<boolean> {
  const capture = await getActiveCapture()

  if (capture === null) {
    return false
  }

  clearPendingFrameExports()

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

  clearPendingFrameExports()
  await setActiveCapture(null)
  await stopPlayerObservation(capture.tabId, capture.sessionId)
}

async function requestFrameExport(
  port: chrome.runtime.Port,
  request: Extract<PanelPortMessage, { type: 'panel:export-frame' }>,
): Promise<void> {
  const capture = await getActiveCapture()

  if (!capture || !(await hasPrivacyConsent())) {
    postToPanel(port, {
      type: 'panel:export-error',
      requestId: request.requestId,
      reason: 'unavailable',
    })
    return
  }

  clearPendingFrameExports(port)
  pendingFrameExports.set(request.requestId, {
    port,
    sessionId: capture.sessionId,
    frameId: request.frameId,
  })

  const message: FrameExportRequestMessage = {
    type: 'frame-export:request',
    target: 'offscreen',
    requestId: request.requestId,
    sessionId: capture.sessionId,
    frameId: request.frameId,
  }

  try {
    await chrome.runtime.sendMessage(message)
  } catch {
    pendingFrameExports.delete(request.requestId)
    postToPanel(port, {
      type: 'panel:export-error',
      requestId: request.requestId,
      reason: 'unavailable',
    })
  }
}

function handleFrameExportReady(message: FrameExportReadyMessage): void {
  const pending = pendingFrameExports.get(message.requestId)

  if (!pending) {
    const release: FrameExportReleaseMessage = {
      type: 'frame-export:release',
      target: 'offscreen',
      requestId: message.requestId,
      sessionId: message.sessionId,
      objectUrl: message.objectUrl,
    }
    void chrome.runtime.sendMessage(release).catch(() => undefined)
    return
  }

  if (
    pending.sessionId !== message.sessionId ||
    pending.frameId !== message.frameId
  ) {
    pendingFrameExports.delete(message.requestId)
    postToPanel(pending.port, {
      type: 'panel:export-error',
      requestId: message.requestId,
      reason: 'unavailable',
    })
    const release: FrameExportReleaseMessage = {
      type: 'frame-export:release',
      target: 'offscreen',
      requestId: message.requestId,
      sessionId: message.sessionId,
      objectUrl: message.objectUrl,
    }
    void chrome.runtime.sendMessage(release).catch(() => undefined)
    return
  }

  pending.objectUrl = message.objectUrl
  const delivered = postToPanel(pending.port, {
    type: 'panel:export-ready',
    requestId: message.requestId,
    frameId: message.frameId,
    objectUrl: message.objectUrl,
    fileName: message.fileName,
  })

  if (!delivered) {
    releaseFrameExport(message.requestId, pending)
    pendingFrameExports.delete(message.requestId)
  }
}

function handleFrameExportError(message: FrameExportErrorMessage): void {
  const pending = pendingFrameExports.get(message.requestId)

  if (!pending || pending.sessionId !== message.sessionId) {
    return
  }

  pendingFrameExports.delete(message.requestId)
  postToPanel(pending.port, {
    type: 'panel:export-error',
    requestId: message.requestId,
    reason: message.reason,
  })
}

function completeFrameExport(
  port: chrome.runtime.Port,
  message: Extract<PanelPortMessage, { type: 'panel:export-release' }>,
): void {
  const pending = pendingFrameExports.get(message.requestId)

  if (
    !pending ||
    pending.port !== port ||
    pending.objectUrl !== message.objectUrl
  ) {
    return
  }

  releaseFrameExport(message.requestId, pending)
  pendingFrameExports.delete(message.requestId)
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
  if (message.type === 'frame-export:ready') {
    handleFrameExportReady(message)
    sendResponse()
    return false
  }

  if (message.type === 'frame-export:error') {
    handleFrameExportError(message)
    sendResponse()
    return false
  }

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
    } else if (message.type === 'panel:open-window') {
      requestScopeWindow()
    } else if (message.type === 'panel:export-frame') {
      void requestFrameExport(port, message)
    } else if (message.type === 'panel:export-release') {
      completeFrameExport(port, message)
    }
  })

  port.onDisconnect.addListener(() => {
    clearPendingFrameExports(port)
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
