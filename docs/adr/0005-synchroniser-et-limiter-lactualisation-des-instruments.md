# ADR-0005 — Synchroniser et limiter l'actualisation des instruments

- Statut : accepté
- Date : 2026-07-15

## Contexte

La parade, le Waveform et le vecteurscope doivent rester utiles pendant la lecture d'une vidéo YouTube sans consommer inutilement les ressources de la machine. Des instruments calculés à partir d'images différentes produiraient en outre une lecture incohérente.

## Décision

Les trois instruments sont toujours calculés à partir de la même image vidéo échantillonnée, appelée « image de mesure ».

Le comportement dépend de l'état du lecteur :

- pendant la lecture, les images de mesure sont actualisées au maximum 15 fois par seconde ;
- le document de capture utilise une boucle temporisée dédiée et ne dépend pas de `requestVideoFrameCallback` sur le flux d’onglet capturé ;
- chaque nouvel état `playing` déclenche aussi une tentative immédiate, ce qui fournit une reprise robuste même si les minuteurs d’arrière-plan sont temporairement ralentis ;
- en pause, l'image correspondant à la position courante est calculée précisément, puis les instruments restent figés ;
- pendant un déplacement dans la barre temporelle, les calculs sont limités, puis un calcul précis est déclenché lorsque la nouvelle position est fixée ;
- lorsque l'onglet est inactif ou que les instruments sont masqués, l'analyse est suspendue ;
- lorsque les instruments redeviennent visibles, l'analyse reprend automatiquement à partir de la position courante.

## Conséquences

- Le pipeline ne doit extraire et préparer chaque image de mesure qu'une seule fois pour les trois instruments.
- La cadence de calcul pendant la lecture est plafonnée à 15 Hz, indépendamment de la cadence de la vidéo.
- Une tentative est ignorée lorsqu’un calcul précédent est encore en cours ou lorsque l’intervalle adaptatif n’est pas écoulé.
- Les changements de lecture, pause, position et visibilité doivent déclencher explicitement les transitions du pipeline.
- Les tests de performance doivent vérifier l'absence de calcul continu lorsque l'analyse est suspendue.
