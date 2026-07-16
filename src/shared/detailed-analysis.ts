import type { PlayerSnapshot } from './protocol'

export function detailedFrameSignature(snapshot: PlayerSnapshot): string {
  const intrinsic = snapshot.intrinsicVideoSize
  const rect = snapshot.videoRect

  return [
    snapshot.mediaId ?? 'unknown',
    snapshot.currentTime.toFixed(3),
    snapshot.viewport.width,
    snapshot.viewport.height,
    intrinsic?.width ?? 0,
    intrinsic?.height ?? 0,
    rect?.left.toFixed(2) ?? 0,
    rect?.top.toFixed(2) ?? 0,
    rect?.width.toFixed(2) ?? 0,
    rect?.height.toFixed(2) ?? 0,
  ].join(':')
}

export class DetailedAnalysisGate {
  private lastRequestedSignature: string | null = null

  public reset(): void {
    this.lastRequestedSignature = null
  }

  public requestIfChanged(
    signature: string,
    request: () => boolean,
  ): boolean {
    if (signature === this.lastRequestedSignature) {
      return false
    }

    if (!request()) {
      return false
    }

    this.lastRequestedSignature = signature
    return true
  }
}
