import {
  DETAIL_MAX_HEIGHT,
  DETAIL_MAX_WIDTH,
  LIVE_MAX_HEIGHT,
  LIVE_MAX_WIDTH,
  MAX_ANALYSIS_HZ,
  TARGET_COMPUTE_MS,
} from '../shared/constants'
import { mapViewportRectToCapture } from '../core/capture-geometry'
import { translate as t } from '../shared/i18n'
import {
  DetailedAnalysisGate,
  detailedFrameSignature,
} from '../shared/detailed-analysis'
import { AnalysisRequestGate } from '../shared/analysis-request-gate'
import type {
  AnalysisFrameMessage,
  AnalyzeFrameRequest,
  AnalyzeFrameResponse,
  CaptureEndedMessage,
  CaptureStartMessage,
  PanelFrameRequestMessage,
  PlayerSnapshot,
  PlayerSnapshotMessage,
  RuntimeMessage,
  SessionStateMessage,
  SessionState,
  SessionStopReason,
} from '../shared/protocol'
import { LiveAnalysisScheduler } from '../shared/live-analysis-scheduler'

const captureVideo = document.createElement('video')
const analysisCanvas = new OffscreenCanvas(1, 1)
const context = analysisCanvas.getContext('2d', { willReadFrequently: true })
const detailedAnalysisGate = new DetailedAnalysisGate()
const analysisRequests = new AnalysisRequestGate()

captureVideo.autoplay = true
captureVideo.muted = true
captureVideo.playsInline = true

let activeTabId: number | null = null
let captureStream: MediaStream | null = null
let playerSnapshot: PlayerSnapshot | null = null
let pendingDetailedFrame = false
let frameId = 0
let lastAnalysisAt = 0
let minimumIntervalMs = 1000 / MAX_ANALYSIS_HZ
let lastStateSignature = ''
let lastFrameMessage: AnalysisFrameMessage | null = null

type LocalSessionState = Omit<SessionState, 'sessionId'>

function createAnalyzerWorker(): Worker {
  const worker = new Worker(
    new URL('../analyzer-worker/index.ts', import.meta.url),
    { type: 'module' },
  )
  worker.addEventListener('message', (event: MessageEvent<AnalyzeFrameResponse>) => {
    handleAnalyzerMessage(worker, event)
  })
  worker.addEventListener('error', () => {
    handleAnalyzerFailure(worker)
  })
  worker.addEventListener('messageerror', () => {
    handleAnalyzerFailure(worker)
  })
  return worker
}

let analyzer: Worker | null = null

function ensureAnalyzerWorker(): Worker {
  analyzer ??= createAnalyzerWorker()
  return analyzer
}
const liveAnalysisScheduler = new LiveAnalysisScheduler(
  1000 / MAX_ANALYSIS_HZ,
  () => {
    if (playerSnapshot?.playback === 'playing') {
      analyzeCurrentFrame(false)
    }
  },
)

async function publishState(state: LocalSessionState): Promise<void> {
  const completeState: SessionState = {
    ...state,
    sessionId: analysisRequests.sessionId,
  }
  const signature = JSON.stringify(completeState)

  if (signature === lastStateSignature) {
    return
  }

  lastStateSignature = signature
  const message: SessionStateMessage = {
    type: 'session:state',
    target: 'service-worker',
    state: completeState,
  }
  await chrome.runtime.sendMessage(message).catch(() => undefined)
}

function stopTracks(): void {
  liveAnalysisScheduler.stop()
  analysisRequests.stopSession()
  analyzer?.terminate()
  analyzer = null

  if (captureStream) {
    for (const track of captureStream.getTracks()) {
      track.stop()
    }
  }

  captureStream = null
  captureVideo.srcObject = null
  pendingDetailedFrame = false
  playerSnapshot = null
  lastFrameMessage = null
  detailedAnalysisGate.reset()
}

function stopCapture(reason: SessionStopReason): void {
  stopTracks()
  activeTabId = null
  void publishState(
    reason === 'manual'
      ? { status: 'idle' }
      : { status: 'idle', reason: 'capture_stopped' },
  )
}

