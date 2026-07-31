export interface FrameIdentity {
  sessionId: string
  frameId: number
  detailed: boolean
}

export interface FrameExportRequestIdentity {
  sessionId: string
  frameId: number
}

export function canExportAnalyzedFrame(
  request: FrameExportRequestIdentity,
  activeSessionId: string | null,
  paused: boolean,
  lastFrame: FrameIdentity | null,
  canvasFrame: FrameIdentity | null,
): boolean {
  return (
    paused &&
    request.sessionId === activeSessionId &&
    lastFrame?.sessionId === request.sessionId &&
    lastFrame.frameId === request.frameId &&
    lastFrame.detailed &&
    canvasFrame?.sessionId === request.sessionId &&
    canvasFrame.frameId === request.frameId &&
    canvasFrame.detailed
  )
}

export function frameExportFileName(
  frameId: number,
  width: number,
  height: number,
): string {
  return `color-analyzer-frame-${frameId}-${width}x${height}.png`
}
