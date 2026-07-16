import { describe, expect, it } from 'vitest'

import { composeColorizedWaveformPixel } from '../src/sidepanel/renderers'

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
