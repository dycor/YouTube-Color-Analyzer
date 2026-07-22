import './styles.css'

import { PANEL_PORT } from '../shared/constants'
import {
  activeLanguageTag,
  translate as t,
} from '../shared/i18n'
import {
  DEFAULT_PANEL_SETTINGS,
  hasCurrentPrivacyConsent,
  PRIVACY_CONSENT_KEY,
  PRIVACY_CONSENT_VERSION,
  type Channel,
  type DisplayScopeFrame,
  type PanelPortMessage,
  type PanelSettings,
  type RuntimeMessage,
  type ScopeKind,
  type SessionState,
} from '../shared/protocol'
import { decodeScopeFrame } from '../shared/transport'
import { renderScope } from './renderers'

function requiredElement<ElementType extends Element>(selector: string): ElementType {
  const element = document.querySelector<ElementType>(selector)

  if (!element) {
    throw new Error(`The required element ${selector} is missing.`)
  }

  return element
}

const app = requiredElement<HTMLDivElement>('#app')
const numberFormatter = new Intl.NumberFormat(activeLanguageTag)

document.documentElement.lang = activeLanguageTag
document.title = t('productName')

app.innerHTML = `
  <main class="app-shell">
    <div class="ambient-orbit ambient-orbit-one" aria-hidden="true"></div>
    <div class="ambient-orbit ambient-orbit-two" aria-hidden="true"></div>

    <section
      class="consent-gate"
      id="consent-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
    >
      <div class="consent-card">
        <div class="consent-card-heading">
          <div class="brand-sigil consent-sigil" aria-hidden="true">
            <svg viewBox="0 0 48 48" focusable="false">
              <path d="M8 27.5c5.5-10 13.5-15 24-15 4.4 0 7.5 3.1 7.5 7.5v8c0 4.4-3.1 7.5-7.5 7.5H17" />
              <circle cx="10" cy="27.5" r="2.5" />
              <path d="m17 35.5 5.5-5.5" />
            </svg>
          </div>
          <div>
            <p class="eyebrow">PRIVACY // LOCAL</p>
            <h2 id="consent-title">${t('consentTitle')}</h2>
          </div>
        </div>

        <p class="consent-intro">${t('consentIntro')}</p>
        <ul class="consent-data-list">
          <li>${t('consentPageData')}</li>
          <li>${t('consentVisualData')}</li>
          <li>${t('consentOverlayData')}</li>
        </ul>
        <p>${t('consentLocal')}</p>
        <p>${t('consentStorage')}</p>
        <p>${t('consentStop')}</p>

        <p class="consent-feedback" id="consent-feedback" role="status" hidden></p>

        <div class="consent-actions">
          <button class="consent-action" id="cancel-consent" type="button">
            ${t('consentCancel')}
          </button>
          <button class="consent-action" id="accept-consent" type="button">
            ${t('consentAccept')}
          </button>
        </div>

        <a
          class="privacy-link consent-privacy-link"
          href="https://dycor.github.io/YouTube-Color-Analyzer/privacy/"
          target="_blank"
          rel="noreferrer"
        >${t('privacyPolicy')}</a>
      </div>
    </section>

    <header class="hud-header">
      <div class="brand-lockup">
        <div class="brand-sigil" aria-hidden="true">
          <svg viewBox="0 0 48 48" focusable="false">
            <path d="M8 27.5c5.5-10 13.5-15 24-15 4.4 0 7.5 3.1 7.5 7.5v8c0 4.4-3.1 7.5-7.5 7.5H17" />
            <circle cx="10" cy="27.5" r="2.5" />
            <path d="m17 35.5 5.5-5.5" />
          </svg>
        </div>
        <div>
          <p class="eyebrow">YT // SCOPES</p>
          <h1>${t('productName')}</h1>
        </div>
      </div>

      <div class="header-actions">
        <div class="session-chip" id="session-chip" data-status="idle">
          <span class="status-dot" aria-hidden="true"></span>
          <span id="session-chip-label">${t('chipWaiting')}</span>
        </div>
        <button class="stop-button" id="stop-analysis" type="button">
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <rect x="5.5" y="5.5" width="9" height="9" rx="1.5" />
          </svg>
          <span>${t('stop')}</span>
        </button>
      </div>
    </header>

    <nav class="scope-tabs" aria-label="${t('instrumentsLabel')}">
      <button type="button" data-scope="parade" aria-label="${t('parade')}">
        <span class="tab-index">01</span>
        <span class="tab-label">${t('parade')}</span>
        <span class="tab-signal" aria-hidden="true"></span>
      </button>
      <button type="button" data-scope="waveform" aria-label="${t('waveform')}">
        <span class="tab-index">02</span>
        <span class="tab-label">${t('waveform')}</span>
        <span class="tab-signal" aria-hidden="true"></span>
      </button>
      <button type="button" data-scope="vectorscope" aria-label="${t('vectorscope')}">
        <span class="tab-index">03</span>
        <span class="tab-label">${t('vectorscope')}</span>
        <span class="tab-signal" aria-hidden="true"></span>
      </button>
    </nav>

    <section class="scope-stage">
      <header class="stage-header">
        <div class="scope-identity">
          <span class="section-kicker">${t('activeInstrument')}</span>
          <div class="scope-title-row">
            <span class="scope-code" id="scope-code">01</span>
            <h2 id="scope-name">${t('parade')} YRGB</h2>
          </div>
        </div>
        <span class="signal-standard" id="signal-standard">SDR · YRGB</span>
      </header>

      <div class="scope-viewport">
        <span class="viewport-corner corner-top-left" aria-hidden="true"></span>
        <span class="viewport-corner corner-top-right" aria-hidden="true"></span>
        <span class="viewport-corner corner-bottom-left" aria-hidden="true"></span>
        <span class="viewport-corner corner-bottom-right" aria-hidden="true"></span>

        <canvas id="scope-canvas" aria-label="${t('scopeDisplay')}"></canvas>

        <div class="session-banner" id="session-banner" data-status="idle">
          <div class="session-banner-topline">
            <span>${t('sourceStatus')}</span>
            <span class="session-pulse" aria-hidden="true"></span>
          </div>
          <strong id="session-title">${t('waiting')}</strong>
          <p id="session-detail">${t('openWatchAndClick')}</p>
        </div>
      </div>

      <div class="scope-meta">
        <div class="telemetry-item">
          <span>${t('source')}</span>
          <strong id="quality-label">${t('noMeasurement')}</strong>
        </div>
        <div class="telemetry-item">
          <span>${t('samples')}</span>
          <strong id="sample-count-label">—</strong>
        </div>
        <div class="telemetry-item telemetry-performance">
          <span>${t('compute')}</span>
          <strong id="performance-label">—</strong>
        </div>
      </div>
    </section>

    <section class="control-deck">
      <header class="control-deck-header">
        <div>
          <span class="section-kicker">${t('controlDeck')}</span>
          <strong id="control-scope-label">${t('parade')}</strong>
        </div>
        <span class="deck-standard">SDR / CHROME RENDER</span>
      </header>

      <div class="scope-toolbar" id="parade-controls">
        <span class="control-label">${t('composition')}</span>
        <label class="select-control">
          <span>${t('paradeMode')}</span>
          <span class="select-shell">
            <select id="parade-mode">
              <option value="yrgb">YRGB</option>
              <option value="rgb">RGB</option>
            </select>
          </span>
        </label>
      </div>

      <div class="scope-toolbar waveform-controls" id="waveform-controls">
        <fieldset class="channel-bank">
          <legend>${t('channels')}</legend>
          <label class="channel-chip channel-y"><input type="checkbox" data-channel="y" /><span>Y</span></label>
          <label class="channel-chip channel-r"><input type="checkbox" data-channel="r" /><span>R</span></label>
          <label class="channel-chip channel-g"><input type="checkbox" data-channel="g" /><span>G</span></label>
          <label class="channel-chip channel-b"><input type="checkbox" data-channel="b" /><span>B</span></label>
        </fieldset>
        <label class="switch-control">
          <input type="checkbox" id="waveform-colorized" />
          <span class="switch-track" aria-hidden="true"><span></span></span>
          <span class="switch-copy"><strong>${t('colorize')}</strong><small>${t('rgbOverlay')}</small></span>
        </label>
      </div>

      <div class="scope-toolbar" id="vectorscope-controls">
        <label class="switch-control">
          <input type="checkbox" id="skin-tone-line" />
          <span class="switch-track" aria-hidden="true"><span></span></span>
          <span class="switch-copy"><strong>${t('skinToneLine')}</strong><small>${t('rec709Guide')}</small></span>
        </label>
      </div>
    </section>

    <div class="alert-stack">
      <aside class="warning" id="caption-warning" hidden>
        <span class="warning-icon" aria-hidden="true">CC</span>
        <span>${t('captionWarning')}</span>
      </aside>
      <aside class="warning" id="hdr-warning" hidden>
        <span class="warning-icon" aria-hidden="true">HDR</span>
        <span>${t('hdrWarning')}</span>
      </aside>
    </div>

    <footer>
      <span class="privacy-dot" aria-hidden="true"></span>
      <span>${t('privacy')}</span>
      <a
        class="privacy-link"
        href="https://dycor.github.io/YouTube-Color-Analyzer/privacy/"
        target="_blank"
        rel="noreferrer"
      >${t('privacyPolicy')}</a>
      <span class="version-label">V1.0.0</span>
    </footer>
  </main>
`

