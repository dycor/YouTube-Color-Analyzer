# ADR-0003 — Aligner l'oscilloscope sur le Waveform de DaVinci Resolve

- Statut : accepté
- Date : 2026-07-15

## Contexte

L'extension sert à étudier une référence YouTube avant de reproduire sa colorimétrie dans DaVinci Resolve. Employer une représentation différente obligerait l'utilisateur à réinterpréter les mesures entre les deux outils.

La documentation officielle de DaVinci Resolve nomme cet instrument « Waveform Monitor ».

## Décision

L'oscilloscope de l'extension adopte les conventions fondamentales du Waveform de DaVinci Resolve :

- il analyse l'image courante ;
- sa coordonnée horizontale correspond à la position horizontale dans l'image source ;
- sa coordonnée verticale représente le niveau du signal, du noir en bas au blanc en haut ;
- les traces des canaux rouge, vert et bleu sont superposées ;
- une trace devient blanche à l'endroit où les trois canaux coïncident avec une intensité égale.

Le blanc n'est pas une courbe de référence indépendante. Il matérialise la superposition des canaux et indique une zone neutre.

Le produit conserve le terme utilisateur « Oscilloscope », accompagné de « Waveform » dans la documentation afin de rester comparable à DaVinci Resolve.

## Conséquences

- Le calcul doit préserver la relation entre chaque colonne de pixels de la vidéo et la même position horizontale dans le graphique.
- Le rendu doit composer visuellement les trois traces RGB et produire du blanc lorsqu'elles coïncident.
- La première version rend configurables les canaux affichés et la colorisation. Les autres réglages restent hors du périmètre confirmé.

## Sources

- [DaVinci Resolve — Color, Professional Scopes](https://www.blackmagicdesign.com/products/davinciresolve/color)
- [The Colorist Guide to DaVinci Resolve 20](https://documents.blackmagicdesign.com/UserManuals/DaVinci-Resolve-20-Colorist-Guide.pdf)
