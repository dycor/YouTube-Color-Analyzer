# Public GitHub Pages website

This folder contains the dependency-free public website for Color Analyzer for YouTube.

## Public routes

- English (default): `/`, `/privacy/`, `/support/`
- French: `/fr/`, `/fr/privacy/`, `/fr/support/`
- Spanish: `/es/`, `/es/privacy/`, `/es/support/`
- Portuguese (Brazil): `/pt-BR/`, `/pt-BR/privacy/`, `/pt-BR/support/`
- Simplified Chinese: `/zh-CN/`, `/zh-CN/privacy/`, `/zh-CN/support/`

The privacy and support pages are generated from the corresponding Markdown files at the repository root. This keeps the public pages and the documents submitted to the Chrome Web Store aligned.

Run `node website/build.mjs` to generate `website/dist`. The GitHub Pages workflow uploads only this generated directory; source code, internal publication notes, tests, and extension build files are not published.

After the workflow is pushed, choose **GitHub Actions** as the Pages source under **Settings → Pages** if GitHub does not select it automatically.
