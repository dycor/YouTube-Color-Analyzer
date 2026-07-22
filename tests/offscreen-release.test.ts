import { describe, expect, it, vi } from 'vitest'

import {
  releaseAnalysisCanvas,
  releaseCaptureVideo,
} from '../src/offscreen/release-surfaces'

describe('offscreen surface release', () => {
  it('shrinks the analysis canvas so the previous pixel buffer is discarded', () => {
    const canvas = { width: 1920, height: 1080 }

    releaseAnalysisCanvas(canvas)

    expect(canvas).toEqual({ width: 1, height: 1 })
  })

  it('detaches and reloads the capture video', () => {
    const pause = vi.fn()
    const removeAttribute = vi.fn()
    const load = vi.fn()
    const video = {
      pause,
      srcObject: {} as MediaStream,
      removeAttribute,
      load,
    }

    releaseCaptureVideo(video)

    expect(pause).toHaveBeenCalledOnce()
    expect(video.srcObject).toBeNull()
    expect(removeAttribute).toHaveBeenCalledWith('src')
    expect(load).toHaveBeenCalledOnce()
  })
})