function sessionStateForSnapshot(snapshot: PlayerSnapshot): LocalSessionState {
  const shared = {
    captionsVisible: snapshot.captionsVisible,
    hdrDetected: snapshot.hdrDetected,
  }

  if (!snapshot.supported) {
    return { status: 'suspended', reason: 'unsupported_page', ...shared }
  }

  if (!snapshot.pageVisible) {
    return { status: 'suspended', reason: 'tab_inactive', ...shared }
  }

  if (snapshot.mode !== 'normal' && snapshot.mode !== 'theater') {
    return { status: 'suspended', reason: 'unsupported_mode', ...shared }
  }

  if (!snapshot.videoRect || snapshot.playback === 'unavailable') {
    return { status: 'suspended', reason: 'video_missing', ...shared }
  }

  const { videoRect, viewport } = snapshot
  const fullyVisible =
    videoRect.left >= 0 &&
    videoRect.top >= 0 &&
    videoRect.left + videoRect.width <= viewport.width &&
    videoRect.top + videoRect.height <= viewport.height

  if (!fullyVisible) {
    return { status: 'suspended', reason: 'video_not_visible', ...shared }
  }

  if (snapshot.controlsVisible) {
    return { status: 'suspended', reason: 'controls_visible', ...shared }
  }

  return {
    status: snapshot.playback === 'paused' ? 'paused' : 'active',
    ...shared,
  }
}

function dimensionsWithin(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const scale = Math.min(1, maxWidth / width, maxHeight / height)

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

function analyzeCurrentFrame(detailed: boolean): boolean {
  const snapshot = playerSnapshot
  const videoRect = snapshot?.videoRect

  if (
    !context ||
    !snapshot ||
    !videoRect ||
    !captureStream ||
    !analysisRequests.sessionId
  ) {
    return false
  }

  if (analysisRequests.hasInFlight) {
    pendingDetailedFrame ||= detailed
    return detailed
  }

  const state = sessionStateForSnapshot(snapshot)
  void publishState(state)

  if (state.status !== 'active' && state.status !== 'paused') {
    return false
  }

  const now = performance.now()

  if (!detailed && now - lastAnalysisAt < minimumIntervalMs) {
    return false
  }

  const captureWidth = captureVideo.videoWidth
  const captureHeight = captureVideo.videoHeight

  if (captureWidth <= 0 || captureHeight <= 0) {
    return false
  }

  const source = mapViewportRectToCapture(videoRect, snapshot.viewport, {
    width: captureWidth,
    height: captureHeight,
  })

  if (!source) {
    void publishState({ status: 'suspended', reason: 'video_not_visible' })
    return false
  }

  const target = dimensionsWithin(
    source.width,
    source.height,
    detailed ? DETAIL_MAX_WIDTH : LIVE_MAX_WIDTH,
    detailed ? DETAIL_MAX_HEIGHT : LIVE_MAX_HEIGHT,
  )
  const nextFrameId = frameId + 1
  const ticket = analysisRequests.tryBegin(nextFrameId)

  if (!ticket) {
    return false
  }

  try {
    analysisCanvas.width = target.width
    analysisCanvas.height = target.height
    context.imageSmoothingEnabled = false
    context.clearRect(0, 0, target.width, target.height)
    context.drawImage(
      captureVideo,
      source.left,
      source.top,
      source.width,
      source.height,
      0,
      0,
      target.width,
      target.height,
    )

    const imageData = context.getImageData(0, 0, target.width, target.height)
    const rgba = imageData.data.buffer
    const request: AnalyzeFrameRequest = {
      type: 'analyze:frame',
      sessionId: ticket.sessionId,
      frameId: ticket.frameId,
      capturedAt: snapshot.capturedAt,
      detailed,
      width: target.width,
      height: target.height,
      rgba,
    }

    frameId = nextFrameId
    lastAnalysisAt = now
    ensureAnalyzerWorker().postMessage(request, [rgba])
    return true
  } catch (error) {
    analysisRequests.fail(ticket)

    if (detailed) {
      detailedAnalysisGate.reset()
    }

    console.error('Unable to analyze the captured frame.', error)
    void publishState({ status: 'error', message: t('analysisFailed') })
    return false
  }
}

async function startCapture(message: CaptureStartMessage): Promise<void> {
  stopTracks()
  activeTabId = message.tabId
  analysisRequests.startSession(message.sessionId)
  minimumIntervalMs = 1000 / MAX_ANALYSIS_HZ
  lastAnalysisAt = 0
  await publishState({ status: 'starting' })

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'tab',
        chromeMediaSourceId: message.streamId,
      },
    },
  } as unknown as MediaStreamConstraints

  let stream: MediaStream | null = null

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints)

    if (
      analysisRequests.sessionId !== message.sessionId ||
      activeTabId !== message.tabId
    ) {
      for (const track of stream.getTracks()) {
        track.stop()
      }
      return
    }

    const activeStream = stream
    captureStream = activeStream
    for (const track of activeStream.getTracks()) {
      track.addEventListener(
        'ended',
        () => {
          void handleCaptureTrackEnded(
            activeStream,
            message.tabId,
            message.sessionId,
          )
        },
        { once: true },
      )
    }
    captureVideo.srcObject = activeStream
    await captureVideo.play()

    if (
      captureStream !== activeStream ||
      analysisRequests.sessionId !== message.sessionId
    ) {
      for (const track of activeStream.getTracks()) {
        track.stop()
      }
      return
    }

    await publishState({ status: 'active' })
    liveAnalysisScheduler.start()
  } catch (error) {
    if (analysisRequests.sessionId !== message.sessionId) {
      for (const track of stream?.getTracks() ?? []) {
        track.stop()
      }
      return
    }

    console.error('Unable to consume the tab capture stream.', error)
    await publishState({
      status: 'error',
      message: t('captureFailed'),
    })
    stopTracks()
    activeTabId = null
    await notifyCaptureEnded(message.tabId, message.sessionId)
  }
}

