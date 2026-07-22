import { describe, expect, it } from 'vitest'

import {
  LatestCaptureStartQueue,
  type CaptureStartTicket,
} from '../src/service-worker/capture-start-queue'

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

describe('latest capture start queue', () => {
  it('invalidates a running request when capture is cancelled', async () => {
    const queue = new LatestCaptureStartQueue<string>()
    const gate = deferred()
    let ticket: CaptureStartTicket<string> | null = null
    const request = queue.request('tab-a', async (current) => {
      ticket = current
      await gate.promise
    })

    await Promise.resolve()
    expect(ticket).not.toBeNull()
    expect(queue.isCurrent(ticket!.generation)).toBe(true)

    queue.cancel()
    expect(queue.latestTarget()).toBeNull()
    expect(queue.isCurrent(ticket!.generation)).toBe(false)

    gate.resolve()
    await request
  })

  it('runs the latest queued target and supersedes intermediate requests', async () => {
    const queue = new LatestCaptureStartQueue<string>()
    const gate = deferred()
    const started: string[] = []
    const first = queue.request('tab-a', async ({ target }) => {
      started.push(target)
      await gate.promise
    })

    await Promise.resolve()
    const second = queue.request('tab-b', async ({ target }) => {
      started.push(target)
    })
    const third = queue.request('tab-c', async ({ target }) => {
      started.push(target)
    })

    await second
    gate.resolve()
    await Promise.all([first, third])

    expect(started).toEqual(['tab-a', 'tab-c'])
    expect(queue.latestTarget()).toBeNull()
  })
})
