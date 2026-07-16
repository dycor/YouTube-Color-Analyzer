# Chrome Web Store listing — English

> Copy-ready content for the Developer Dashboard. Replace every bracketed field before submission.

## General information

- **Name**: YouTube Color Analyzer
- **Short summary**: Analyze YouTube video colors locally with YRGB/RGB Parade, Waveform, and Rec.709 Vectorscope.
- **Language**: English
- **Recommended category**: Productivity
- **Homepage URL**: `[PUBLIC PROJECT URL TO COMPLETE]`
- **Support URL**: `[PUBLIC SUPPORT URL TO COMPLETE]`
- **Privacy policy URL**: `[PUBLIC URL FOR PRIVACY.md TO COMPLETE]`

## Prominent user-data disclosure

Place this copy near the beginning of the description rather than hiding it in a secondary section:

> **Data processing:** on YouTube pages, the extension locally reads the page address, video identifier, and player state to detect and frame a compatible video. After you accept the in-extension disclosure and start analysis, it temporarily captures the visual output of the active tab, without audio, and crops the video area to calculate the scopes. Pixels, the page address, and playback state remain in your browser. No image or playback data is sent to a server, the publisher, or any third party. Display preferences and the consent version are kept in Chrome local storage. A capture identifier and the latest technical state are kept temporarily in session storage and disappear no later than the end of the browser session.

## Detailed description

YouTube Color Analyzer displays color-analysis scopes in Chrome's side panel using the visible pixels of the currently playing video.

It is designed for editors, colorists, and creators who want to study a reference video before recreating a similar look in their own project.

DATA PROCESSING

On YouTube pages, the extension locally reads the page address, video identifier, and player state to detect and frame a compatible video. After you accept the in-extension disclosure and start analysis, it temporarily captures the visual output of the active tab, without audio, and crops the video area to calculate the scopes.

Pixels, the page address, and playback state remain in your browser. No image or playback data is sent to a server, the publisher, or any third party. Display preferences and the consent version are kept in Chrome local storage. A capture identifier and the latest technical state are kept temporarily in session storage and disappear no later than the end of the browser session.

INCLUDED SCOPES

• YRGB or RGB Parade with a normalized 0–100 scale.  
• Waveform with individually selectable Y, R, G, and B channels in colorized or monochrome display.  
• Rec.709-derived Vectorscope with hue targets and an optional skin tone reference line.

HOW IT WORKS

Open a standard YouTube watch page, click the extension icon, and accept the disclosure shown on first use. The side panel opens and analysis starts for the visible video in the selected tab.

During playback, the scopes update live. When the video is paused, a more detailed frame is analyzed. All three scopes are calculated from the same frame. The side panel does not cover the video, and selected settings are saved locally.

PRIVACY

All calculations take place on the device. Video pixels remain only in local working memory; the latest crop may remain there until it is replaced or the offscreen document is destroyed. No image is stored persistently, exported, or sent to a server. The extension has no backend, advertising, or audience analytics and does not capture audio.

COMPATIBILITY

• Google Chrome 116 or later.  
• Standard `youtube.com/watch` pages.  
• Normal and theater player modes.  
• Interface available in English, French, Chinese, Spanish, and Portuguese.

VERSION 1 LIMITATIONS

The extension analyzes the SDR output rendered by Chrome, not the original video file or source signal. The normalized 0–100 values are therefore not calibrated broadcast measurements.

Calibrated HDR analysis, Shorts, YouTube Music, embedded players, fullscreen, the YouTube miniplayer, and Picture-in-Picture are not supported.

Captions and other elements overlaid on the visible video may affect measurements. Analysis is suspended while the YouTube player controls are visible.

The extension provides measurement scopes only. It does not modify the video, apply color corrections, or provide automatic grading recommendations.

INDEPENDENCE

This is an independent extension. It is not affiliated with, sponsored by, endorsed by, or officially connected to YouTube, Google LLC, Blackmagic Design Pty. Ltd., or any of their affiliates. YouTube, DaVinci Resolve, and all other referenced trademarks belong to their respective owners.

## Suggested screenshot captions

1. **Three color-analysis scopes directly in Chrome**  
   YRGB/RGB Parade, Waveform, and Vectorscope in a dedicated side panel.
2. **Live analysis during playback**  
   Follow luminance, RGB channels, and saturation as the video plays.
3. **A more detailed frame when you pause**  
   Freeze a reference and inspect its color distribution more precisely.
4. **Familiar controls for colorists**  
   YRGB channels, colorized or monochrome display, and an optional skin tone line.
5. **Local and non-destructive processing**  
   No image is uploaded or stored persistently, and the video is never modified.

## 440 × 280 promotional tile copy

Prefer a text-free tile so it works for every locale. If text is necessary:

> COLOR ANALYZER  
> PARADE · WAVEFORM · VECTORSCOPE
