import {
  DETAIL_WAVEFORM_X_BINS,
  LEVEL_BINS,
  LIVE_WAVEFORM_X_BINS,
  VECTOR_SIZE,
} from '../shared/constants'
import type { ScopeFrame } from '../shared/protocol'

export interface AnalyzePixelsInput {
  frameId: number
  capturedAt: number
  detailed: boolean
  width: number
  height: number
  rgba: Uint8ClampedArray
}

const BYTE_TO_UNIT = Float64Array.from(
  { length: LEVEL_BINS },
  (_, value) => value / (LEVEL_BINS - 1),
)
const VECTOR_MAX_INDEX = VECTOR_SIZE - 1

function clampVectorCoordinate(value: number): number {
  return Math.round(
    (value < 0 ? 0 : value > 1 ? 1 : value) * VECTOR_MAX_INDEX,
  )
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
  const xBinByColumn = new Uint16Array(width)
  const channelStride = xBins * LEVEL_BINS
  const redOffset = channelStride
  const greenOffset = channelStride * 2
  const blueOffset = channelStride * 3
  let sampleCount = 0

  for (let x = 0; x < width; x += 1) {
    xBinByColumn[x] = Math.floor((x * xBins) / width)
  }

  let pixelIndex = 0

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1, pixelIndex += 4) {
      const rByte = rgba[pixelIndex]!
      const gByte = rgba[pixelIndex + 1]!
      const bByte = rgba[pixelIndex + 2]!

      if (rgba[pixelIndex + 3] === 0) {
        continue
      }

      sampleCount += 1

      const r = BYTE_TO_UNIT[rByte]!
      const g = BYTE_TO_UNIT[gByte]!
      const b = BYTE_TO_UNIT[bByte]!
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const lumaByte = Math.round(luma * (LEVEL_BINS - 1))
      const columnOffset = xBinByColumn[x]! * LEVEL_BINS

      channelDensity[columnOffset + lumaByte]! += 1
      channelDensity[redOffset + columnOffset + rByte]! += 1
      channelDensity[greenOffset + columnOffset + gByte]! += 1
      channelDensity[blueOffset + columnOffset + bByte]! += 1

      const vectorX = clampVectorCoordinate((r - luma) / 1.5748 + 0.5)
      const vectorY = clampVectorCoordinate(0.5 - (b - luma) / 1.8556)
      vectorDensity[vectorY * VECTOR_SIZE + vectorX]! += 1
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
