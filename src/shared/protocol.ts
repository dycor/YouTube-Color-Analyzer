export type ScopeKind = 'parade' | 'waveform' | 'vectorscope'
export type ParadeMode = 'yrgb' | 'rgb'
export type Channel = 'y' | 'r' | 'g' | 'b'
export type AnalysisSurface = 'sidepanel' | 'window'

export const PRIVACY_CONSENT_KEY = 'privacyConsentVersion'
export const PRIVACY_CONSENT_VERSION = 2

export function hasCurrentPrivacyConsent(value: unknown): boolean {
  return value === PRIVACY_CONSENT_VERSION
}

export const CHANNELS: readonly Channel[] = ['y', 'r', 'g', 'b']

export interface PanelSettings {
  activeScope: ScopeKind
  paradeMode: ParadeMode
  waveformChannels: Record<Channel, boolean>
  waveformColorized: boolean
  showSkinToneLine: boolean
  traceIntensity: number
}

export const DEFAULT_PANEL_SETTINGS: PanelSettings = {
  activeScope: 'parade',
  paradeMode: 'yrgb',
  waveformChannels: {
    y: false,
    r: true,
    g: true,
    b: true,
  },
  waveformColorized: true,
  showSkinToneLine: true,
  traceIntensity: 40,
}

export interface ViewportSize {
  width: number
  height: number
}

export interface VideoRect {
  left: number
  top: number
  width: number
  height: number
}

export type PlayerMode =
  | 'normal'
  | 'theater'
  | 'fullscreen'
  | 'miniplayer'
  | 'picture-in-picture'
  | 'unsupported'

export type PlaybackState = 'playing' | 'paused' | 'seeking' | 'unavailable'

export interface PlayerSnapshot {
  supported: boolean
  mediaId: string | null
  pageVisible: boolean
  mode: PlayerMode
  playback: PlaybackState
  currentTime: number
  controlsVisible: boolean
  captionsVisible: boolean
  hdrDetected: boolean | null
  viewport: ViewportSize
  videoRect: VideoRect | null
  intrinsicVideoSize: ViewportSize | null
  capturedAt: number
}

export interface CaptureStartMessage {
  type: 'capture:start'
  streamId: string
  tabId: number
  sessionId: string
}

export interface CaptureStopMessage {
  type: 'capture:stop'
  reason: SessionStopReason
  tabId?: number
  sessionId: string
}

export interface CaptureEndedMessage {
  type: 'capture:ended'
  tabId: number
  sessionId: string
}

export interface PanelFrameRequestMessage {
  type: 'panel:request-frame'
  target: 'offscreen'
  sessionId: string
}

export interface PlayerSnapshotMessage {
  type: 'player:snapshot'
  sessionId: string
  snapshot: PlayerSnapshot
}

export interface PlayerObservationStartMessage {
  type: 'player:observation:start'
  sessionId: string
}

export interface PlayerObservationStopMessage {
  type: 'player:observation:stop'
  sessionId: string
}

export interface PlayerObservationReadyMessage {
  type: 'player:observation:ready'
}

export interface PlayerObservationState {
  sessionId: string | null
}

export type SessionStopReason =
  | 'panel_closed'
  | 'navigation'
  | 'tab_closed'
  | 'replaced'
  | 'manual'

export type SessionStatus =
  | 'idle'
  | 'starting'
  | 'active'
  | 'paused'
  | 'suspended'
  | 'error'

export type SuspensionReason =
  | 'unsupported_page'
  | 'unsupported_mode'
  | 'video_missing'
  | 'video_not_visible'
  | 'controls_visible'
  | 'tab_inactive'
  | 'capture_stopped'

export interface SessionState {
  sessionId: string | null
  status: SessionStatus
  reason?: SuspensionReason | string
  captionsVisible?: boolean
  hdrDetected?: boolean | null
  message?: string
}

export interface ScopeFrame {
  frameId: number
  capturedAt: number
  detailed: boolean
  sourceWidth: number
  sourceHeight: number
  xBins: number
  levelBins: number
  vectorSize: number
  sampleCount: number
  computeMs: number
  channelMin: readonly [number, number, number]
  channelMax: readonly [number, number, number]
  channelDensity: Uint32Array
  vectorDensity: Uint32Array
}

export interface DisplayScopeFrame
  extends Omit<ScopeFrame, 'channelDensity' | 'vectorDensity'> {
  channelIntensity: Uint8Array
  vectorIntensity: Uint8Array
}

export interface EncodedScopeFrame
  extends Omit<DisplayScopeFrame, 'channelIntensity' | 'vectorIntensity'> {
  channelIntensityBase64: string
  vectorIntensityBase64: string
}

export interface AnalysisFrameMessage {
  type: 'analysis:frame'
  target: 'sidepanel'
  sessionId: string
  frame: EncodedScopeFrame
}

export interface SessionStateMessage {
  type: 'session:state'
  target: 'sidepanel' | 'service-worker'
  state: SessionState
}

export interface FrameExportRequestMessage {
  type: 'frame-export:request'
  target: 'offscreen'
  requestId: string
  sessionId: string
  frameId: number
}

export interface FrameExportReadyMessage {
  type: 'frame-export:ready'
  target: 'service-worker'
  requestId: string
  sessionId: string
  frameId: number
  objectUrl: string
  fileName: string
}

export interface FrameExportErrorMessage {
  type: 'frame-export:error'
  target: 'service-worker'
  requestId: string
  sessionId: string
  reason: 'unavailable' | 'busy' | 'encoding_failed'
}

export interface FrameExportReleaseMessage {
  type: 'frame-export:release'
  target: 'offscreen'
  requestId: string
  sessionId: string
  objectUrl: string
}

export type RuntimeMessage =
  | CaptureStartMessage
  | CaptureStopMessage
  | CaptureEndedMessage
  | PanelFrameRequestMessage
  | PlayerSnapshotMessage
  | PlayerObservationStartMessage
  | PlayerObservationStopMessage
  | PlayerObservationReadyMessage
  | AnalysisFrameMessage
  | SessionStateMessage
  | FrameExportRequestMessage
  | FrameExportReadyMessage
  | FrameExportErrorMessage
  | FrameExportReleaseMessage

export interface AnalyzeFrameRequest {
  type: 'analyze:frame'
  sessionId: string
  frameId: number
  capturedAt: number
  detailed: boolean
  width: number
  height: number
  rgba: ArrayBuffer
}

export interface AnalyzeFrameResponse {
  type: 'analyze:result'
  sessionId: string
  frame: EncodedScopeFrame
}

export type PanelPortMessage =
  | { type: 'panel:ready'; surface: AnalysisSurface }
  | { type: 'panel:stop' }
  | { type: 'panel:accept-and-start' }
  | { type: 'panel:cancel-consent' }
  | { type: 'panel:open-window' }
  | { type: 'panel:export-frame'; requestId: string; frameId: number }
  | {
      type: 'panel:export-ready'
      requestId: string
      frameId: number
      objectUrl: string
      fileName: string
    }
  | {
      type: 'panel:export-error'
      requestId: string
      reason: 'unavailable' | 'busy' | 'encoding_failed'
    }
  | {
      type: 'panel:export-release'
      requestId: string
      objectUrl: string
    }
