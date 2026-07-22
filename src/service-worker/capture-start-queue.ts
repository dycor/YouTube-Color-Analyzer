export interface CaptureStartTicket<Target> {
  generation: number
  target: Target
}

interface PendingStart<Target> {
  reject: (error: unknown) => void
  resolve: () => void
  run: (ticket: CaptureStartTicket<Target>) => Promise<void>
  ticket: CaptureStartTicket<Target>
}

export class LatestCaptureStartQueue<Target> {
  private draining = false
  private generation = 0
  private latest: Target | null = null
  private pending: PendingStart<Target> | null = null

  request(
    target: Target,
    run: (ticket: CaptureStartTicket<Target>) => Promise<void>,
  ): Promise<void> {
    const ticket = {
      generation: ++this.generation,
      target,
    }
    this.latest = target

    return new Promise((resolve, reject) => {
      this.pending?.resolve()
      this.pending = { reject, resolve, run, ticket }
      void this.drain()
    })
  }

  cancel(): void {
    this.generation += 1
    this.latest = null
    this.pending?.resolve()
    this.pending = null
  }

  isCurrent(generation: number): boolean {
    return generation === this.generation
  }

  latestTarget(): Target | null {
    return this.latest
  }

  private async drain(): Promise<void> {
    if (this.draining) {
      return
    }

    this.draining = true

    try {
      while (this.pending !== null) {
        const current = this.pending
        this.pending = null

        try {
          if (this.isCurrent(current.ticket.generation)) {
            await current.run(current.ticket)
          }
        } catch (error) {
          current.reject(error)
          continue
        } finally {
          if (this.isCurrent(current.ticket.generation)) {
            this.latest = null
          }
          current.resolve()
        }
      }
    } finally {
      this.draining = false

      if (this.pending !== null) {
        void this.drain()
      }
    }
  }
}
