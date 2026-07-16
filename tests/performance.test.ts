import { expect, it } from 'vitest'

import { analyzePixels } from '../src/core/analyze'

it('analyzes a live 640 × 360 sample within the product budget', () => {
  const width = 640
  const height = 360
  const rgba = new Uint8ClampedArray(width * height * 4)

  for (let index = 0; index < rgba.length; index += 4) {
    const pixel = index / 4
    rgba[index] = pixel % 256
    rgba[index + 1] = Math.floor(pixel / width) % 256
    rgba[index + 2] = (pixel * 17) % 256
    rgba[index + 3] = 255
  }

  const frame = analyzePixels({
    frameId: 1,
    capturedAt: 0,
    detailed: false,
    width,
    height,
    rgba,
  })

  expect(frame.computeMs).toBeLessThan(50)
})