const canvas = requiredElement<HTMLCanvasElement>('#scope-canvas')
const sessionBanner = requiredElement<HTMLDivElement>('#session-banner')
const sessionTitle = requiredElement<HTMLElement>('#session-title')
const sessionDetail = requiredElement<HTMLElement>('#session-detail')
const captionWarning = requiredElement<HTMLElement>('#caption-warning')
const hdrWarning = requiredElement<HTMLElement>('#hdr-warning')
const qualityLabel = requiredElement<HTMLElement>('#quality-label')
const performanceLabel = requiredElement<HTMLElement>('#performance-label')
const sampleCountLabel = requiredElement<HTMLElement>('#sample-count-label')
const scopeCode = requiredElement<HTMLElement>('#scope-code')
const scopeName = requiredElement<HTMLElement>('#scope-name')
const signalStandard = requiredElement<HTMLElement>('#signal-standard')
const controlScopeLabel = requiredElement<HTMLElement>('#control-scope-label')
const sessionChip = requiredElement<HTMLElement>('#session-chip')
const sessionChipLabel = requiredElement<HTMLElement>('#session-chip-label')
const paradeMode = requiredElement<HTMLSelectElement>('#parade-mode')
const waveformColorized = requiredElement<HTMLInputElement>('#waveform-colorized')
const skinToneLine = requiredElement<HTMLInputElement>('#skin-tone-line')
const stopButton = requiredElement<HTMLButtonElement>('#stop-analysis')
const consentGate = requiredElement<HTMLElement>('#consent-gate')
const consentFeedback = requiredElement<HTMLElement>('#consent-feedback')
const acceptConsentButton = requiredElement<HTMLButtonElement>('#accept-consent')
const cancelConsentButton = requiredElement<HTMLButtonElement>('#cancel-consent')

