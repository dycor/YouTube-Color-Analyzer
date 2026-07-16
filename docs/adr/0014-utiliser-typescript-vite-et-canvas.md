# ADR-0014 — Utiliser TypeScript, Vite et Canvas

- Statut : accepté
- Date : 2026-07-15

## Contexte

Le projet combine plusieurs contextes d'exécution propres aux extensions Chrome : service worker, script de contenu, document hors écran, worker de calcul et panneau latéral. Il doit également exécuter des calculs colorimétriques testables et afficher des cartes de densité à cadence régulière.

Un framework d'interface ou un backend ajouterait des couches qui ne sont pas nécessaires au périmètre de la première version.

## Décision

La première version utilise :

- Chrome Manifest V3, avec Chrome 116 comme version minimale ;
- TypeScript en mode strict pour tout le code ;
- Vite en configuration multi-entrée pour construire les différents contextes de l'extension ;
- TypeScript, HTML et CSS natifs pour le panneau latéral, sans framework d'interface ;
- Canvas 2D pour rendre les instruments ;
- un Web Worker et `OffscreenCanvas` pour préparer les images de mesure et calculer les densités ;
- des tableaux typés pour représenter et transférer les données des instruments ;
- `pnpm` pour gérer les dépendances et les scripts ;
- Vitest pour les tests unitaires et colorimétriques ;
- Playwright avec Chromium pour les tests de l'extension complète.

Le projet ne comporte aucun backend et ne charge aucun code ou service distant à l'exécution.

## Conséquences

- Le build doit produire des noms de fichiers déterministes référencés par `manifest.json`.
- Les contrats de messages entre service worker, script de contenu, document hors écran, worker et panneau doivent être typés et validés.
- Le cœur colorimétrique doit rester indépendant des API Chrome et du DOM afin d'être testé avec des images synthétiques.
- Le type-checking doit être exécuté séparément des tests, Vite et Vitest ne remplaçant pas `tsc --noEmit`.
- Les tests de bout en bout doivent charger l'extension construite dans un contexte Chromium persistant.

## Sources

- [Chrome Extensions — Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
- [Vite — Building for Production](https://vite.dev/guide/build.html)
- [Vitest — Getting Started](https://vitest.dev/guide/)
- [Playwright — Chrome extensions](https://playwright.dev/docs/chrome-extensions)

