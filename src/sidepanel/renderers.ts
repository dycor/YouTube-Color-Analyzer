import { rgbToVectorscope, vectorPointToBin } from '../core/color'
import { translate as t } from '../shared/i18n'
import type {
  Channel,
  DisplayScopeFrame,
  PanelSettings,
} from '../shared/protocol'

const CHANNEL_INDEX: Record<Channel, number> = {
  y: 0,
  r: 1,
  g: 2,
  b: 3,
}

const CHANNEL_COLOR: Record<Channel, readonly [number, number, number]> = {
  y: [238, 241, 247],
  r: [255, 86, 105],
  g: [83, 225, 150],
  b: [82, 153, 255],
}

interface PlotArea {
  left: number
  top: number
  width: number
  height: number
}

function densityIndex(
  channel: Channel,
  x: number,
  level: number,
  frame: DisplayScopeFrame,
): number {
  return (
    (CHANNEL_INDEX[channel] * frame.xBins + x) * frame.levelBins + level
  )
}

function prepareCanvas(canvas: HTMLCanvasElement): {
  context: CanvasRenderingContext2D
  width: number
  height: number
} | null {
  const width = Math.max(1, canvas.clientWidth)
  const height = Math.max(1, canvas.clientHeight)
  const pixelRatio = window.devicePixelRatio || 1
  const pixelWidth = Math.round(width * pixelRatio)
  const pixelHeight = Math.round(height * pixelRatio)

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth
    canvas.height = pixelHeight
  }

  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  context.clearRect(0, 0, width, height)

  return { context, width, height }
}

function plotArea(width: number, height: number): PlotArea {
  return {
    left: 36,
    top: 16,
    width: Math.max(1, width - 48),
    height: Math.max(1, height - 42),
  }
}

function drawBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const background = context.createLinearGradient(0, 0, width, height)
  background.addColorStop(0, '#071013')
  background.addColorStop(0.55, '#050a0c')
  background.addColorStop(1, '#071113')
  context.fillStyle = background
  context.fillRect(0, 0, width, height)

  const glow = context.createRadialGradient(
    width * 0.68,
    height * 0.34,
    0,
    width * 0.68,
    height * 0.34,
    Math.max(width, height) * 0.72,
  )
  glow.addColorStop(0, 'rgb(39 76 73 / 0.12)')
  glow.addColorStop(1, 'rgb(5 10 12 / 0)')
  context.fillStyle = glow
  context.fillRect(0, 0, width, height)

  context.strokeStyle = 'rgb(120 169 161 / 0.035)'
  context.lineWidth = 1

  for (let x = 0.5; x < width; x += 48) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.stroke()
  }

  for (let y = 0.5; y < height; y += 48) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }
}

function drawLevelGrid(context: CanvasRenderingContext2D, plot: PlotArea): void {
  context.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace'
  context.textAlign = 'right'
  context.textBaseline = 'middle'

  for (const level of [0, 25, 50, 75, 100]) {
    const y = plot.top + plot.height * (1 - level / 100)
    context.strokeStyle =
      level === 0 || level === 100
        ? 'rgb(137 175 169 / 0.26)'
        : 'rgb(112 145 140 / 0.14)'
    context.lineWidth = 1
    context.beginPath()
    context.moveTo(plot.left, y + 0.5)
    context.lineTo(plot.left + plot.width, y + 0.5)
    context.stroke()
    context.fillStyle = '#617772'
    context.fillText(String(level), plot.left - 7, y)
  }

  for (const position of [0, 0.25, 0.5, 0.75, 1]) {
    const x = plot.left + plot.width * position
    context.strokeStyle =
      position === 0 || position === 1
        ? 'rgb(137 175 169 / 0.18)'
        : 'rgb(112 145 140 / 0.08)'
    context.beginPath()
    context.moveTo(x + 0.5, plot.top)
    context.lineTo(x + 0.5, plot.top + plot.height)
    context.stroke()
  }
}

function createTraceCanvas(width: number, height: number): HTMLCanvasElement {
  const trace = document.createElement('canvas')
  trace.width = width
  trace.height = height
  return trace
}