let settings: PanelSettings = structuredClone(DEFAULT_PANEL_SETTINGS)
let currentFrame: DisplayScopeFrame | null = null
let currentState: SessionState = { status: 'idle', sessionId: null }

function mergeSettings(stored: Partial<PanelSettings> | undefined): PanelSettings {
  return {
    ...structuredClone(DEFAULT_PANEL_SETTINGS),
    ...stored,
    waveformChannels: {
      ...DEFAULT_PANEL_SETTINGS.waveformChannels,
      ...stored?.waveformChannels,
    },
  }
}

async function saveSettings(): Promise<void> {
  await chrome.storage.local.set({ panelSettings: settings })
}

function statusCopy(state: SessionState): { title: string; detail: string } {
  if (state.status === 'starting') {
    return { title: t('initializing'), detail: t('connecting') }
  }

  if (state.status === 'active') {
    return { title: t('liveAnalysis'), detail: t('synchronized') }
  }

  if (state.status === 'paused') {
    return { title: t('detailedFrame'), detail: t('pausedMeasurement') }
  }

  if (state.status === 'error') {
    return { title: t('captureUnavailable'), detail: state.message ?? t('genericError') }
  }

  const suspensionCopy: Record<string, string> = {
    unsupported_page: t('unsupportedPage'),
    unsupported_mode: t('unsupportedMode'),
    video_missing: t('videoNotReady'),
    video_not_visible: t('videoNotVisible'),
    controls_visible: t('hideControls'),
    tab_inactive: t('returnToTab'),
    capture_stopped: t('restartAnalysis'),
  }

  if (state.status === 'suspended') {
    return {
      title: t('analysisSuspended'),
      detail: suspensionCopy[state.reason ?? ''] ?? t('sourceUnavailable'),
    }
  }

  if (state.reason === 'capture_stopped') {
    return {
      title: t('analysisStopped'),
      detail: t('restartCapture'),
    }
  }

  return {
    title: t('waiting'),
    detail: t('openWatchAndClick'),
  }
}

