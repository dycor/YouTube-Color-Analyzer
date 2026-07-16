import {
  DETAIL_WAVEFORM_X_BINS,
  LEVEL_BINS,
  LIVE_WAVEFORM_X_BINS,
  VECTOR_SIZE,
} from '../shared/constants'
import type { ScopeFrame } from '../shared/protocol'
import { byteToUnit, rec709Luma, rgbToVectorscope, unitToByte, vectorPointToBin } from './color'

export interface AnalyzePixelsInput {
  frameId: number
  capturedAt: number
  detailed: boolean
  width: number
  height: number
  rgba: Uint8ClampedArray
}

function channelIndex(
  channel: number,
  x: number,
  level: number,
  xBins: number,
): number {
  return (channel * xBins + x) * LEVEL_BINS + level
}

export function analyzePixels(input: AnalyzePixelsInput): ScopeFrame {
  const startedAt = performance.now()
  const { width, height, rgba } = input

  if (width <= 0 || height <= 0) {
    throw new RangeError('The analysis dimensions must be positive.')
  }

  if (rgba.length !== width * height * 4) {
    throw new RangeError('The RGBA buffer does not match the analysis dimensions.')
  }

  const xBins = Math.min(
    width,
    input.detailed ? DETAIL_WAVEFORM_X_BINS : LIVE_WAVEFORM_X_BINS,
  )
  const channelDensity = new Uint32Array(4 * xBins * LEVEL_BINS)
  const vectorDensity = new Uint32Array(VECTOR_SIZE * VECTOR_SIZE)
  let sampleCount = 0

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixelIndex = (y * width + x) * 4
      const rByte = rgba[pixelIndex]
      const gByte = rgba[pixelIndex + 1]
      const bByte = rgba[pixelIndex + 2]
      const alphaByte = rgba[pixelIndex + 3]

      if (
        rByte === undefined ||
        gByte === undefined ||
        bByte === undefined ||
        alphaByte === undefined ||
        alphaByte === 0
      ) {
        continue
      }

      sampleCount += 1

      const r = byteToUnit(rByte)
      const g = byteToUnit(gByte)
      const b = byteToUnit(bByte)
      const lumaByte = unitToByte(rec709Luma(r, g, b))
      const xBin = Math.min(xBins - 1, Math.floor((x * xBins) / width))

      const yIndex = channelIndex(0, xBin, lumaByte, xBins)
      const rIndex = channelIndex(1, xBin, rByte, xBins)
      const gIndex = channelIndex(2, xBin, gByte, xBins)
      const bIndex = channelIndex(3, xBin, bByte, xBins)
      channelDensity[yIndex] = (channelDensity[yIndex] ?? 0) + 1
      channelDensity[rIndex] = (channelDensity[rIndex] ?? 0) + 1
      channelDensity[gIndex] = (channelDensity[gIndex] ?? 0) + 1
      channelDensity[bIndex] = (channelDensity[bIndex] ?? 0) + 1

      const vectorBin = vectorPointToBin(rgbToVectorscope(r, g, b), VECTOR_SIZE)
      const vectorIndex = vectorBin.y * VECTOR_SIZE + vectorBin.x
      vectorDensity[vectorIndex] = (vectorDensity[vectorIndex] ?? 0) + 1
    }
  }

  return {
    frameId: input.frameId,
    capturedAt: input.capturedAt,
    detailed: input.detailed,
    sourceWidth: width,
    sourceHeight: height,
    xBins,
    levelBins: LEVEL_BINS,
    vectorSize: VECTOR_SIZE,
    sampleCount,
    computeMs: performance.now() - startedAt,
    channelDensity,
    vectorDensity,
  }
}
