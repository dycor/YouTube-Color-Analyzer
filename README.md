# YouTube Color Analyzer

[Français](./README.fr.md) | **English** | [中文](./README.zh-CN.md) | [Español](./README.es.md) | [Português](./README.pt-BR.md)

Google Chrome extension that locally analyzes the visible pixels of a YouTube video using three instruments inspired by DaVinci Resolve:

- `YRGB` or `RGB` Parade;
- Waveform with `Y`, `R`, `G`, and `B` channels and colorized or monochrome mode;
- Rec.709 Vectorscope with hue targets and a skin tone line.

The extension observes the image without modifying the video, its source file, or its rendering. It has no backend, does not save any images, and does not send any data over the Internet.

The interface automatically follows the browser language. It supports French, English, Chinese, Spanish, and Portuguese; any other language falls back to English.

## Project status

The functional foundation includes:

- a Chrome MV3 manifest for Chrome 116 or later;
- a side panel with all three instruments and their settings;
- a local `tabCapture` → offscreen document → Web Worker → panel pipeline;
- a TypeScript colorimetry core independent of the Chrome APIs;
- unit, performance, and Chromium loading tests.

The project targets standard `youtube.com/watch` pages in normal and theater modes. Shorts, embedded players, fullscreen, the miniplayer, Picture-in-Picture, and calibrated HDR analysis are outside the scope of V1.

## Development

Requirements: Node.js 22.12 or later and pnpm 10 or later.

```bash
pnpm install
pnpm verify
```

Available commands:

```bash
pnpm dev        # rebuilds the extension when changes are made
pnpm ui:preview # opens the interface preview server
pnpm typecheck  # checks TypeScript types
pnpm test       # runs the unit tests
pnpm build      # produces the dist/ directory
pnpm test:e2e   # builds and then loads the extension in Chromium
```

To preview only the interface with synthetic data, run `pnpm ui:preview`, then open `/preview.html` at the local address displayed by Vite. The `?lang=` parameter can be used to check a language, for example `/preview.html?lang=zh-CN`.

## Load the extension in Chrome

1. Run `pnpm build`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Click "Load unpacked."
5. Select the `dist/` directory.
6. Open a `https://www.youtube.com/watch?...` page.
7. Click the extension icon to open the panel and start the analysis.

## Architecture

```text
src/
├── analyzer-worker/  computes density maps for the three instruments
├── content-script/   YouTube player state and geometry
├── core/             testable colorimetry mathematics
├── offscreen/        capture, cropping, and sampling
├── service-worker/   MV3 lifecycle and user permission
├── shared/           message contracts and constants
└── sidepanel/        interface and Canvas 2D rendering
```

RGBA images remain in the offscreen document and the computation worker. The panel receives only the compact intensity maps required to draw the scopes.

## Design documentation

- [`CONTEXT.md`](./CONTEXT.md) defines the vocabulary and scope of the domain.
- [`docs/adr/`](./docs/adr/) contains the product and technical decisions validated during planning.

## Publishing, privacy, and support

- [`PRIVACY.md`](./PRIVACY.md) contains the Privacy Policy and links to its translations.
- [`SUPPORT.md`](./SUPPORT.md) contains support and troubleshooting information.
- [`docs/chrome-web-store/`](./docs/chrome-web-store/) contains the Chrome Web Store publication pack: localized listings, data disclosures, test instructions, and checklist.

## License

The source code is distributed under the [Mozilla Public License 2.0](./LICENSE). Modifications to covered files that are redistributed must remain available under MPL 2.0. This license grants no rights in trademarks, trade names, or logos.
