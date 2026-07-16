# YouTube Color Analyzer

**Français** | [English](./README.md) | [中文](./README.zh-CN.md) | [Español](./README.es.md) | [Português](./README.pt-BR.md)

Extension Google Chrome qui analyse localement les pixels visibles d'une vidéo YouTube avec trois instruments inspirés de DaVinci Resolve :

- Parade `YRGB` ou `RGB` ;
- Waveform avec canaux `Y`, `R`, `G`, `B` et mode colorisé ou monochrome ;
- Vecteurscope Rec.709 avec repères de teinte et ligne des tons chair.

L'extension observe l'image sans modifier la vidéo, son fichier source ou son rendu. Elle ne comporte aucun backend, n'enregistre aucune image et n'envoie aucune donnée sur Internet.

L’interface suit automatiquement la langue du navigateur. Elle prend en charge le français, l’anglais, le chinois, l’espagnol et le portugais ; toute autre langue utilise l’anglais.

## État du projet

Le socle fonctionnel comprend :

- un manifeste Chrome MV3 pour Chrome 116 ou version ultérieure ;
- un panneau latéral avec les trois instruments et leurs réglages ;
- un pipeline local `tabCapture` → document hors écran → Web Worker → panneau ;
- un cœur colorimétrique TypeScript indépendant des API Chrome ;
- des tests unitaires, de performance et de chargement dans Chromium.

Le projet cible les pages classiques `youtube.com/watch`, en modes normal et cinéma. Les Shorts, les lecteurs intégrés, le plein écran, le mini-lecteur, Picture-in-Picture et l'analyse HDR calibrée ne font pas partie de la V1.

## Développement

Prérequis : Node.js 22.12 ou version ultérieure et pnpm 10 ou version ultérieure.

```bash
pnpm install
pnpm verify
```

Commandes disponibles :

```bash
pnpm dev        # reconstruit l'extension lors des changements
pnpm ui:preview # ouvre le serveur de prévisualisation de l'interface
pnpm typecheck  # vérifie les types TypeScript
pnpm test       # exécute les tests unitaires
pnpm build      # produit le dossier dist/
pnpm test:e2e   # construit puis charge l'extension dans Chromium
```

Pour prévisualiser uniquement l’interface avec des données synthétiques, exécuter `pnpm ui:preview` puis ouvrir `/preview.html` sur l’adresse locale affichée par Vite. Le paramètre `?lang=` permet de vérifier une langue, par exemple `/preview.html?lang=zh-CN`.

## Charger l'extension dans Chrome

1. Exécuter `pnpm build`.
2. Ouvrir `chrome://extensions`.
3. Activer le mode développeur.
4. Cliquer sur « Charger l'extension non empaquetée ».
5. Sélectionner le dossier `dist/`.
6. Ouvrir une page `https://www.youtube.com/watch?...`.
7. Cliquer sur l'icône de l'extension pour ouvrir le panneau et démarrer l'analyse.

## Architecture

```text
src/
├── analyzer-worker/  calcul des densités des trois instruments
├── content-script/   état et géométrie du lecteur YouTube
├── core/             mathématiques colorimétriques testables
├── offscreen/        capture, recadrage et échantillonnage
├── service-worker/   cycle de vie MV3 et autorisation utilisateur
├── shared/           contrats de messages et constantes
└── sidepanel/        interface et rendu Canvas 2D
```

Les images RGBA restent dans le document hors écran et le worker de calcul. Le panneau reçoit uniquement des cartes d’intensité compactes nécessaires au dessin des scopes.

## Documentation de conception

- [`CONTEXT.md`](./CONTEXT.md) définit le vocabulaire et le périmètre du domaine.
- [`docs/adr/`](./docs/adr/) contient les décisions produit et techniques validées pendant le cadrage.

## Publication, confidentialité et assistance

- [`PRIVACY.fr.md`](./PRIVACY.fr.md) contient la politique de confidentialité et ses traductions.
- [`SUPPORT.fr.md`](./SUPPORT.fr.md) contient les informations d’assistance et de dépannage.
- [`docs/chrome-web-store/`](./docs/chrome-web-store/) contient le dossier de publication Chrome Web Store : fiches localisées, déclarations de données, instructions de test et checklist.

## Licence

Le code source est distribué sous la [Mozilla Public License 2.0](./LICENSE). Les modifications apportées aux fichiers couverts et redistribuées doivent rester disponibles sous MPL 2.0. Cette licence n’accorde aucun droit sur les marques, noms commerciaux ou logos.
