/// <reference lib="webworker" />

import { analyzePixels } from '../core/analyze'
import type { AnalyzeFrameRequest, AnalyzeFrameResponse } from '../shared/protocol'
import { encodeScopeFrame } from '../shared/transport'

const worker = self as DedicatedWorkerGlobalScope

worker.addEventListener('message', (event: MessageEvent<AnalyzeFrameRequest>) => {
  const request = event.data

  if (request.type !== 'analyze:frame') {
    return
  }

  const startedAt = performance.now()
  const scopeFrame = analyzePixels({
    frameId: request.frameId,
    capturedAt: request.capturedAt,
    detailed: request.detailed,
    width: request.width,
    height: request.height,
    rgba: new Uint8ClampedArray(request.rgba),
  })

  const frame = encodeScopeFrame(scopeFrame)
  frame.computeMs = performance.now() - startedAt
  const response: AnalyzeFrameResponse = {
    type: 'analyze:result',
    sessionId: request.sessionId,
    frame,
  }

  worker.postMessage(response)
})
