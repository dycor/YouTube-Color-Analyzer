interface ResizableCanvas {
  width: number
  height: number
}

interface ReleasableVideo {
  pause(): void
  srcObject: MediaProvider | null
  removeAttribute(name: string): void
  load(): void
}

export function releaseAnalysisCanvas(canvas: ResizableCanvas): void {
  // Assigning a canvas dimension resets its bitmap and releases the previous
  // backing store. Keep only the smallest valid surface between sessions.
  canvas.width = 1
  canvas.height = 1
}

export function releaseCaptureVideo(video: ReleasableVideo): void {
  video.pause()
  video.srcObject = null
  video.removeAttribute('src')
  video.load()
}
