import { describe, expect, it } from 'vitest'

import { mapViewportRectToCapture } from '../src/core/capture-geometry'

describe('tab capture geometry', () => {
  it('maps directly when the viewport and capture ratios match', () => {
    expect(
      mapViewportRectToCapture(
        { left: 100, top: 50, width: 800, height: 450 },
        { width: 1000, height: 600 },
        { width: 2000, height: 1200 },
      ),
    ).toEqual({ left: 200, top: 100, width: 1600, height: 900 })
  })

  it('accounts for capture pillarboxing around a narrow viewport', () => {
    expect(
      mapViewportRectToCapture(
        { left: 0, top: 0, width: 1000, height: 900 },
        { width: 1000, height: 900 },
        { width: 1920, height: 1080 },
      ),
    ).toEqual({ left: 360, top: 0, width: 1200, height: 1080 })
  })

  it('accounts for capture letterboxing around a wide viewport', () => {
    expect(
      mapViewportRectToCapture(
        { left: 200, top: 100, width: 1200, height: 675 },
        { width: 1600, height: 900 },
        { width: 1200, height: 1200 },
      ),
    ).toEqual({ left: 150, top: 337.5, width: 900, height: 506.25 })
  })

  it('keeps a player at the exact viewport edge inside the capture frame', () => {
    const mapped = mapViewportRectToCapture(
      { left: 0, top: 0, width: 1440, height: 810 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1200 },
    )

    expect(mapped).not.toBeNull()
    expect(mapped?.left).toBe(0)
    expect(mapped?.top).toBe(0)
    expect((mapped?.left ?? 0) + (mapped?.width ?? 0)).toBeLessThanOrEqual(1920)
  })

  it('rejects a rectangle outside the CSS viewport', () => {
    expect(
      mapViewportRectToCapture(
        { left: -20, top: 0, width: 1000, height: 600 },
        { width: 1000, height: 600 },
        { width: 1920, height: 1080 },
      ),
    ).toBeNull()
  })

  it('rejects invalid dimensions instead of producing a partial canvas', () => {
    expect(
      mapViewportRectToCapture(
        { left: 0, top: 0, width: 1000, height: 600 },
        { width: 0, height: 600 },
        { width: 1920, height: 1080 },
      ),
    ).toBeNull()
  })
})
