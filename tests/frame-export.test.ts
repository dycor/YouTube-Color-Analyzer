import { describe, expect, it } from 'vitest'

import {
  canExportAnalyzedFrame,
  frameExportFileName,
  type FrameIdentity,
} from '../src/offscreen/frame-export'

const detailedFrame: FrameIdentity = {
  sessionId: 'session-a',
  frameId: 42,
  detailed: true,
}

describe('analyzed frame export', () => {
  it('accepts only the paused detailed frame shared by the scope and canvas', () => {
    expect(
      canExportAnalyzedFrame(
        { sessionId: 'session-a', frameId: 42 },
        'session-a',
        true,
        detailedFrame,
        detailedFrame,
      ),
    ).toBe(true)
  })

  it.each([
    ['playing', false, detailedFrame, detailedFrame],
    ['stale scope', true, { ...detailedFrame, frameId: 41 }, detailedFrame],
    ['stale canvas', true, detailedFrame, { ...detailedFrame, frameId: 43 }],
    ['live scope', true, { ...detailedFrame, detailed: false }, detailedFrame],
    ['live canvas', true, detailedFrame, { ...detailedFrame, detailed: false }],
  ])('rejects %s', (_name, paused, lastFrame, canvasFrame) => {
    expect(
      canExportAnalyzedFrame(
        { sessionId: 'session-a', frameId: 42 },
        'session-a',
        paused as boolean,
        lastFrame as FrameIdentity,
        canvasFrame as FrameIdentity,
      ),
    ).toBe(false)
  })

  it('uses a diagnostic filename without page or video identifiers', () => {
    expect(frameExportFileName(42, 1440, 1080)).toBe(
      'color-analyzer-frame-42-1440x1080.png',
    )
  })
})
