# ADR-0001 — Limiter le produit à l'analyse non destructive

- Statut : accepté
- Date : 2026-07-15

## Contexte

Le produit doit fournir des outils colorimétriques pour examiner une vidéo lue sur YouTube. Une ambiguïté importante existe entre observer les propriétés de l'image et appliquer des transformations à cette image.

## Décision

L'extension calcule et affiche uniquement des mesures dérivées de la vidéo analysée.

Elle ne modifie pas les pixels visibles, le rendu du lecteur, le flux vidéo, ni le fichier source. Les fonctions de correction, de filtrage et d'étalonnage sont exclues.

## Conséquences

- Les fonctionnalités sont évaluées selon leur capacité à informer l'utilisateur, pas à transformer l'image.
- Une visualisation de mesure est autorisée dès lors qu'elle est séparée du rendu original.
- Toute future proposition de correction colorimétrique devra rouvrir explicitement cette décision.

