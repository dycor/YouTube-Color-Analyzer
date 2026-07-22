import { describe, expect, it } from 'vitest'

import { analyzePixels } from '../src/core/analyze'
import {
  byteToUnit,
  rec709Luma,
  rgbToVectorscope,
  unitToByte,
  vectorPointToBin,
} from '../src/core/color'

function pixelBuffer(
  pixels: Array<readonly [number, number, number, number?]>,
): Uint8ClampedArray {
  return new Uint8ClampedArray(
    pixels.flatMap(([r, g, b, a = 255]) => [r, g, b, a]),
  )
}

function channelValue(
  density: Uint32Array,
  channel: number,
  x: number,
  level: number,
  xBins: number,
): number {
  return density[(channel * xBins + x) * 256 + level] ?? 0
}

function channelSum(
  density: Uint32Array,
  channel: number,
  xBins: number,
): number {
  let sum = 0
  const start = channel * xBins * 256
  const end = start + xBins * 256

  for (let index = start; index < end; index += 1) {
    sum += density[index] ?? 0
  }

  return sum
}

describe('scope analysis', () => {
  it('accumulates black at level zero and at the vectorscope center', () => {
    const frame = analyzePixels({
      frameId: 1,
      capturedAt: 0,
      detailed: false,
      width: 1,
      height: 1,
      rgba: pixelBuffer([[0, 0, 0]]),
    })

    expect(channelValue(frame.channelDensity, 0, 0, 0, frame.xBins)).toBe(1)
    expect(channelValue(frame.channelDensity, 1, 0, 0, frame.xBins)).toBe(1)
    expect(channelValue(frame.channelDensity, 2, 0, 0, frame.xBins)).toBe(1)
    expect(channelValue(frame.channelDensity, 3, 0, 0, frame.xBins)).toBe(1)
    expect(frame.vectorDensity[128 * 256 + 128]).toBe(1)
  })

  it('accumulates white at level 255 for every channel', () => {
    const frame = analyzePixels({
      frameId: 2,
      capturedAt: 0,
      detailed: true,
      width: 1,
      height: 1,
      rgba: pixelBuffer([[255, 255, 255]]),
    })

    for (const channel of [0, 1, 2, 3]) {
      expect(channelValue(frame.channelDensity, channel, 0, 255, frame.xBins)).toBe(1)
    }
  })

  it('computes the Rec.709 luma level for red', () => {
    const frame = analyzePixels({
      frameId: 3,
      capturedAt: 0,
      detailed: false,
      width: 1,
      height: 1,
      rgba: pixelBuffer([[255, 0, 0]]),
    })

    expect(channelValue(frame.channelDensity, 0, 0, 54, frame.xBins)).toBe(1)
    expect(channelValue(frame.channelDensity, 1, 0, 255, frame.xBins)).toBe(1)
    expect(channelValue(frame.channelDensity, 2, 0, 0, frame.xBins)).toBe(1)
    expect(channelValue(frame.channelDensity, 3, 0, 0, frame.xBins)).toBe(1)
  })

  it('preserves horizontal pixel correspondence', () => {
    const frame = analyzePixels({
      frameId: 4,
      capturedAt: 0,
      detailed: false,
      width: 4,
      height: 1,
      rgba: pixelBuffer([
        [0, 0, 0],
        [64, 64, 64],
        [128, 128, 128],
        [255, 255, 255],
      ]),
    })

    expect(frame.xBins).toBe(4)
    expect(channelValue(frame.channelDensity, 1, 0, 0, frame.xBins)).toBe(1)
    expect(channelValue(frame.channelDensity, 1, 1, 64, frame.xBins)).toBe(1)
    expect(channelValue(frame.channelDensity, 1, 2, 128, frame.xBins)).toBe(1)
    expect(channelValue(frame.channelDensity, 1, 3, 255, frame.xBins)).toBe(1)
  })

  it('uses more horizontal bins for a detailed paused frame', () => {
    const pixels = Array.from(
      { length: 1200 },
      () => [128, 128, 128] as const,
    )
    const live = analyzePixels({
      frameId: 5,
      capturedAt: 0,
      detailed: false,
      width: 1200,
      height: 1,
      rgba: pixelBuffer(pixels),
    })
    const detailed = analyzePixels({
      frameId: 6,
      capturedAt: 0,
      detailed: true,
      width: 1200,
      height: 1,
      rgba: pixelBuffer(pixels),
    })

    expect(live.xBins).toBe(512)
    expect(detailed.xBins).toBe(1024)
  })

  it('ignores transparent canvas pixels instead of measuring them as black', () => {
    const frame = analyzePixels({
      frameId: 7,
      capturedAt: 0,
      detailed: false,
      width: 2,
      height: 1,
      rgba: pixelBuffer([
        [0, 0, 0, 0],
        [128, 128, 128, 255],
      ]),
    })

    expect(frame.sampleCount).toBe(1)
    expect(channelValue(frame.channelDensity, 0, 0, 0, frame.xBins)).toBe(0)
    expect(channelValue(frame.channelDensity, 0, 1, 128, frame.xBins)).toBe(1)
  })

  it('accounts for every pixel exactly once in every instrument', () => {
    const frame = analyzePixels({
      frameId: 8,
      capturedAt: 0,
      detailed: false,
      width: 2,
      height: 2,
      rgba: pixelBuffer([
        [255, 0, 0],
        [0, 255, 0],
        [0, 0, 255],
        [255, 255, 255],
      ]),
    })

    for (const channel of [0, 1, 2, 3]) {
      expect(channelSum(frame.channelDensity, channel, frame.xBins)).toBe(4)
    }

    expect(frame.vectorDensity.reduce((sum, value) => sum + value, 0)).toBe(4)
  })

  it('matches the reference color conversion for a representative live frame', () => {
    const width = 640
    const height = 3
    const rgba = new Uint8ClampedArray(width * height * 4)

    for (let pixel = 0; pixel < width * height; pixel += 1) {
      const offset = pixel * 4
      rgba[offset] = (pixel * 31) % 256
      rgba[offset + 1] = (pixel * 67) % 256
      rgba[offset + 2] = (pixel * 101) % 256
      rgba[offset + 3] = pixel % 17 === 0 ? 0 : 255
    }

    const frame = analyzePixels({
      frameId: 9,
      capturedAt: 0,
      detailed: false,
      width,
      height,
      rgba,
    })
    const expectedChannels = new Uint32Array(frame.channelDensity.length)
    const expectedVectors = new Uint32Array(frame.vectorDensity.length)

    for (let pixel = 0; pixel < width * height; pixel += 1) {
      const offset = pixel * 4

      if (rgba[offset + 3] === 0) {
        continue
      }

      const rByte = rgba[offset]!
      const gByte = rgba[offset + 1]!
      const bByte = rgba[offset + 2]!
      const r = byteToUnit(rByte)
      const g = byteToUnit(gByte)
      const b = byteToUnit(bByte)
      const x = pixel % width
      const xBin = Math.floor((x * frame.xBins) / width)
      const luma = unitToByte(rec709Luma(r, g, b))

      for (const [channel, level] of [
        [0, luma],
        [1, rByte],
        [2, gByte],
        [3, bByte],
      ] as const) {
        const index = (channel * frame.xBins + xBin) * 256 + level
        expectedChannels[index]! += 1
      }

      const vector = vectorPointToBin(rgbToVectorscope(r, g, b), 256)
      expectedVectors[vector.y * 256 + vector.x]! += 1
    }

    expect(frame.channelDensity).toEqual(expectedChannels)
    expect(frame.vectorDensity).toEqual(expectedVectors)
  })

  it('rejects buffers whose size does not match the frame', () => {
    expect(() =>
      analyzePixels({
        frameId: 10,
        capturedAt: 0,
        detailed: false,
        width: 2,
        height: 2,
        rgba: new Uint8ClampedArray(4),
      }),
    ).toThrow(/does not match/)
  })
})
