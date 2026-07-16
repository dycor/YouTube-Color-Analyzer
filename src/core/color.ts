export interface VectorPoint {
  cb: number
  cr: number
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

export function byteToUnit(value: number): number {
  return clamp01(value / 255)
}

export function unitToByte(value: number): number {
  return Math.round(clamp01(value) * 255)
}

export function rec709Luma(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function rgbToVectorscope(r: number, g: number, b: number): VectorPoint {
  const y = rec709Luma(r, g, b)

  return {
    cb: (b - y) / 1.8556,
    cr: (r - y) / 1.5748,
  }
}

export function vectorPointToBin(
  point: VectorPoint,
  size: number,
): { x: number; y: number } {
  const maxIndex = size - 1
  const x = Math.round((clamp01(point.cr + 0.5)) * maxIndex)
  const y = Math.round((clamp01(0.5 - point.cb)) * maxIndex)

  return { x, y }
}

