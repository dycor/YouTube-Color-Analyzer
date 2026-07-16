import { describe, expect, it } from 'vitest'

import { isExtensionContextInvalidated } from '../src/shared/runtime-errors'

describe('extension runtime errors', () => {
  it('detects the error emitted after an extension reload', () => {
    expect(
      isExtensionContextInvalidated(
        new Error('Uncaught (in promise) Error: Extension context invalidated.'),
      ),
    ).toBe(true)
  })

  it('does not confuse a transient messaging error with invalidation', () => {
    expect(
      isExtensionContextInvalidated(
        new Error('Could not establish connection. Receiving end does not exist.'),
      ),
    ).toBe(false)
  })
})
