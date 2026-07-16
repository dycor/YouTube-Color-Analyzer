# ADR-0015 — Adapter la précision à l'état du lecteur

- Statut : accepté
- Date : 2026-07-15

## Contexte

Calculer les trois instruments à partir de tous les pixels visibles d'une vidéo HD à chaque image consommerait inutilement des ressources pendant la lecture. À l'inverse, une image arrêtée est le moment où l'utilisateur peut examiner précisément une référence et tolérer un calcul ponctuel plus détaillé.

Le redimensionnement par moyenne peut atténuer des valeurs extrêmes et modifier artificiellement les traces. L'échantillonnage doit donc sélectionner uniformément des pixels réels sans mélanger leurs couleurs.

## Décision

Le pipeline utilise deux niveaux de précision.

### Pendant la lecture

- L'image est échantillonnée uniformément, sans moyenne des couleurs.
- La grille d'analyse est limitée à `640 × 360` pixels en conservant le ratio de l'image.
- Les bandes noires ajoutées par la mise en page du lecteur sont exclues.
- Les trois instruments sont accumulés en une seule traversée des pixels.
- Le budget cible est de `50 ms` de calcul au maximum par image de mesure.
- La cadence reste plafonnée à 15 Hz et diminue automatiquement si le budget ne peut pas être tenu.

### En pause ou après un déplacement

- Un calcul détaillé est effectué une fois à partir de l'image courante.
- Il utilise jusqu'à `1920 × 1080` pixels, sans dépasser la résolution réellement visible dans le flux capturé.
- Le résultat détaillé reste affiché jusqu'à la reprise de la lecture ou au changement de position.

## Conséquences

- Le recadrage doit distinguer la zone de l'élément vidéo de la zone où l'image est réellement dessinée afin d'exclure les bandes noires.
- L'algorithme d'échantillonnage doit être déterministe pour qu'une même image produise les mêmes densités.
- Le cœur de calcul doit accumuler Parade, Waveform et Vecteurscope dans une boucle partagée.
- Le planificateur doit mesurer le temps de calcul et appliquer une contre-pression plutôt que créer une file d'images en retard.
- Les tests de performance doivent couvrir les deux niveaux de précision et vérifier la stabilité de la mémoire.

