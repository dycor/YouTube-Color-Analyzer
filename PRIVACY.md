# Privacy Policy — YouTube Color Analyzer

[Français](./PRIVACY.fr.md) | **English** | [中文](./PRIVACY.zh-CN.md) | [Español](./PRIVACY.es.md) | [Português](./PRIVACY.pt-BR.md)

Effective date: July 17, 2026  
Last updated: July 17, 2026

Publisher: **[PUBLISHER NAME TO COMPLETE]**  
Privacy contact: **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**

## 1. Purpose of the extension

YouTube Color Analyzer is a Chrome extension that locally generates a Parade, Waveform, and Vectorscope from the visible image of a YouTube video. Its sole purpose is to observe and analyze color; it does not modify the video, its source file, or its rendering.

## 2. Summary

- analysis starts only after the user explicitly clicks the extension icon;
- visible video pixels are processed locally on the device;
- audio is not captured;
- no video image is saved to disk or sent to the publisher;
- the extension has no user account, advertising, analytics, or application server;
- the publisher does not sell, share, or receive any data produced by the analysis.

## 3. Data processed

### 3.1 Visible video pixels

During an active analysis session, the extension temporarily captures the visual output of the entire selected YouTube tab. It then crops the visible video area and reads only the pixel values from that area to calculate the three color-analysis scopes.

The captured output may include elements visibly overlaid on the video, such as captions or player controls. The extension warns about some of these cases because they may affect the measurement.

Raw pixel arrays are held in working memory for the time needed to calculate a measurement and their references are then released. The local canvas may retain the latest cropped image in memory until it is replaced by another image or the offscreen document is destroyed. No image is written to persistent storage, added to a history, or transmitted over the Internet.

### 3.2 Page context and player state

A local extension script is present on `youtube.com` pages. It periodically observes page context and player state, including when no capture is active. When there is no analysis session, these messages are ignored and are not stored. To locate the video correctly, handle YouTube's internal navigation, and synchronize measurements, the extension temporarily processes:

- the current YouTube page address and video identifier;
- playback time and playing, paused, or seeking state;
- player mode, tab visibility, and whether controls or captions are visible;
- window, player, and intrinsic video dimensions.

This information is used only to provide the requested analysis, suspend measurement calculations when the source cannot be measured reliably, and avoid analyzing the wrong area. The page address, video identifier, and playback time are not stored persistently and are not transmitted to the publisher.

### 3.3 Local preferences

The extension stores the following display preferences in Chrome local storage: selected scope, Parade mode, Waveform channels, colorization, and skin tone line visibility. It also stores the version of the data disclosure accepted by the user. This technical value contains no identity, page address, or video image.

These preferences remain on the device until they are replaced, the extension data is cleared, or the extension is uninstalled.

### 3.4 Technical session data

During the browser session, the extension may keep a random session identifier, the internal identifier of the captured tab, and the latest analysis state. This information is used only to associate measurements with the correct capture and stop it cleanly. It remains in Chrome session storage and is not sent to the publisher.

## 4. Transmission, sharing, and sale

YouTube Color Analyzer does not transmit user data to the publisher or any third party. Messages between the page script, offscreen document, Web Worker, service worker, and side panel remain internal to the extension on the device.

The extension:

- does not sell any data;
- does not share data for advertising, profiling, or creditworthiness purposes;
- does not use data for any purpose unrelated to color analysis;
- does not execute remotely hosted code;
- contains no telemetry or audience analytics.

YouTube and Google may process data independently when the user uses their services. Those activities are governed by their own policies and are not controlled by this extension.

## 5. Retention and deletion

- **Video pixels**: local working memory; raw arrays are released after calculation, while the latest crop may remain in the canvas until it is replaced or the offscreen document is destroyed.
- **Player context**: temporary memory, continuously replaced. Local observation continues while the YouTube page remains loaded, but messages are ignored and not stored when no analysis is active.
- **Session state**: the active capture identifier is removed when capture stops; the latest status may remain in Chrome session storage until the browser session ends.
- **Display preferences and consent version**: Chrome local storage, retained until changed, cleared, or the extension is uninstalled.

The user can stop capture and pixel analysis by selecting “Stop,” closing the panel, leaving the video, or closing the tab. Closing the panel uses a short technical grace period to tolerate a panel reload. On a YouTube page that remains loaded, local player-context observation may continue, but its messages are ignored while no analysis is active. Stored preferences can be removed by clearing the extension's data in Chrome or uninstalling the extension.

The publisher has no remote copy of this information and therefore cannot access or delete it remotely.

## 6. Chrome permissions

The extension uses only the permissions required for its purpose:

- **activeTab**: after a user action, verify that the active tab is a compatible YouTube video;
- **tabCapture**: temporarily capture the visible output of the selected tab, without audio;
- **offscreen**: receive and analyze the captured stream locally in a Chrome offscreen document;
- **sidePanel**: display the scopes and their controls in Chrome's side panel;
- **storage**: retain local preferences, the consent version, and technical session state;
- **access to `https://www.youtube.com/*`**: detect the YouTube player, its geometry, and its state. Capture itself starts only on a compatible `/watch` page after a user action.

## 7. Security

Processing is isolated within the extension's local components. Its content security policy allows only scripts bundled with the extension package. No captured data is transmitted over a network.

## 8. Limited Use compliance

The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.

## 9. Changes to this policy

This policy will be updated if the extension's data practices change. Any change to these practices will be proactively and prominently disclosed in the Chrome Web Store listing and in the extension interface before it takes effect. New consent will be requested before any processing based on the changed practices.

## 10. Contact

For questions about this policy or the extension, contact: **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**.

## 11. Independence

YouTube Color Analyzer is an independent project. It is not affiliated with, endorsed by, or sponsored by Google, YouTube, or Blackmagic Design. YouTube and DaVinci Resolve are trademarks of their respective owners.
