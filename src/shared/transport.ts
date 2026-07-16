import type {
  DisplayScopeFrame,
  EncodedScopeFrame,
  ScopeFrame,
} from './protocol'

const WAVEFORM_DENSITY_EXPONENT = 0.35

function normalizeWaveformDensity(
  values: Uint32Array,
  xBins: number,
  levelBins: number,
): Uint8Array {
  const normalized = new Uint8Array(values.length)
  const channelStride = xBins * levelBins
  const channelCount = Math.floor(values.length / channelStride)

  for (let channel = 0; channel < channelCount; channel += 1) {
    for (let x = 0; x < xBins; x += 1) {
      const start = channel * channelStride + x * levelBins
      let columnTotal = 0

      for (let level = 0; level < levelBins; level += 1) {
        columnTotal += values[start + level] ?? 0
      }

      if (columnTotal === 0) {
        continue
      }

      for (let level = 0; level < levelBins; level += 1) {
        const value = values[start + level] ?? 0

        if (value > 0) {
          normalized[start + level] = Math.round(
            Math.pow(value / columnTotal, WAVEFORM_DENSITY_EXPONENT) * 255,
          )
        }
      }
    }
  }

  return normalized
}

function normalizePeakDensity(values: Uint32Array): Uint8Array {
  let maximum = 0

  for (const value of values) {
    maximum = Math.max(maximum, value)
  }

  const normalized = new Uint8Array(values.length)

  if (maximum === 0) {
    return normalized
  }

  const denominator = Math.log1p(maximum)

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index] ?? 0

    if (value > 0) {
      normalized[index] = Math.round((Math.log1p(value) / denominator) * 255)
    }
  }

  return normalized
}

function bytesToBase64(bytes: Uint8Array): string {
  const chunks: string[] = []
  const chunkSize = 0x8000

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, offset + chunkSize)
    chunks.push(String.fromCharCode(...chunk))
  }

  return btoa(chunks.join(''))
}

function base64ToBytes(encoded: string): Uint8Array {
  const binary = atob(encoded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

export function encodeScopeFrame(frame: ScopeFrame): EncodedScopeFrame {
  return {
    frameId: frame.frameId,
    capturedAt: frame.capturedAt,
    detailed: frame.detailed,
    sourceWidth: frame.sourceWidth,
    sourceHeight: frame.sourceHeight,
    xBins: frame.xBins,
    levelBins: frame.levelBins,
    vectorSize: frame.vectorSize,
    sampleCount: frame.sampleCount,
    computeMs: frame.computeMs,
    channelIntensityBase64: bytesToBase64(
      normalizeWaveformDensity(
        frame.channelDensity,
        frame.xBins,
        frame.levelBins,
      ),
    ),
    vectorIntensityBase64: bytesToBase64(
      normalizePeakDensity(frame.vectorDensity),
    ),
  }
}

export function decodeScopeFrame(frame: EncodedScopeFrame): DisplayScopeFrame {
  const channelIntensity = base64ToBytes(frame.channelIntensityBase64)
  const vectorIntensity = base64ToBytes(frame.vectorIntensityBase64)
  const expectedChannelLength = 4 * frame.xBins * frame.levelBins
  const expectedVectorLength = frame.vectorSize * frame.vectorSize

  if (
    channelIntensity.length !== expectedChannelLength ||
    vectorIntensity.length !== expectedVectorLength
  ) {
    throw new Error('The received measurement data is incomplete.')
  }

  return {
    frameId: frame.frameId,
    capturedAt: frame.capturedAt,
    detailed: frame.detailed,
    sourceWidth: frame.sourceWidth,
    sourceHeight: frame.sourceHeight,
    xBins: frame.xBins,
    levelBins: frame.levelBins,
    vectorSize: frame.vectorSize,
    sampleCount: frame.sampleCount,
    computeMs: frame.computeMs,
    channelIntensity,
    vectorIntensity,
  }
}
