export type ScopeKind = 'parade' | 'waveform' | 'vectorscope'
export type ParadeMode = 'yrgb' | 'rgb'
export type Channel = 'y' | 'r' | 'g' | 'b'

export const CHANNELS: readonly Channel[] = ['y', 'r', 'g', 'b']

export interface PanelSettings {
  activeScope: ScopeKind
  paradeMode: ParadeMode
  waveformChannels: Record<Channel, boolean>
  waveformColorized: boolean
  showSkinToneLine: boolean
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
  snapshot: PlayerSnapshot
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

export type RuntimeMessage =
  | CaptureStartMessage
  | CaptureStopMessage
  | CaptureEndedMessage
  | PanelFrameRequestMessage
  | PlayerSnapshotMessage
  | AnalysisFrameMessage
  | SessionStateMessage

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

export type PanelPortMessage = { type: 'panel:ready' } | { type: 'panel:stop' }
