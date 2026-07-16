import { describe, expect, it } from 'vitest'

import {
  rec709Luma,
  rgbToVectorscope,
  unitToByte,
  vectorPointToBin,
} from '../src/core/color'

describe('Rec.709 color conversion', () => {
  it('uses the expected luma coefficients', () => {
    expect(rec709Luma(1, 0, 0)).toBeCloseTo(0.2126, 4)
    expect(rec709Luma(0, 1, 0)).toBeCloseTo(0.7152, 4)
    expect(rec709Luma(0, 0, 1)).toBeCloseTo(0.0722, 4)
    expect(rec709Luma(1, 1, 1)).toBeCloseTo(1, 8)
  })

  it('maps neutral colors to the vectorscope center', () => {
    const point = rgbToVectorscope(0.5, 0.5, 0.5)
    expect(point.cb).toBeCloseTo(0, 8)
    expect(point.cr).toBeCloseTo(0, 8)
    expect(vectorPointToBin(point, 256)).toEqual({ x: 128, y: 128 })
  })

  it('places red toward positive Cr and blue toward positive Cb', () => {
    const red = rgbToVectorscope(1, 0, 0)
    const blue = rgbToVectorscope(0, 0, 1)

    expect(red.cr).toBeGreaterThan(0)
    expect(blue.cb).toBeGreaterThan(0)
  })

  it('converts normalized values to byte levels', () => {
    expect(unitToByte(0)).toBe(0)
    expect(unitToByte(0.5)).toBe(128)
    expect(unitToByte(1)).toBe(255)
  })
})

