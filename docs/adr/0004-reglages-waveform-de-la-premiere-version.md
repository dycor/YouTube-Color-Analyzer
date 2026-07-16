# ADR-0004 — Exposer les canaux et la colorisation du Waveform

- Statut : accepté
- Date : 2026-07-15

## Contexte

DaVinci Resolve propose plusieurs réglages pour adapter la lecture du Waveform. Tous les reproduire dès la première version augmenterait le périmètre de l'extension avant que leur utilité soit confirmée.

## Décision

La première version rend configurables :

- la visibilité individuelle des canaux `Y`, `R`, `G` et `B` ;
- la colorisation ou l'affichage monochrome des traces.

Par défaut, les canaux `R`, `G` et `B` sont visibles et colorisés. Le canal `Y` est masqué. En mode monochrome, toutes les traces actives sont affichées en blanc.

Le canal de chrominance `C` n'est pas proposé dans la première version, le vecteurscope couvrant déjà l'analyse de la chrominance nécessaire au produit.

Les autres réglages observés dans DaVinci Resolve, notamment l'intensité visuelle de la trace et l'affichage des étendues, ne sont pas inclus dans le périmètre confirmé de la première version.

## Conséquences

- L'état du Waveform doit mémoriser la visibilité de chacun des quatre canaux pris en charge.
- Le moteur de rendu doit pouvoir basculer les traces actives entre colorisation et blanc sans recalculer la vidéo source.
- L'interface doit rendre ces deux réglages accessibles sans encombrer les instruments.
