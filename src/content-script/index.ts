import type {
  PlaybackState,
  PlayerMode,
  PlayerSnapshot,
  PlayerSnapshotMessage,
  VideoRect,
} from '../shared/protocol'
import { isExtensionContextInvalidated } from '../shared/runtime-errors'

const SNAPSHOT_INTERVAL_MS = 250

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

let lastLocation = location.href
let disposed = false
let snapshotIntervalId: number | null = null

function handlePageStateChange(): void {
  void publishSnapshot()
}

function dispose(): void {
  if (disposed) {
    return
  }

  disposed = true

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

async function publishSnapshot(): Promise<void> {
  if (disposed) {
    return
  }

  const message: PlayerSnapshotMessage = {
    type: 'player:snapshot',
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
