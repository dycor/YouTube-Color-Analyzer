import { describe, expect, it, vi } from 'vitest'

import { DetailedAnalysisGate } from '../src/shared/detailed-analysis'

describe('detailed analysis gate', () => {
  it('requests an unchanged paused frame only once', () => {
    const gate = new DetailedAnalysisGate()
    const request = vi.fn(() => true)

    expect(gate.requestIfChanged('video-a:12.500', request)).toBe(true)
    expect(gate.requestIfChanged('video-a:12.500', request)).toBe(false)
    expect(gate.requestIfChanged('video-a:12.500', request)).toBe(false)
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('requests a new frame after the time or video changes', () => {
    const gate = new DetailedAnalysisGate()
    const request = vi.fn(() => true)

    gate.requestIfChanged('video-a:12.500', request)
    gate.requestIfChanged('video-a:13.000', request)
    gate.requestIfChanged('video-b:13.000', request)

    expect(request).toHaveBeenCalledTimes(3)
  })

  it('retries a frame that could not be scheduled', () => {
    const gate = new DetailedAnalysisGate()
    const request = vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)

    expect(gate.requestIfChanged('video-a:12.500', request)).toBe(false)
    expect(gate.requestIfChanged('video-a:12.500', request)).toBe(true)
    expect(request).toHaveBeenCalledTimes(2)
  })

  it('allows the same frame again after live playback resumes', () => {
    const gate = new DetailedAnalysisGate()
    const request = vi.fn(() => true)

    gate.requestIfChanged('video-a:12.500', request)
    gate.reset()
    gate.requestIfChanged('video-a:12.500', request)

    expect(request).toHaveBeenCalledTimes(2)
  })
})
