import type {
  PlaybackState,
  PlayerObservationReadyMessage,
  PlayerObservationState,
  PlayerMode,
  PlayerSnapshot,
  PlayerSnapshotMessage,
  RuntimeMessage,
  VideoRect,
} from '../shared/protocol'
import { isExtensionContextInvalidated } from '../shared/runtime-errors'

const SNAPSHOT_INTERVAL_MS = 250
// Manifest content scripts are classic scripts, so importing a runtime value
// shared with extension modules could make Rollup emit an unsupported ESM
// import. Keep these two literals mirrored with shared/protocol.ts; the release
// and privacy-consent tests verify both the values and the standalone bundle.
const PRIVACY_CONSENT_KEY = 'privacyConsentVersion'
const PRIVACY_CONSENT_VERSION = 1

function hasCurrentPrivacyConsent(value: unknown): boolean {
  return value === PRIVACY_CONSENT_VERSION
}

function getPlayerMode(player: HTMLElement | null): PlayerMode {
  if (document.pictureInPictureElement) {
    return 'picture-in-picture'
  }

  if (document.fullscreenElement) {
    return 'fullscreen'
  }

  if (player?.classList.contains('ytp-player-minimized')) {
    return 'miniplayer'
  }

  if (location.pathname !== '/watch') {
    return 'unsupported'
  }

  return document.body.classList.contains('watch-wide') ? 'theater' : 'normal'
}

function getPlaybackState(video: HTMLVideoElement | null): PlaybackState {
  if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    return 'unavailable'
  }

  if (video.seeking) {
    return 'seeking'
  }

  return video.paused ? 'paused' : 'playing'
}

function getVisibleVideoRect(video: HTMLVideoElement): VideoRect | null {
  const elementRect = video.getBoundingClientRect()

  if (
    elementRect.width <= 0 ||
    elementRect.height <= 0 ||
    video.videoWidth <= 0 ||
    video.videoHeight <= 0
  ) {
    return null
  }

  const scale = Math.min(
    elementRect.width / video.videoWidth,
    elementRect.height / video.videoHeight,
  )
  const width = video.videoWidth * scale
  const height = video.videoHeight * scale

  return {
    left: elementRect.left + (elementRect.width - width) / 2,
    top: elementRect.top + (elementRect.height - height) / 2,
    width,
    height,
  }
}

function elementIsVisible(element: Element): boolean {
  const htmlElement = element as HTMLElement
  const style = getComputedStyle(htmlElement)
  const rect = htmlElement.getBoundingClientRect()

  return style.visibility !== 'hidden' && style.display !== 'none' && rect.height > 0
}

function createSnapshot(): PlayerSnapshot {
  const video = document.querySelector<HTMLVideoElement>('video.html5-main-video')
  const player = document.querySelector<HTMLElement>('#movie_player')
  const supported = location.hostname === 'www.youtube.com' && location.pathname === '/watch'
  const mode = getPlayerMode(player)
  const captionsVisible = Array.from(
    document.querySelectorAll('.ytp-caption-window-container, .ytp-caption-segment'),
  ).some(elementIsVisible)

  return {
    supported,
    mediaId: new URLSearchParams(location.search).get('v'),
    pageVisible: document.visibilityState === 'visible',
    mode,
    playback: getPlaybackState(video),
    currentTime: video && Number.isFinite(video.currentTime) ? video.currentTime : 0,
    controlsVisible: player ? !player.classList.contains('ytp-autohide') : false,
    captionsVisible,
    hdrDetected: null,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    videoRect: video ? getVisibleVideoRect(video) : null,
    intrinsicVideoSize:
      video && video.videoWidth > 0 && video.videoHeight > 0
        ? { width: video.videoWidth, height: video.videoHeight }
        : null,
    capturedAt: performance.timeOrigin + performance.now(),
  }
}

let disposed = false
let observationActive = false
let activeSessionId: string | null = null
let observationGeneration = 0
let lastLocation = ''
let snapshotIntervalId: number | null = null

function handlePageStateChange(): void {
  void publishSnapshot()
}

function dispose(): void {
  if (disposed) {
    return
  }

  disposed = true

  stopObservation()
  chrome.storage.onChanged.removeListener(handleStorageChange)
  chrome.runtime.onMessage.removeListener(handleRuntimeMessage)
}

