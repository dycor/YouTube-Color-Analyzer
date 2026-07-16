# Chrome Web Store — Privacy practices

Valeurs proposées pour le Developer Dashboard, basées sur le code audité le 17 juillet 2026.

> **Ne pas soumettre tant que la divulgation et le consentement décrits dans [`DATA_DISCLOSURE.md`](./DATA_DISCLOSURE.md) ne sont pas implémentés.** Vérifier à nouveau ces réponses après toute modification du code.

## Finalité unique

### Français

> Fournir des instruments colorimétriques calculés localement à partir du rendu visible de la vidéo YouTube que l’utilisateur choisit explicitement d’analyser.

### English — recommandé pour les examinateurs

> Provide color-analysis scopes calculated locally from the visible rendering of the YouTube video explicitly selected by the user.

## Justification des permissions

### `tabCapture`

> Captures the visual output of the YouTube tab explicitly selected by the user, without audio, so the extension can crop the visible video area and calculate the Parade, Waveform, and Vectorscope locally. Captured pixels are not written to persistent storage or sent to a server.

### `offscreen`

> Creates a Chrome offscreen document to consume the user-initiated tab capture stream, crop video frames with an offscreen canvas, and run the local analysis worker while the side panel displays the results.

### `sidePanel`

> Opens Chrome's side panel to display the three color-analysis scopes and their controls without covering the YouTube video.

### `storage`

> Stores display preferences and the accepted disclosure version in Chrome local storage, plus temporary capture/session state in Chrome session storage. It does not store video images.

### `activeTab`

**Action avant soumission : auditer puis supprimer cette permission si les tests passent sans elle.** Le code n’appelle actuellement aucune API qui exige clairement `activeTab`. La règle de permission minimale interdit de conserver une permission « au cas où ».

Si elle reste nécessaire après preuve par un test, utiliser :

> Allows the extension, after an explicit toolbar click, to inspect the currently selected tab only long enough to determine whether it is a supported YouTube watch page and initiate the requested capture.

### Accès hôte `https://www.youtube.com/*`

> Runs the local content script on YouTube to detect internal single-page navigation and read only the player state and geometry needed to locate, crop, synchronize, suspend, and stop the requested color analysis. Video capture starts only on a supported `/watch` page after user consent and an explicit action.

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

> On YouTube pages, the extension locally reads the current page address, video identifier, playback state and position, player mode, visibility, and dimensions to detect and frame a compatible video. After the user accepts the in-product disclosure and explicitly starts analysis, the extension temporarily captures the visual output of the selected tab without audio, crops the visible video area, and processes its pixels locally to calculate color-analysis scopes. Captured pixels and page/playback information are not sent to the publisher or any third party. No video image is stored persistently. Only interface preferences and technical consent/session state are stored locally in Chrome.

## Certifications Limited Use

Les affirmations suivantes doivent rester vraies dans le code au moment de la soumission :

- les données sont utilisées uniquement pour fournir la finalité unique décrite ;
- aucune donnée n’est vendue ou transférée pour la publicité, le profilage ou la solvabilité ;
- aucune donnée n’est transférée à un tiers ;
- aucune donnée n’est utilisée par un humain, sauf si l’utilisateur la fournit volontairement dans une demande de support ;
- aucune image, URL ou donnée de lecture n’est envoyée à l’éditeur ;
- les permissions demandées constituent le jeu minimal nécessaire ;
- les pratiques déclarées sont identiques dans l’extension, la fiche Store et la politique publique.

## Politique de confidentialité

- Fichier français : [`../../PRIVACY.fr.md`](../../PRIVACY.fr.md)
- Fichier anglais : [`../../PRIVACY.md`](../../PRIVACY.md)
- URL à saisir : `[URL HTTPS PUBLIQUE À COMPLÉTER]`

La page doit être accessible sans connexion et rester disponible pendant toute la publication de l’extension.

## Sources officielles

- [Privacy practices du Dashboard](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [FAQ données utilisateur](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)
- [Disclosure Requirements](https://developer.chrome.com/docs/webstore/program-policies/disclosure-requirements)
- [Règles effectives au 1er août 2026](https://developer.chrome.com/blog/cws-policy-updates-2026?hl=en)
