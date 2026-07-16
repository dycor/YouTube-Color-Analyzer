import { describe, expect, it } from 'vitest'

import type { ScopeFrame } from '../src/shared/protocol'
import { decodeScopeFrame, encodeScopeFrame } from '../src/shared/transport'

function scopeFrame(): ScopeFrame {
  return {
    frameId: 7,
    capturedAt: 123,
    detailed: false,
    sourceWidth: 2,
    sourceHeight: 2,
    xBins: 2,
    levelBins: 2,
    vectorSize: 2,
    sampleCount: 4,
    computeMs: 4.2,
    channelDensity: new Uint32Array([
      0, 1, 4, 16,
      0, 0, 0, 0,
      2, 2, 2, 2,
      1, 3, 9, 0,
    ]),
    vectorDensity: new Uint32Array([0, 1, 4, 16]),
  }
}

describe('scope frame transport', () => {
  it('converts typed densities to a compact JSON-safe frame', () => {
    const encoded = encodeScopeFrame(scopeFrame())
    const serialized = JSON.parse(JSON.stringify(encoded)) as typeof encoded
    const decoded = decodeScopeFrame(serialized)

    expect(decoded.frameId).toBe(7)
    expect(decoded.channelIntensity).toBeInstanceOf(Uint8Array)
    expect(decoded.channelIntensity).toHaveLength(16)
    expect(decoded.vectorIntensity).toHaveLength(4)
    expect(decoded.channelIntensity[0]).toBe(0)
    expect(Math.max(...decoded.channelIntensity)).toBe(255)
    expect(decoded.vectorIntensity[3]).toBe(255)
  })

  it('rejects incomplete frame payloads', () => {
    const encoded = encodeScopeFrame(scopeFrame())
    encoded.channelIntensityBase64 = btoa('\u0000')

    expect(() => decodeScopeFrame(encoded)).toThrow(/incomplete/)
  })

  it('keeps waveform brightness stable when sampling density changes', () => {
    const original = scopeFrame()
    const denser: ScopeFrame = {
      ...scopeFrame(),
      sampleCount: original.sampleCount * 2,
      channelDensity: Uint32Array.from(
        original.channelDensity,
        (value) => value * 2,
      ),
    }

    const originalIntensity = decodeScopeFrame(
      encodeScopeFrame(original),
    ).channelIntensity
    const denserIntensity = decodeScopeFrame(
      encodeScopeFrame(denser),
    ).channelIntensity

    expect(denserIntensity).toEqual(originalIntensity)
  })
})
