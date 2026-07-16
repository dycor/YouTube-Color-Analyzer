export interface AnalysisTicket {
  sessionId: string
  frameId: number
}

export class AnalysisRequestGate {
  private activeSessionId: string | null = null
  private inFlight: AnalysisTicket | null = null

  public startSession(sessionId: string): void {
    this.activeSessionId = sessionId
    this.inFlight = null
  }

  public stopSession(): void {
    this.activeSessionId = null
    this.inFlight = null
  }

  public get sessionId(): string | null {
    return this.activeSessionId
  }

  public get hasInFlight(): boolean {
    return this.inFlight !== null
  }

  public tryBegin(frameId: number): AnalysisTicket | null {
    if (this.activeSessionId === null || this.inFlight !== null) {
      return null
    }

    const ticket: AnalysisTicket = {
      sessionId: this.activeSessionId,
      frameId,
    }
    this.inFlight = ticket
    return ticket
  }

  public acceptResult(ticket: AnalysisTicket): boolean {
    if (
      this.activeSessionId === null ||
      ticket.sessionId !== this.activeSessionId ||
      !this.matchesInFlight(ticket)
    ) {
      return false
    }

    this.inFlight = null
    return true
  }

  public fail(ticket?: AnalysisTicket): boolean {
    if (this.inFlight === null) {
      return false
    }

    if (ticket !== undefined && !this.matchesInFlight(ticket)) {
      return false
    }

    this.inFlight = null
    return true
  }

  private matchesInFlight(ticket: AnalysisTicket): boolean {
    return (
      this.inFlight !== null &&
      ticket.sessionId === this.inFlight.sessionId &&
      ticket.frameId === this.inFlight.frameId
    )
  }
}
