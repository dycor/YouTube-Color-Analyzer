# ADR-0013 — Limiter les surfaces YouTube prises en charge

- Statut : accepté
- Date : 2026-07-15

## Contexte

YouTube présente ses vidéos dans plusieurs surfaces dont la structure, le cadrage et le cycle de vie diffèrent : page classique, Shorts, mini-lecteur, plein écran, Picture-in-Picture et lecteurs intégrés sur des sites tiers. Les prendre toutes en charge dès la première version multiplierait les règles de recadrage et les scénarios de test.

## Décision

La première version prend en charge :

- les pages `https://www.youtube.com/watch` ;
- le lecteur classique en mode normal ou cinéma ;
- les vidéos enregistrées ;
- les directs présentés dans ce même lecteur.

L'analyse est suspendue avec un message explicatif lorsque la vidéo passe :

- en plein écran ;
- dans le mini-lecteur YouTube ;
- en Picture-in-Picture.

La première version ne prend pas en charge :

- les Shorts ;
- les lecteurs YouTube intégrés sur d'autres sites ;
- YouTube Music.

## Conséquences

- Les permissions d'hôte peuvent être limitées à `https://www.youtube.com/*`.
- Le script de contenu doit reconnaître la route `/watch` malgré la navigation interne sans rechargement complet de YouTube.
- Les changements de mode du lecteur doivent suspendre ou reprendre la session sans perdre les réglages.
- Les tests de bout en bout doivent couvrir les modes normal et cinéma, la navigation entre deux vidéos et les états suspendus.

