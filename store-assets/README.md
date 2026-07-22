# Chrome Web Store assets

Run `pnpm assets:store` from the project root after any visual change.

Generated files are written to `store-assets/generated/`:

- five 1280 × 800 product screenshots;
- one required 440 × 280 small promotional tile;
- one optional 1400 × 560 marquee promotional tile.

The screenshots use the real side-panel code with deterministic local preview data. No remote image, video frame, personal data, or YouTube account is used.

Before upload, open every PNG and confirm that it still matches the release build. Chrome Web Store accepts PNG or JPEG screenshots at 1280 × 800 or 640 × 400.