export function composeColorizedWaveformPixel(
  yIntensity: number,
  rIntensity: number,
  gIntensity: number,
  bIntensity: number,
): readonly [number, number, number, number] {
  const premultipliedRed = Math.min(255, yIntensity + rIntensity)
  const premultipliedGreen = Math.min(255, yIntensity + gIntensity)
  const premultipliedBlue = Math.min(255, yIntensity + bIntensity)
  const alpha = Math.max(
    premultipliedRed,
    premultipliedGreen,
    premultipliedBlue,
  )

  if (alpha === 0) {
    return [0, 0, 0, 0]
  }

  return [
    Math.round((premultipliedRed / alpha) * 255),
    Math.round((premultipliedGreen / alpha) * 255),
    Math.round((premultipliedBlue / alpha) * 255),
    alpha,
  ]
}

function renderWaveformTrace(
  frame: DisplayScopeFrame,
  settings: PanelSettings,
): HTMLCanvasElement {
  const trace = createTraceCanvas(frame.xBins, frame.levelBins)
  const traceContext = trace.getContext('2d')

  if (!traceContext) {
    return trace
  }

  const pixels = traceContext.createImageData(frame.xBins, frame.levelBins)
  const enabled = (Object.keys(settings.waveformChannels) as Channel[]).filter(
    (channel) => settings.waveformChannels[channel],
  )
  for (let x = 0; x < frame.xBins; x += 1) {
    for (let level = 0; level < frame.levelBins; level += 1) {
      const targetY = frame.levelBins - 1 - level
      const pixelIndex = (targetY * frame.xBins + x) * 4

      if (!settings.waveformColorized) {
        let value = 0

        for (const channel of enabled) {
          value = Math.max(
            value,
            frame.channelIntensity[densityIndex(channel, x, level, frame)] ?? 0,
          )
        }

        pixels.data[pixelIndex] = 238
        pixels.data[pixelIndex + 1] = 241
        pixels.data[pixelIndex + 2] = 247
        pixels.data[pixelIndex + 3] = value
        continue
      }

      const yIntensity = settings.waveformChannels.y
        ? (frame.channelIntensity[densityIndex('y', x, level, frame)] ?? 0)
        : 0
      const rIntensity = settings.waveformChannels.r
        ? (frame.channelIntensity[densityIndex('r', x, level, frame)] ?? 0)
        : 0
      const gIntensity = settings.waveformChannels.g
        ? (frame.channelIntensity[densityIndex('g', x, level, frame)] ?? 0)
        : 0
      const bIntensity = settings.waveformChannels.b
        ? (frame.channelIntensity[densityIndex('b', x, level, frame)] ?? 0)
        : 0
      const [red, green, blue, alpha] = composeColorizedWaveformPixel(
        yIntensity,
        rIntensity,
        gIntensity,
        bIntensity,
      )

      pixels.data[pixelIndex] = red
      pixels.data[pixelIndex + 1] = green
      pixels.data[pixelIndex + 2] = blue
      pixels.data[pixelIndex + 3] = alpha
    }
  }

  traceContext.putImageData(pixels, 0, 0)
  return trace
}

function renderParadeTrace(
  frame: DisplayScopeFrame,
  channels: Channel[],
): HTMLCanvasElement {
  const width = frame.xBins * channels.length
  const trace = createTraceCanvas(width, frame.levelBins)
  const traceContext = trace.getContext('2d')

  if (!traceContext) {
    return trace
  }

  const pixels = traceContext.createImageData(width, frame.levelBins)
  channels.forEach((channel, channelPosition) => {
    const color = CHANNEL_COLOR[channel]

    for (let x = 0; x < frame.xBins; x += 1) {
      for (let level = 0; level < frame.levelBins; level += 1) {
        const targetX = channelPosition * frame.xBins + x
        const targetY = frame.levelBins - 1 - level
        const pixelIndex = (targetY * width + targetX) * 4
        const value =
          frame.channelIntensity[densityIndex(channel, x, level, frame)] ?? 0

        pixels.data[pixelIndex] = color[0]
        pixels.data[pixelIndex + 1] = color[1]
        pixels.data[pixelIndex + 2] = color[2]
        pixels.data[pixelIndex + 3] = value
      }
    }
  })

  traceContext.putImageData(pixels, 0, 0)
  return trace
}

