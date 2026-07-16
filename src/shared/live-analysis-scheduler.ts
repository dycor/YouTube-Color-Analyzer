export class LiveAnalysisScheduler {
  private running = false
  private timer: ReturnType<typeof globalThis.setTimeout> | null = null

  public constructor(
    private readonly intervalMs: number,
    private readonly onTick: () => void,
  ) {
    if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
      throw new Error('The live analysis interval must be positive.')
    }
  }

  public start(): void {
    if (this.running) {
      return
    }

    this.running = true
    this.tick()
  }

  public stop(): void {
    this.running = false

    if (this.timer !== null) {
      globalThis.clearTimeout(this.timer)
      this.timer = null
    }
  }

  private readonly tick = (): void => {
    if (!this.running) {
      return
    }

    try {
      this.onTick()
    } finally {
      if (this.running) {
        this.timer = globalThis.setTimeout(this.tick, this.intervalMs)
      }
    }
  }
}