function syncControls(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-scope]').forEach((button) => {
    const active = button.dataset.scope === settings.activeScope
    button.classList.toggle('is-active', active)
    button.setAttribute('aria-pressed', String(active))
  })

  document.querySelectorAll<HTMLElement>('.scope-toolbar').forEach((toolbar) => {
    toolbar.hidden = !toolbar.id.startsWith(settings.activeScope)
  })

  paradeMode.value = settings.paradeMode
  waveformColorized.checked = settings.waveformColorized
  skinToneLine.checked = settings.showSkinToneLine

  document.querySelectorAll<HTMLInputElement>('[data-channel]').forEach((input) => {
    const channel = input.dataset.channel as Channel
    input.checked = settings.waveformChannels[channel]
  })
}

function render(): void {
  const copy = statusCopy(currentState)
  const scopeCopy: Record<ScopeKind, { code: string; name: string; standard: string }> = {
    parade: {
      code: '01',
      name: `${t('parade')} ${settings.paradeMode.toUpperCase()}`,
      standard: `SDR · ${settings.paradeMode.toUpperCase()}`,
    },
    waveform: {
      code: '02',
      name: t('waveformMonitor'),
      standard: settings.waveformColorized ? t('rgbOverlayStandard') : t('monoStandard'),
    },
    vectorscope: {
      code: '03',
      name: t('vectorscope'),
      standard: 'SDR · REC.709',
    },
  }
  const chipCopy: Record<SessionState['status'], string> = {
    idle: t('chipWaiting'),
    starting: t('chipConnecting'),
    active: t('chipLive'),
    paused: t('chipPaused'),
    suspended: t('chipSuspended'),
    error: t('chipError'),
  }
  const activeScope = scopeCopy[settings.activeScope]

  sessionBanner.dataset.status = currentState.status
  sessionChip.dataset.status = currentState.status
  sessionChipLabel.textContent = chipCopy[currentState.status]
  sessionTitle.textContent = copy.title
  sessionDetail.textContent = copy.detail
  scopeCode.textContent = activeScope.code
  scopeName.textContent = activeScope.name
  signalStandard.textContent = activeScope.standard
  controlScopeLabel.textContent = activeScope.name
  captionWarning.hidden = currentState.captionsVisible !== true
  hdrWarning.hidden = currentState.hdrDetected !== true

  if (currentFrame) {
    qualityLabel.textContent = currentFrame.detailed
      ? t('qualityDetailed', {
          width: currentFrame.sourceWidth,
          height: currentFrame.sourceHeight,
        })
      : t('qualityLive', {
          width: currentFrame.sourceWidth,
          height: currentFrame.sourceHeight,
        })
    performanceLabel.textContent = `${currentFrame.computeMs.toFixed(1)} ms`
    sampleCountLabel.textContent = t('pixelCount', {
      count: numberFormatter.format(currentFrame.sampleCount),
    })
  } else {
    qualityLabel.textContent = t('noMeasurement')
    performanceLabel.textContent = '—'
    sampleCountLabel.textContent = '—'
  }

  syncControls()
  renderScope(canvas, currentFrame, settings)
}

