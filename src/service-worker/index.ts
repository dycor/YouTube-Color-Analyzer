import { PANEL_DISCONNECT_GRACE_MS, PANEL_PORT } from '../shared/constants'
import { translate as t } from '../shared/i18n'
import type {
  CaptureEndedMessage,
  CaptureStartMessage,
  CaptureStopMessage,
  PanelFrameRequestMessage,
  PanelPortMessage,
  RuntimeMessage,
  SessionState,
  SessionStateMessage,
  SessionStopReason,
} from '../shared/protocol'

const ACTIVE_CAPTURE_KEY = 'activeCapture'
const LAST_SESSION_STATE_KEY = 'lastSessionState'

interface ActiveCapture {
  tabId: number
  sessionId: string
}

let activeCapture: ActiveCapture | null = null
let actionClickInFlight = false
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

async function stopCapture(reason: SessionStopReason): Promise<void> {
  const capture = await getActiveCapture()

  if (capture === null) {
    return
  }

  const message: CaptureStopMessage = {
    type: 'capture:stop',
    reason,
    tabId: capture.tabId,
    sessionId: capture.sessionId,
  }

  await setActiveCapture(null)
  await chrome.runtime.sendMessage(message).catch(() => undefined)
  await publishSessionState(
    reason === 'manual'
      ? { status: 'idle', sessionId: null }
      : { status: 'idle', reason: 'capture_stopped', sessionId: null },
  )
}

async function requestCurrentFrame(): Promise<void> {
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

async function handleActionClick(tab: chrome.tabs.Tab): Promise<void> {
  if (tab.id === undefined) {
    return
  }

  const tabId = tab.id
  const openPanelPromise = chrome.sidePanel.open({ windowId: tab.windowId })

  if (!isSupportedWatchPage(tab.url)) {
    await stopCapture('navigation')
    await openPanelPromise
    await publishSessionState({
      status: 'suspended',
      reason: 'unsupported_page',
      sessionId: null,
    })
    return
  }

  const sessionId = crypto.randomUUID()
  const streamIdPromise = chrome.tabCapture.getMediaStreamId({ targetTabId: tabId })

  try {
    const [streamId] = await Promise.all([streamIdPromise, ensureOffscreenDocument()])
    const previousCapture = await getActiveCapture()

    if (previousCapture !== null) {
      await stopCapture('replaced')
    }

    await setActiveCapture({ tabId, sessionId })
    await publishSessionState({ status: 'starting', sessionId })

    const message: CaptureStartMessage = {
      type: 'capture:start',
      streamId,
      tabId,
      sessionId,
    }

    await chrome.runtime.sendMessage(message)
  } catch (error) {
    const capture = await getActiveCapture()

    if (capture?.sessionId === sessionId) {
      await setActiveCapture(null)
    }

    console.error('Unable to start tab capture.', error)
    await openPanelPromise.catch(() => undefined)
    await publishSessionState({
      status: 'error',
      sessionId: null,
      message: t('captureFailed'),
    })
  } finally {
    await openPanelPromise
  }
}

chrome.action.onClicked.addListener((tab) => {
  if (actionClickInFlight) {
    void chrome.sidePanel.open({ windowId: tab.windowId }).catch(() => undefined)
    return
  }

  actionClickInFlight = true
  void handleActionClick(tab).finally(() => {
    actionClickInFlight = false
  })
})

chrome.runtime.onMessage.addListener((message: RuntimeMessage, _sender, sendResponse) => {
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
      void stopCapture('manual')
    }
  })

  port.onDisconnect.addListener(() => {
    panelPorts.delete(port)
    cancelPendingPanelClose()

    pendingPanelClose = globalThis.setTimeout(() => {
      pendingPanelClose = null

      if (panelPorts.size === 0) {
        void stopCapture('panel_closed')
      }
    }, PANEL_DISCONNECT_GRACE_MS)
  })
})

chrome.tabs.onRemoved.addListener((tabId) => {
  void getActiveCapture().then((capture) => {
    if (tabId === capture?.tabId) {
      void stopCapture('tab_closed')
    }
  })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url === undefined || isSupportedWatchPage(changeInfo.url)) {
    return
  }

  void getActiveCapture().then((capture) => {
    if (tabId === capture?.tabId) {
      void stopCapture('navigation')
    }
  })
})