function hsvToRgb(hue: number): readonly [number, number, number] {
  const normalized = ((hue % 360) + 360) % 360
  const section = normalized / 60
  const x = 1 - Math.abs((section % 2) - 1)
  let rgb: readonly [number, number, number]

  if (section < 1) rgb = [1, x, 0]
  else if (section < 2) rgb = [x, 1, 0]
  else if (section < 3) rgb = [0, 1, x]
  else if (section < 4) rgb = [0, x, 1]
  else if (section < 5) rgb = [x, 0, 1]
  else rgb = [1, 0, x]

  return rgb.map((value) => Math.round(value * 255)) as unknown as readonly [
    number,
    number,
    number,
  ]
}

function renderVectorTrace(frame: DisplayScopeFrame): HTMLCanvasElement {
  const trace = createTraceCanvas(frame.vectorSize, frame.vectorSize)
  const traceContext = trace.getContext('2d')

  if (!traceContext) {
    return trace
  }

  const pixels = traceContext.createImageData(frame.vectorSize, frame.vectorSize)
  const center = (frame.vectorSize - 1) / 2

  for (let y = 0; y < frame.vectorSize; y += 1) {
    for (let x = 0; x < frame.vectorSize; x += 1) {
      const intensity = frame.vectorIntensity[y * frame.vectorSize + x] ?? 0

      if (intensity === 0) {
        continue
      }

      const angle = (Math.atan2(y - center, x - center) * 180) / Math.PI - 13
      const color = hsvToRgb(angle)
      const pixelIndex = (y * frame.vectorSize + x) * 4

      pixels.data[pixelIndex] = color[0]
      pixels.data[pixelIndex + 1] = color[1]
      pixels.data[pixelIndex + 2] = color[2]
      pixels.data[pixelIndex + 3] = intensity
    }
  }

  traceContext.putImageData(pixels, 0, 0)
  return trace
}

function drawWaveform(
  context: CanvasRenderingContext2D,
  plot: PlotArea,
  frame: DisplayScopeFrame,
  settings: PanelSettings,
): void {
  const trace = renderWaveformTrace(frame, settings)
  context.imageSmoothingEnabled = true
  context.drawImage(trace, plot.left, plot.top, plot.width, plot.height)
}

function drawParade(
  context: CanvasRenderingContext2D,
  plot: PlotArea,
  frame: DisplayScopeFrame,
  settings: PanelSettings,
): void {
  const channels: Channel[] = settings.paradeMode === 'yrgb' ? ['y', 'r', 'g', 'b'] : ['r', 'g', 'b']
  const trace = renderParadeTrace(frame, channels)
  context.imageSmoothingEnabled = true
  context.drawImage(trace, plot.left, plot.top, plot.width, plot.height)
  context.font = '600 10px ui-monospace, SFMono-Regular, Menlo, monospace'
  context.textAlign = 'center'
  context.textBaseline = 'top'

  channels.forEach((channel, index) => {
    const segmentWidth = plot.width / channels.length
    const centerX = plot.left + segmentWidth * (index + 0.5)
    const color = CHANNEL_COLOR[channel]
    context.fillStyle = `rgb(${color.join(' ')})`
    context.fillText(channel.toUpperCase(), centerX, plot.top + plot.height + 7)

    if (index > 0) {
      const x = plot.left + segmentWidth * index
      context.strokeStyle = 'rgb(132 174 166 / 0.2)'
      context.beginPath()
      context.moveTo(x + 0.5, plot.top)
      context.lineTo(x + 0.5, plot.top + plot.height)
      context.stroke()
    }
  })
}

function targetPosition(
  r: number,
  g: number,
  b: number,
  frame: DisplayScopeFrame,
  plot: PlotArea,
): { x: number; y: number } {
  const bin = vectorPointToBin(rgbToVectorscope(r, g, b), frame.vectorSize)

  return {
    x: plot.left + (bin.x / (frame.vectorSize - 1)) * plot.width,
    y: plot.top + (bin.y / (frame.vectorSize - 1)) * plot.height,
  }
}

