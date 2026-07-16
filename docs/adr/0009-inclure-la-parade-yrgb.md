# ADR-0009 — Inclure la Parade YRGB dans la première version

- Statut : accepté
- Date : 2026-07-15

## Contexte

Une Parade RGB permet de comparer les trois canaux de couleur, mais ne montre pas séparément la luminance. L'utilisateur demande explicitement le mode YRGB dès la première version afin de disposer d'une lecture comparable à celle proposée par DaVinci Resolve.

## Décision

La première version fournit deux modes de Parade.

Le mode `YRGB`, sélectionné par défaut, est composé de quatre graphiques adjacents, dans l'ordre suivant :

1. luminance `Y` ;
2. rouge `R` ;
3. vert `G` ;
4. bleu `B`.

Le mode `RGB` constitue un second affichage sélectionnable. Il masque le graphique `Y` et répartit la largeur disponible entre les trois canaux de couleur.

La trace `Y` est blanche et les traces `R`, `G` et `B` sont colorées. Chaque graphique répète la position horizontale complète de l'image source et utilise l'échelle verticale normalisée `0–100`, avec des repères à `0`, `25`, `50`, `75` et `100`.

Le mode `YCbCr` n'est pas proposé dans la première version.

## Conséquences

- Le calcul de luminance `Y` doit être partagé avec le canal `Y` du Waveform afin d'éviter des mesures contradictoires.
- La largeur variable du panneau Chrome doit rester suffisante pour distinguer quatre graphiques adjacents et leurs libellés.
- Les quatre graphiques doivent être calculés à partir de la même image de mesure.
- Le choix entre `YRGB` et `RGB` doit être mémorisé.