function stopObservation(sessionId?: string): void {
  if (sessionId !== undefined && sessionId !== activeSessionId) {
    return
  }

  activeSessionId = null

  if (!observationActive) {
    return
  }

  observationActive = false

  if (snapshotIntervalId !== null) {
    window.clearInterval(snapshotIntervalId)
    snapshotIntervalId = null
  }

  document.removeEventListener('visibilitychange', handlePageStateChange)
  document.removeEventListener('fullscreenchange', handlePageStateChange)
  document.removeEventListener('enterpictureinpicture', handlePageStateChange, true)
  document.removeEventListener('leavepictureinpicture', handlePageStateChange, true)
  document.removeEventListener('loadedmetadata', handlePageStateChange, true)
  document.removeEventListener('resize', handlePageStateChange, true)
  window.removeEventListener('resize', handlePageStateChange)
}

function startObservation(sessionId: string): void {
  if (disposed) {
    return
  }

  activeSessionId = sessionId

  if (observationActive) {
    void publishSnapshot()
    return
  }

  observationActive = true
  lastLocation = location.href
  snapshotIntervalId = window.setInterval(() => {
    if (location.href !== lastLocation) {
      lastLocation = location.href
    }

    void publishSnapshot()
  }, SNAPSHOT_INTERVAL_MS)

  document.addEventListener('visibilitychange', handlePageStateChange)
  document.addEventListener('fullscreenchange', handlePageStateChange)
  document.addEventListener('enterpictureinpicture', handlePageStateChange, true)
  document.addEventListener('leavepictureinpicture', handlePageStateChange, true)
  document.addEventListener('loadedmetadata', handlePageStateChange, true)
  document.addEventListener('resize', handlePageStateChange, true)
  window.addEventListener('resize', handlePageStateChange)

  void publishSnapshot()
}

function handleStorageChange(
  changes: Record<string, chrome.storage.StorageChange>,
  areaName: string,
): void {
  if (areaName !== 'local' || !(PRIVACY_CONSENT_KEY in changes)) {
    return
  }

  if (!hasCurrentPrivacyConsent(changes[PRIVACY_CONSENT_KEY]?.newValue)) {
    observationGeneration += 1
    stopObservation()
    return
  }

  void requestObservationState()
}

async function startObservationIfConsented(
  sessionId: string,
  generation: number,
): Promise<void> {
  try {
    const stored = await chrome.storage.local.get(PRIVACY_CONSENT_KEY)

    if (
      generation === observationGeneration &&
      hasCurrentPrivacyConsent(stored[PRIVACY_CONSENT_KEY])
    ) {
      startObservation(sessionId)
    }
  } catch (error) {
    if (isExtensionContextInvalidated(error)) {
      dispose()
    }
  }
}

function handleRuntimeMessage(message: RuntimeMessage): void {
  if (message.type === 'player:observation:start') {
    void requestObservationState(message.sessionId)
  } else if (message.type === 'player:observation:stop') {
    observationGeneration += 1
    stopObservation(message.sessionId)
  }
}

async function requestObservationState(expectedSessionId?: string): Promise<void> {
  if (disposed) {
    return
  }

  const generation = observationGeneration
  const message: PlayerObservationReadyMessage = {
    type: 'player:observation:ready',
  }

  try {
    const state = (await chrome.runtime.sendMessage(message)) as
      | PlayerObservationState
      | undefined

    if (generation !== observationGeneration) {
      return
    }

    if (
      typeof state?.sessionId === 'string' &&
      (expectedSessionId === undefined || state.sessionId === expectedSessionId)
    ) {
      await startObservationIfConsented(state.sessionId, generation)
    } else if (expectedSessionId === undefined) {
      stopObservation()
    } else {
      stopObservation(expectedSessionId)
    }
  } catch (error) {
    if (isExtensionContextInvalidated(error)) {
      dispose()
    }
  }
}

async function publishSnapshot(): Promise<void> {
  const sessionId = activeSessionId

  if (disposed || !observationActive || sessionId === null) {
    return
  }

  const message: PlayerSnapshotMessage = {
    type: 'player:snapshot',
    sessionId,
    snapshot: createSnapshot(),
  }

  try {
    await chrome.runtime.sendMessage(message)
  } catch (error) {
    if (isExtensionContextInvalidated(error)) {
      dispose()
    }
  }
}

chrome.storage.onChanged.addListener(handleStorageChange)
chrome.runtime.onMessage.addListener(handleRuntimeMessage)

void chrome.storage.local
  .get(PRIVACY_CONSENT_KEY)
  .then((stored) => {
    if (hasCurrentPrivacyConsent(stored[PRIVACY_CONSENT_KEY])) {
      void requestObservationState()
    }
  })
  .catch((error: unknown) => {
    if (isExtensionContextInvalidated(error)) {
      dispose()
    }
  })