document.querySelectorAll<HTMLButtonElement>('[data-scope]').forEach((button) => {
  button.addEventListener('click', () => {
    settings.activeScope = button.dataset.scope as ScopeKind
    void saveSettings()
    render()
  })
})

paradeMode.addEventListener('change', () => {
  settings.paradeMode = paradeMode.value === 'rgb' ? 'rgb' : 'yrgb'
  void saveSettings()
  render()
})

document.querySelectorAll<HTMLInputElement>('[data-channel]').forEach((input) => {
  input.addEventListener('change', () => {
    const channel = input.dataset.channel as Channel
    const next = { ...settings.waveformChannels, [channel]: input.checked }

    if (!Object.values(next).some(Boolean)) {
      input.checked = true
      return
    }

    settings.waveformChannels = next
    void saveSettings()
    render()
  })
})

waveformColorized.addEventListener('change', () => {
  settings.waveformColorized = waveformColorized.checked
  void saveSettings()
  render()
})

skinToneLine.addEventListener('change', () => {
  settings.showSkinToneLine = skinToneLine.checked
  void saveSettings()
  render()
})

const port = chrome.runtime.connect({ name: PANEL_PORT })

acceptConsentButton.addEventListener('click', async () => {
  consentFeedback.hidden = true
  acceptConsentButton.disabled = true
  cancelConsentButton.disabled = true

  try {
    await chrome.storage.local.set({
      [PRIVACY_CONSENT_KEY]: PRIVACY_CONSENT_VERSION,
    })
    consentGate.hidden = true
    const message: PanelPortMessage = { type: 'panel:accept-and-start' }
    port.postMessage(message)
  } catch {
    consentFeedback.textContent = t('consentError')
    consentFeedback.hidden = false
  } finally {
    acceptConsentButton.disabled = false
    cancelConsentButton.disabled = false
  }
})

cancelConsentButton.addEventListener('click', () => {
  const message: PanelPortMessage = { type: 'panel:cancel-consent' }
  port.postMessage(message)
  consentFeedback.textContent = t('consentCancelled')
  consentFeedback.hidden = false
})

stopButton.addEventListener('click', () => {
  const message: PanelPortMessage = { type: 'panel:stop' }
  port.postMessage(message)
})

chrome.runtime.onMessage.addListener((message: RuntimeMessage) => {
  if ('target' in message && message.target === 'sidepanel') {
    if (message.type === 'analysis:frame') {
      if (message.sessionId !== currentState.sessionId) {
        return
      }

      try {
        currentFrame = decodeScopeFrame(message.frame)
      } catch {
        currentState = {
          status: 'error',
          sessionId: currentState.sessionId,
          message: t('unreadableData'),
        }
      }
    } else if (message.type === 'session:state') {
      if (message.state.sessionId !== currentState.sessionId) {
        currentFrame = null
      }

      currentState = message.state
    }

    render()
  }
})

const resizeObserver = new ResizeObserver(render)
resizeObserver.observe(canvas)

const [storedSettings, storedSession, storedConsent] = await Promise.all([
  chrome.storage.local.get('panelSettings'),
  chrome.storage.session.get('lastSessionState'),
  chrome.storage.local.get(PRIVACY_CONSENT_KEY),
])
settings = mergeSettings(
  storedSettings.panelSettings as Partial<PanelSettings> | undefined,
)

if (storedSession.lastSessionState) {
  const storedState = storedSession.lastSessionState as Partial<SessionState>
  currentState = {
    ...(storedState as SessionState),
    sessionId:
      typeof storedState.sessionId === 'string' ? storedState.sessionId : null,
  }
}

consentGate.hidden = hasCurrentPrivacyConsent(
  storedConsent[PRIVACY_CONSENT_KEY],
)

render()

const readyMessage: PanelPortMessage = { type: 'panel:ready' }
port.postMessage(readyMessage)
