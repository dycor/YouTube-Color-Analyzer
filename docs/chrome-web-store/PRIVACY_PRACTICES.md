# Chrome Web Store — Privacy practices

Valeurs proposées pour le Developer Dashboard, basées sur le code audité le 31 juillet 2026 pour la version 1.1.0.

> La divulgation et le consentement décrits dans [`DATA_DISCLOSURE.md`](./DATA_DISCLOSURE.md) sont implémentés. Vérifier à nouveau ces réponses après toute modification du code.

## Finalité unique

### Français

> Fournir des instruments colorimétriques calculés localement à partir du rendu visible de la vidéo YouTube que l’utilisateur choisit explicitement d’analyser.

### English — recommandé pour les examinateurs

> Provide color-analysis scopes calculated locally from the visible rendering of the YouTube video explicitly selected by the user.

## Justification des permissions

### `tabCapture`

> Captures the visual output of the YouTube tab explicitly selected by the user, without audio, so the extension can crop the visible video area and calculate the Parade, Waveform, and Vectorscope locally. Capture is limited to the active analysis session shared by the side panel and detached analysis window. It stops immediately when the user selects Stop from either interface, navigates to an unsupported page, closes the tab, or the capture ends; closing the last analysis interface triggers the same stop after a short technical grace period that tolerates a reload. Captured pixels are not sent to a server. No image is saved automatically; the exact detailed paused frame is downloaded locally only when the user explicitly selects Export frame.

### `offscreen`

> Creates a Chrome offscreen document to consume the user-initiated tab capture stream, crop video frames with an offscreen canvas, and run the local analysis worker while the side panel or detached analysis window displays the results. It also creates the local PNG download only after an explicit export request for the current detailed paused frame. When the shared session stops, the video source is released and the canvas is reset to 1 × 1 pixel.

### `sidePanel`

> Opens Chrome's side panel to display the three color-analysis scopes and their controls without covering the YouTube video. The user may open the same interface in a detached extension window that shares the existing capture session.

### `storage`

> Stores display preferences, including trace intensity, and the accepted disclosure version in Chrome local storage, plus temporary capture/session state in Chrome session storage. It does not automatically store video images or keep an export history. A PNG exists on disk only after the user explicitly requests the local download.

### Accès hôte `https://www.youtube.com/*`

> Allows the local content script on YouTube to activate only after user consent and only for an active analysis session, detect internal single-page navigation, and read only the player state and geometry needed to locate, crop, synchronize, suspend, and stop the requested color analysis. Player-context observation and video capture stop immediately when the user selects Stop from the side panel or detached window, navigates to an unsupported page, closes the tab, or the capture ends. Closing the last analysis interface triggers the same stop after a short technical grace period that tolerates a reload. Video capture starts only on a supported `/watch` page after user consent and an explicit action.

## Code distant

- **Réponse** : No, I am not using remote code.
- **Justification interne** : tous les scripts et workers sont inclus dans le paquet MV3. La CSP autorise uniquement `script-src 'self'`. Aucun `eval`, SDK distant ou script téléchargé n’est utilisé.

## Catégories de données

Les noms exacts peuvent varier légèrement dans le Dashboard. Déclarer au minimum les catégories suivantes si elles sont proposées :

| Catégorie | Réponse | Traitement réel |
| --- | --- | --- |
| Website content | Oui | Rendu visuel temporaire de l’onglet, pixels de la zone vidéo, sous-titres et superpositions visibles. |
| Web history / browsing activity | Oui | Adresse de la page YouTube active, navigation interne et identifiant vidéo ; aucune liste d’historique n’est construite. |
| User activity | Oui par prudence | État et position de lecture, visibilité de l’onglet, mode et état des commandes du lecteur. |
| Personally identifiable information | Non | Aucun nom, e-mail, identifiant Google ou identifiant publicitaire n’est lu. |
| Authentication information | Non | Aucun mot de passe, cookie ou jeton d’authentification n’est lu. |
| Location | Non | Aucune géolocalisation n’est demandée. |
| Financial and payment information | Non | Aucune donnée financière ou de paiement n’est traitée. |
| Health information | Non | Aucune donnée de santé n’est traitée. |
| Personal communications | Non | Aucun message ou e-mail n’est lu. |

## Description du traitement des données

### Texte anglais à copier

> Only after the user accepts the current in-product disclosure and explicitly starts analysis does the extension locally read the YouTube page address, video identifier, playback state and position, player mode, visibility, and dimensions needed to detect and frame a compatible video. This player-context observation occurs only during the active analysis session shared by the side panel and detached analysis window. The extension temporarily captures the visual output of the selected tab without audio, crops the visible video area, and processes its pixels locally to calculate color-analysis scopes. Selecting Stop from either interface, navigating to an unsupported page, closing the tab, or the capture ending immediately stops both observation and capture. Closing the last analysis interface triggers the same stop after a short technical grace period that tolerates a reload. Captured pixels and page/playback information are not sent to the publisher or any third party. No video image is saved automatically. Only after the user explicitly selects Export frame on the current detailed paused measurement does the extension create a local PNG download of the exact analyzed frame. Only interface preferences and technical consent/session state are stored locally in Chrome; no export history is kept.

## Certifications Limited Use

Les affirmations suivantes doivent rester vraies dans le code au moment de la soumission :

- les données sont utilisées uniquement pour fournir la finalité unique décrite ;
- aucune donnée n’est vendue ou transférée pour la publicité, le profilage ou la solvabilité ;
- aucune donnée n’est transférée à un tiers ;
- aucune donnée n’est utilisée par un humain, sauf si l’utilisateur la fournit volontairement dans une demande de support ;
- aucune image, URL ou donnée de lecture n’est envoyée à l’éditeur ; un PNG n’est créé localement qu’après une demande explicite de l’utilisateur ;
- les permissions demandées constituent le jeu minimal nécessaire ;
- les pratiques déclarées sont identiques dans l’extension, la fiche Store et la politique publique.

## Politique de confidentialité

- Fichier français : [`../../PRIVACY.fr.md`](../../PRIVACY.fr.md)
- Fichier anglais : [`../../PRIVACY.md`](../../PRIVACY.md)
- URL à saisir : `https://dycor.github.io/YouTube-Color-Analyzer/privacy/`

La page doit être accessible sans connexion et rester disponible pendant toute la publication de l’extension.

## Sources officielles

- [Privacy practices du Dashboard](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [FAQ données utilisateur](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)
- [Disclosure Requirements](https://developer.chrome.com/docs/webstore/program-policies/disclosure-requirements)
- [Règles effectives au 1er août 2026](https://developer.chrome.com/blog/cws-policy-updates-2026?hl=en)
