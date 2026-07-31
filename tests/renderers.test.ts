import { describe, expect, it } from 'vitest'

import {
  composeColorizedWaveformPixel,
  scaleTraceIntensity,
} from '../src/sidepanel/renderers'

describe('colorized waveform composition', () => {
  it('keeps a weak red trace saturated instead of applying intensity twice', () => {
    expect(composeColorizedWaveformPixel(0, 64, 0, 0)).toEqual([
      255, 0, 0, 64,
    ])
  })

  it('renders coincident RGB traces as white', () => {
    expect(composeColorizedWaveformPixel(0, 64, 64, 64)).toEqual([
      255, 255, 255, 64,
    ])
  })

  it('adds the white reference trace without losing channel color', () => {
    expect(composeColorizedWaveformPixel(64, 64, 0, 0)).toEqual([
      255, 128, 128, 128,
    ])
  })
})

describe('trace intensity', () => {
  it('keeps level 50 neutral', () => {
    expect(scaleTraceIntensity(64, 50)).toBe(64)
  })

  it('is monotonic and clamps bright traces', () => {
    expect(scaleTraceIntensity(64, 25)).toBeLessThan(64)
    expect(scaleTraceIntensity(64, 75)).toBeGreaterThan(64)
    expect(scaleTraceIntensity(255, 100)).toBe(255)
    expect(scaleTraceIntensity(0, 100)).toBe(0)
  })

  it('falls back to the default for invalid settings', () => {
    expect(scaleTraceIntensity(100, Number.NaN)).toBe(
      scaleTraceIntensity(100, 40),
    )
  })
})
