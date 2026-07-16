import type { VideoRect, ViewportSize } from '../shared/protocol'

const EDGE_TOLERANCE = 0.5

function sizeIsValid(size: ViewportSize): boolean {
  return (
    Number.isFinite(size.width) &&
    Number.isFinite(size.height) &&
    size.width > 0 &&
    size.height > 0
  )
}

function rectIsValid(rect: VideoRect): boolean {
  return (
    Number.isFinite(rect.left) &&
    Number.isFinite(rect.top) &&
    Number.isFinite(rect.width) &&
    Number.isFinite(rect.height) &&
    rect.width > 0 &&
    rect.height > 0
  )
}

/**
 * Maps CSS viewport coordinates into a tab-capture frame. Chromium preserves
 * the viewport aspect ratio and centers it inside the capture frame, adding
 * letterbox or pillarbox margins when their aspect ratios differ.
 */
export function mapViewportRectToCapture(
  rect: VideoRect,
  viewport: ViewportSize,
  capture: ViewportSize,
): VideoRect | null {
  if (!rectIsValid(rect) || !sizeIsValid(viewport) || !sizeIsValid(capture)) {
    return null
  }

  const viewportRight = rect.left + rect.width
  const viewportBottom = rect.top + rect.height

  if (
    rect.left < -EDGE_TOLERANCE ||
    rect.top < -EDGE_TOLERANCE ||
    viewportRight > viewport.width + EDGE_TOLERANCE ||
    viewportBottom > viewport.height + EDGE_TOLERANCE
  ) {
    return null
  }

  const scale = Math.min(
    capture.width / viewport.width,
    capture.height / viewport.height,
  )
  const contentWidth = viewport.width * scale
  const contentHeight = viewport.height * scale
  const offsetX = (capture.width - contentWidth) / 2
  const offsetY = (capture.height - contentHeight) / 2
  const mapped: VideoRect = {
    left: offsetX + Math.max(0, rect.left) * scale,
    top: offsetY + Math.max(0, rect.top) * scale,
    width: Math.min(rect.width, viewport.width - Math.max(0, rect.left)) * scale,
    height: Math.min(rect.height, viewport.height - Math.max(0, rect.top)) * scale,
  }

  if (
    mapped.left < -EDGE_TOLERANCE ||
    mapped.top < -EDGE_TOLERANCE ||
    mapped.left + mapped.width > capture.width + EDGE_TOLERANCE ||
    mapped.top + mapped.height > capture.height + EDGE_TOLERANCE
  ) {
    return null
  }

  return mapped
}
