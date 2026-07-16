import { afterEach, describe, expect, it, vi } from 'vitest'

import { LiveAnalysisScheduler } from '../src/shared/live-analysis-scheduler'

afterEach(() => {
  vi.useRealTimers()
})

describe('live analysis scheduler', () => {
  it('ticks immediately, repeats at the requested cadence and stops cleanly', async () => {
    vi.useFakeTimers()
    const onTick = vi.fn()
    const scheduler = new LiveAnalysisScheduler(100, onTick)

    scheduler.start()
    scheduler.start()
    expect(onTick).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(300)
    expect(onTick).toHaveBeenCalledTimes(4)

    scheduler.stop()
    await vi.advanceTimersByTimeAsync(300)
    expect(onTick).toHaveBeenCalledTimes(4)
  })

  it('rejects invalid intervals', () => {
    expect(() => new LiveAnalysisScheduler(0, () => undefined)).toThrow(/positive/)
  })

  it('continues scheduling after a transient tick error', async () => {
    vi.useFakeTimers()
    const onTick = vi
      .fn<() => void>()
      .mockImplementationOnce(() => {
        throw new Error('transient capture error')
      })
      .mockImplementation(() => undefined)
    const scheduler = new LiveAnalysisScheduler(100, onTick)

    expect(() => scheduler.start()).toThrow(/transient capture error/)
    await vi.advanceTimersByTimeAsync(100)
    expect(onTick).toHaveBeenCalledTimes(2)

    scheduler.stop()
  })
})