async function notifyCaptureEnded(
  tabId: number,
  sessionId: string,
): Promise<void> {
  const message: CaptureEndedMessage = {
    type: 'capture:ended',
    tabId,
    sessionId,
  }
  await chrome.runtime.sendMessage(message).catch(() => undefined)
}

async function handleCaptureTrackEnded(
  stream: MediaStream,
  tabId: number,
  sessionId: string,
): Promise<void> {
  if (
    captureStream !== stream ||
    activeTabId !== tabId ||
    analysisRequests.sessionId !== sessionId
  ) {
    return
  }

  stopTracks()
  activeTabId = null
  await notifyCaptureEnded(tabId, sessionId)
  await publishState({ status: 'idle', reason: 'capture_stopped' })
}

function handleAnalyzerMessage(
  source: Worker,
  event: MessageEvent<AnalyzeFrameResponse>,
): void {
  if (source !== analyzer) {
    return
  }

  const response = event.data

  if (response.type !== 'analyze:result') {
    return
  }

  const accepted = analysisRequests.acceptResult({
    sessionId: response.sessionId,
    frameId: response.frame.frameId,
  })

  if (!accepted) {
    return
  }

  minimumIntervalMs = Math.max(
    1000 / MAX_ANALYSIS_HZ,
    response.frame.computeMs > TARGET_COMPUTE_MS
      ? response.frame.computeMs * 1.25
      : 1000 / MAX_ANALYSIS_HZ,
  )

  const message: AnalysisFrameMessage = {
    type: 'analysis:frame',
    target: 'sidepanel',
    sessionId: response.sessionId,
    frame: response.frame,
  }
  lastFrameMessage = message
  void chrome.runtime.sendMessage(message).catch(() => undefined)

  if (pendingDetailedFrame) {
    pendingDetailedFrame = false
    analyzeCurrentFrame(true)
  }
}

function handleAnalyzerFailure(source: Worker): void {
  if (source !== analyzer) {
    return
  }

  source.terminate()
  analyzer = null
  analysisRequests.fail()
  pendingDetailedFrame = false
  detailedAnalysisGate.reset()

  if (analysisRequests.sessionId) {
    void publishState({ status: 'error', message: t('analysisFailed') })
  }
}

function replayCurrentFrame(message: PanelFrameRequestMessage): void {
  if (message.sessionId !== analysisRequests.sessionId) {
    return
  }

  if (lastFrameMessage?.sessionId === message.sessionId) {
    void chrome.runtime.sendMessage(lastFrameMessage).catch(() => undefined)
    return
  }

  if (playerSnapshot?.playback === 'paused') {
    detailedAnalysisGate.reset()
    detailedAnalysisGate.requestIfChanged(
      detailedFrameSignature(playerSnapshot),
      () => analyzeCurrentFrame(true),
    )
  }
}

chrome.runtime.onMessage.addListener(
  (message: RuntimeMessage, sender: chrome.runtime.MessageSender) => {
    if (message.type === 'capture:start') {
      void startCapture(message)
      return
    }

    if (message.type === 'capture:stop') {
      if (
        message.sessionId === analysisRequests.sessionId &&
        (message.tabId === undefined || message.tabId === activeTabId)
      ) {
        stopCapture(message.reason)
      }
      return
    }

    if (message.type === 'panel:request-frame') {
      replayCurrentFrame(message)
      return
    }

    if (
      message.type === 'player:snapshot' &&
      sender.tab?.id === activeTabId
    ) {
      const snapshotMessage: PlayerSnapshotMessage = message
      playerSnapshot = snapshotMessage.snapshot
      void publishState(sessionStateForSnapshot(playerSnapshot))

      if (playerSnapshot.playback === 'paused') {
        detailedAnalysisGate.requestIfChanged(
          detailedFrameSignature(playerSnapshot),
          () => analyzeCurrentFrame(true),
        )
      } else if (playerSnapshot.playback === 'playing') {
        detailedAnalysisGate.reset()
        analyzeCurrentFrame(false)
      }
    }
  },
)
