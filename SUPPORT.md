# Support — YouTube Color Analyzer

[Français](./SUPPORT.fr.md) | **English** | [中文](./SUPPORT.zh-CN.md) | [Español](./SUPPORT.es.md) | [Português](./SUPPORT.pt-BR.md)

## Get help

- Support email: **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**
- Issue tracker: **[PUBLIC ISSUE TRACKER URL TO COMPLETE]**
- Privacy Policy: [PRIVACY.md](./PRIVACY.md)
- Target response time: **[TIME TO COMPLETE, FOR EXAMPLE 5 BUSINESS DAYS]**

Do not send screenshots containing personal information, a private account, or confidential content. The extension never needs your YouTube or Google password.

## Quick checks

### The panel remains in a waiting state

1. Use Google Chrome 116 or later.
2. Open a standard `https://www.youtube.com/watch?...` page.
3. Reload the page after installing or updating the extension.
4. Click the extension icon and accept the disclosure on first use.

### Analysis is suspended

- use normal or theater mode;
- leave fullscreen, the YouTube miniplayer, and Picture-in-Picture;
- make the YouTube tab active;
- make sure the complete video image is visible;
- move the pointer away so the YouTube controls become hidden.

### The scopes do not update

- make sure the video already has a decoded frame;
- select “Stop,” then click the extension icon again;
- reload the YouTube page if the extension was just updated;
- try another public video to rule out a source-specific restriction.

### Measurements differ from DaVinci Resolve

Version 1 analyzes the visible SDR output rendered by Chrome. It does not access the original video file, the signal before display rendering, or complete color metadata. The scopes are intended for observation and are not calibrated broadcast measurements.

Captions, controls, and other visible overlays may also affect the result.

## Supported scope

- standard `youtube.com/watch` pages;
- normal and theater modes;
- YRGB/RGB Parade, YRGB Waveform, and Rec.709 Vectorscope;
- live analysis and a more detailed paused frame.

Version 1 does not support Shorts, YouTube Music, embedded players, fullscreen, the YouTube miniplayer, Picture-in-Picture, or calibrated HDR analysis.

## Report an issue

Include the following without attaching sensitive data:

1. Chrome version;
2. operating system;
3. extension version;
4. page type and player mode;
5. steps to reproduce the issue;
6. observed and expected results;
7. any errors shown on `chrome://extensions`.

## Privacy and security

For a data question or to report a vulnerability, email **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**. Do not publicly disclose details of an unpatched vulnerability.

## Independence

YouTube Color Analyzer is an independent project. It is not affiliated with, endorsed by, or sponsored by Google, YouTube, or Blackmagic Design.
