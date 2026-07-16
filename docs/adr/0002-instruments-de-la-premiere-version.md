# ADR-0002 — Fournir trois instruments dans la première version

- Statut : accepté
- Date : 2026-07-15

## Contexte

L'utilisateur veut comprendre la colorimétrie d'une vidéo de référence sur YouTube afin de reproduire un rendu similaire dans DaVinci Resolve. Une simple appréciation visuelle de la vidéo ne fournit pas les mesures nécessaires à ce travail.

## Décision

La première version de l'extension fournit les trois instruments suivants :

- parade ;
- oscilloscope ;
- vecteurscope.

L'oscilloscope correspond au Waveform de DaVinci Resolve. Il superpose les niveaux des différents canaux de couleur ; lorsque les traces rouge, verte et bleue coïncident à une intensité égale, elles apparaissent blanches. Les unités, les échelles et les réglages disponibles seront précisés pendant le cadrage.

## Conséquences

- L'architecture devra pouvoir calculer trois représentations à partir d'une même image vidéo.
- La fidélité et la lisibilité des mesures pour un utilisateur habitué à DaVinci Resolve seront des critères d'acceptation.
- Les autres instruments colorimétriques ne font pas partie des besoins confirmés à ce stade.
