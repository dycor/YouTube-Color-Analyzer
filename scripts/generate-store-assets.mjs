import { readFile, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

import { chromium } from '@playwright/test'
import { createServer } from 'vite'

const projectRoot = resolve(import.meta.dirname, '..')
const outputDirectory = resolve(projectRoot, 'store-assets/generated')
const previewPort = 4173

const screenshotScenarios = [
  {
    fileName: '01-waveform-monitor-1280x800.png',
    query: 'scope=waveform&consent=accepted&lang=en-US',
  },
  {
    fileName: '02-yrgb-parade-1280x800.png',
    query: 'scope=parade&consent=accepted&lang=en-US',
  },
  {
    fileName: '03-vectorscope-rec709-1280x800.png',
    query: 'scope=vectorscope&consent=accepted&lang=en-US',
  },
  {
    fileName: '04-detailed-paused-frame-1280x800.png',
    query: 'scope=waveform&consent=accepted&lang=en-US&detailed=true&status=paused',
  },
  {
    fileName: '05-privacy-consent-1280x800.png',
    query: 'scope=waveform&consent=pending&lang=en-US',
  },
]

const screenshotFitCss = `
  html, body, #app { width: 100%; height: 100%; overflow: hidden; }
  .app-shell {
    width: 100%; height: 100%; min-height: 0; padding: 10px; gap: 8px;
    grid-template-rows: auto auto minmax(0, 1fr) auto auto auto;
  }
  .scope-stage {
    min-height: 0; display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
  }
  .scope-viewport { min-height: 0; }
  #scope-canvas { height: 100% !important; min-height: 280px !important; }
  .scope-toolbar { min-height: 58px; }
`

function asDataUrl(bytes) {
  return `data:image/png;base64,${bytes.toString('base64')}`
}

function promoMarkup({ width, height, logoDataUrl, compact }) {
  const titleSize = compact ? 35 : 62
  const logoSize = compact ? 112 : 238
  const eyebrowSize = compact ? 10 : 17
  const subtitleSize = compact ? 14 : 25
  const contentGap = compact ? 20 : 54

  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          html, body { width: ${width}px; height: ${height}px; margin: 0; overflow: hidden; }
          body {
            position: relative; display: grid; place-items: center;
            color: #e7f0ee; background:
              radial-gradient(circle at 78% 4%, rgb(81 143 134 / 34%), transparent 38%),
              radial-gradient(circle at 7% 94%, rgb(121 78 48 / 18%), transparent 39%),
              linear-gradient(145deg, #0c1b1e 0%, #071012 48%, #030709 100%);
            font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          body::before {
            position: absolute; inset: 0; content: ""; opacity: .42;
            background-image:
              linear-gradient(rgb(159 205 197 / 7%) 1px, transparent 1px),
              linear-gradient(90deg, rgb(159 205 197 / 7%) 1px, transparent 1px);
            background-size: ${compact ? 28 : 48}px ${compact ? 28 : 48}px;
            mask-image: linear-gradient(115deg, black, transparent 82%);
          }
          .orbit {
            position: absolute; width: ${compact ? 310 : 720}px; aspect-ratio: 1;
            right: ${compact ? -180 : -250}px; top: ${compact ? -170 : -390}px;
            border: 1px solid rgb(163 220 209 / 16%); border-radius: 50%;
            box-shadow: inset 0 0 ${compact ? 44 : 90}px rgb(85 157 145 / 6%);
          }
          .content {
            position: relative; z-index: 2; display: flex; align-items: center;
            width: ${compact ? 'calc(100% - 34px)' : 'calc(100% - 150px)'};
            gap: ${contentGap}px;
          }
          .logo {
            flex: 0 0 auto; width: ${logoSize}px; height: ${logoSize}px;
            border-radius: ${compact ? 24 : 48}px;
            box-shadow: 0 24px 70px rgb(0 0 0 / 42%), 0 0 55px rgb(94 208 188 / 12%);
          }
          .copy { min-width: 0; }
          .eyebrow {
            margin-bottom: ${compact ? 8 : 16}px; color: #87aaa4;
            font: 650 ${eyebrowSize}px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
            letter-spacing: .2em; text-transform: uppercase;
          }
          h1 {
            margin: 0; color: #eef7f5; font-size: ${titleSize}px;
            font-weight: 620; letter-spacing: -.045em; line-height: .98;
            white-space: nowrap;
          }
          p {
            margin: ${compact ? 10 : 20}px 0 0; color: #a3b7b3;
            font-size: ${subtitleSize}px; line-height: 1.35;
          }
          .features {
            display: flex; gap: ${compact ? 7 : 13}px; margin-top: ${compact ? 13 : 27}px;
            color: #a8d0c8; font: 600 ${compact ? 8 : 14}px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
            letter-spacing: .08em; text-transform: uppercase;
          }
          .features span {
            padding: ${compact ? '6px 7px' : '10px 14px'};
            border: 1px solid rgb(155 211 201 / 18%); border-radius: 999px;
            background: rgb(31 54 55 / 48%); backdrop-filter: blur(14px);
          }
          .trace {
            position: absolute; z-index: 1; right: 0; bottom: ${compact ? 13 : 28}px;
            width: ${compact ? 300 : 930}px; height: ${compact ? 80 : 180}px; opacity: .68;
          }
        </style>
      </head>
      <body>
        <div class="orbit"></div>
        <svg class="trace" viewBox="0 0 900 180" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="fade" x1="0" x2="1">
              <stop stop-color="#68e3b6" stop-opacity="0" />
              <stop offset=".22" stop-color="#68e3b6" />
              <stop offset=".58" stop-color="#f2f5f4" />
              <stop offset="1" stop-color="#54a4ff" stop-opacity="0" />
            </linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="4" /></filter>
          </defs>
          <path d="M0 150 C95 150 105 42 182 42 S260 126 334 126 390 20 464 20 524 145 598 145 661 72 719 72 779 114 900 25" stroke="url(#fade)" stroke-width="12" opacity=".25" filter="url(#glow)" />
          <path d="M0 150 C95 150 105 42 182 42 S260 126 334 126 390 20 464 20 524 145 598 145 661 72 719 72 779 114 900 25" stroke="url(#fade)" stroke-width="2" />
        </svg>
        <main class="content">
          <img class="logo" src="${logoDataUrl}" alt="" />
          <div class="copy">
            <div class="eyebrow">Professional video scopes</div>
            <h1>Color Analyzer</h1>
            <p>Read the image. Recreate the grade.</p>
            <div class="features"><span>YRGB</span><span>Waveform</span><span>Rec.709</span></div>
          </div>
        </main>
      </body>
    </html>`
}

async function main() {
  await rm(outputDirectory, { recursive: true, force: true })
  await mkdir(outputDirectory, { recursive: true })

  const logo = await readFile(resolve(projectRoot, 'public/icons/logo-master.png'))
  const logoDataUrl = asDataUrl(logo)
  const server = await createServer({
    root: projectRoot,
    logLevel: 'error',
    server: {
      host: '127.0.0.1',
      port: previewPort,
      strictPort: true,
      hmr: false,
    },
  })
  let browser

  try {
    await server.listen()
    browser = await chromium.launch()
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
      colorScheme: 'dark',
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    const pageErrors = []
    page.on('pageerror', (error) => pageErrors.push(error))

    for (const scenario of screenshotScenarios) {
      await page.goto(`http://127.0.0.1:${previewPort}/preview.html?${scenario.query}`)
      await page.addStyleTag({ content: screenshotFitCss })
      await page.waitForSelector('#scope-canvas')

      if (scenario.query.includes('consent=pending')) {
        await page.waitForSelector('#consent-gate:not([hidden])')
      } else {
        await page.waitForFunction(() => {
          const session = document.querySelector('#session-chip')
          const performance = document.querySelector('#performance-label')
          return ['active', 'paused'].includes(
            session?.getAttribute('data-status') ?? '',
          ) &&
            performance?.textContent !== '—'
        })
      }

      await page.waitForTimeout(120)

      if (pageErrors.length > 0) {
        throw pageErrors.shift()
      }

      await page.screenshot({
        path: resolve(outputDirectory, scenario.fileName),
        animations: 'disabled',
      })
    }

    await page.setViewportSize({ width: 440, height: 280 })
    await page.setContent(
      promoMarkup({ width: 440, height: 280, logoDataUrl, compact: true }),
      { waitUntil: 'load' },
    )
    await page.screenshot({
      path: resolve(outputDirectory, 'promo-small-440x280.png'),
      animations: 'disabled',
    })

    await page.setViewportSize({ width: 1400, height: 560 })
    await page.setContent(
      promoMarkup({ width: 1400, height: 560, logoDataUrl, compact: false }),
      { waitUntil: 'load' },
    )
    await page.screenshot({
      path: resolve(outputDirectory, 'promo-marquee-1400x560.png'),
      animations: 'disabled',
    })

    await context.close()
  } finally {
    await browser?.close()
    await server.close()
  }
}

await main()
