import { describe, expect, it } from 'vitest'

import { AnalysisRequestGate } from '../src/shared/analysis-request-gate'

describe('analysis request gate', () => {
  it('allows only one in-flight request per active session', () => {
    const gate = new AnalysisRequestGate()

    expect(gate.tryBegin(1)).toBeNull()

    gate.startSession('session-a')
    const ticket = gate.tryBegin(1)

    expect(ticket).toEqual({ sessionId: 'session-a', frameId: 1 })
    expect(gate.sessionId).toBe('session-a')
    expect(gate.hasInFlight).toBe(true)
    expect(gate.tryBegin(2)).toBeNull()
  })

  it('accepts and releases the active ticket', () => {
    const gate = new AnalysisRequestGate()
    gate.startSession('session-a')
    const ticket = gate.tryBegin(1)

    expect(ticket).not.toBeNull()
    expect(gate.acceptResult(ticket!)).toBe(true)
    expect(gate.hasInFlight).toBe(false)
    expect(gate.acceptResult(ticket!)).toBe(false)
    expect(gate.tryBegin(2)).toEqual({
      sessionId: 'session-a',
      frameId: 2,
    })
  })

  it('ignores an old result without releasing the new session request', () => {
    const gate = new AnalysisRequestGate()
    gate.startSession('session-a')
    const oldTicket = gate.tryBegin(1)

    gate.startSession('session-b')
    const currentTicket = gate.tryBegin(2)

    expect(oldTicket).not.toBeNull()
    expect(currentTicket).not.toBeNull()
    expect(gate.acceptResult(oldTicket!)).toBe(false)
    expect(gate.hasInFlight).toBe(true)
    expect(gate.acceptResult(currentTicket!)).toBe(true)
  })

  it('invalidates the active ticket when the session stops', () => {
    const gate = new AnalysisRequestGate()
    gate.startSession('session-a')
    const ticket = gate.tryBegin(1)

    gate.stopSession()

    expect(ticket).not.toBeNull()
    expect(gate.sessionId).toBeNull()
    expect(gate.hasInFlight).toBe(false)
    expect(gate.acceptResult(ticket!)).toBe(false)
    expect(gate.tryBegin(2)).toBeNull()
  })

  it('releases only the matching failed ticket, or the active one when omitted', () => {
    const gate = new AnalysisRequestGate()
    gate.startSession('session-a')
    const ticket = gate.tryBegin(1)

    expect(ticket).not.toBeNull()
    expect(gate.fail({ sessionId: 'session-a', frameId: 2 })).toBe(false)
    expect(gate.fail({ sessionId: 'session-b', frameId: 1 })).toBe(false)
    expect(gate.hasInFlight).toBe(true)
    expect(gate.fail(ticket!)).toBe(true)
    expect(gate.hasInFlight).toBe(false)
    expect(gate.fail()).toBe(false)

    expect(gate.tryBegin(2)).not.toBeNull()
    expect(gate.fail()).toBe(true)
    expect(gate.hasInFlight).toBe(false)
  })
})