function drawVectorscope(
  context: CanvasRenderingContext2D,
  plot: PlotArea,
  frame: DisplayScopeFrame,
  settings: PanelSettings,
): void {
  const size = Math.min(plot.width, plot.height)
  const vectorPlot: PlotArea = {
    left: plot.left + (plot.width - size) / 2,
    top: plot.top + (plot.height - size) / 2,
    width: size,
    height: size,
  }
  const centerX = vectorPlot.left + size / 2
  const centerY = vectorPlot.top + size / 2
  const radius = size / 2
  const trace = renderVectorTrace(frame)

  context.save()
  context.beginPath()
  context.arc(centerX, centerY, radius, 0, Math.PI * 2)
  context.clip()
  context.drawImage(trace, vectorPlot.left, vectorPlot.top, size, size)
  context.restore()

  context.strokeStyle = 'rgb(132 174 166 / 0.28)'
  context.lineWidth = 1
  context.beginPath()
  context.arc(centerX, centerY, radius - 0.5, 0, Math.PI * 2)
  context.moveTo(centerX - radius, centerY + 0.5)
  context.lineTo(centerX + radius, centerY + 0.5)
  context.moveTo(centerX + 0.5, centerY - radius)
  context.lineTo(centerX + 0.5, centerY + radius)
  context.stroke()

  context.strokeStyle = 'rgb(112 151 144 / 0.13)'

  for (const scale of [0.25, 0.5, 0.75]) {
    context.beginPath()
    context.arc(centerX, centerY, radius * scale, 0, Math.PI * 2)
    context.stroke()
  }

  const targets = [
    { label: 'R', rgb: [1, 0, 0] as const, color: '#ff5669' },
    { label: 'Mg', rgb: [1, 0, 1] as const, color: '#ff6bda' },
    { label: 'B', rgb: [0, 0, 1] as const, color: '#5299ff' },
    { label: 'Cy', rgb: [0, 1, 1] as const, color: '#52e5e5' },
    { label: 'G', rgb: [0, 1, 0] as const, color: '#53e196' },
    { label: 'Y', rgb: [1, 1, 0] as const, color: '#ffe36b' },
  ]

  context.font = '600 10px ui-monospace, SFMono-Regular, Menlo, monospace'
  context.textAlign = 'center'
  context.textBaseline = 'middle'

  for (const target of targets) {
    const position = targetPosition(
      target.rgb[0],
      target.rgb[1],
      target.rgb[2],
      frame,
      vectorPlot,
    )
    context.strokeStyle = target.color
    context.strokeRect(position.x - 3, position.y - 3, 6, 6)
    context.fillStyle = target.color
    context.fillText(target.label, position.x, position.y - 10)
  }

  if (settings.showSkinToneLine) {
    const skin = targetPosition(0.76, 0.49, 0.36, frame, vectorPlot)
    const dx = skin.x - centerX
    const dy = skin.y - centerY
    const length = Math.hypot(dx, dy) || 1
    context.strokeStyle = '#f2c39f'
    context.setLineDash([4, 4])
    context.beginPath()
    context.moveTo(centerX, centerY)
    context.lineTo(centerX + (dx / length) * radius, centerY + (dy / length) * radius)
    context.stroke()
    context.setLineDash([])
  }
}

export function renderScope(
  canvas: HTMLCanvasElement,
  frame: DisplayScopeFrame | null,
  settings: PanelSettings,
): void {
  const prepared = prepareCanvas(canvas)

  if (!prepared) {
    return
  }

  const { context, width, height } = prepared
  drawBackground(context, width, height)

  if (!frame) {
    const centerX = width / 2
    const centerY = height / 2
    context.strokeStyle = 'rgb(151 202 192 / 0.2)'
    context.lineWidth = 1
    context.beginPath()
    context.arc(centerX, centerY - 15, 27, 0, Math.PI * 2)
    context.moveTo(centerX - 38, centerY - 15)
    context.lineTo(centerX + 38, centerY - 15)
    context.moveTo(centerX, centerY - 53)
    context.lineTo(centerX, centerY + 23)
    context.stroke()

    context.strokeStyle = 'rgb(176 226 216 / 0.5)'
    context.beginPath()
    context.arc(centerX, centerY - 15, 27, -0.48, 0.48)
    context.stroke()

    context.fillStyle = '#718681'
    context.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(t('canvasWaiting'), centerX, centerY + 37)
    return
  }

  const plot = plotArea(width, height)

  if (settings.activeScope === 'vectorscope') {
    drawVectorscope(context, plot, frame, settings)
    return
  }

  drawLevelGrid(context, plot)

  if (settings.activeScope === 'waveform') {
    drawWaveform(context, plot, frame, settings)
  } else {
    drawParade(context, plot, frame, settings)
  }
}
