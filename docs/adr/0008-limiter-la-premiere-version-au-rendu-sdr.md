# ADR-0008 — Limiter la première version au rendu SDR

- Statut : accepté
- Date : 2026-07-15

## Contexte

L'extension analyse les pixels finalement rendus par Google Chrome, et non le signal vidéo original avant décodage, gestion des couleurs et rendu par le navigateur. Présenter ces valeurs comme des niveaux broadcast ou comme des mesures HDR calibrées créerait une précision trompeuse.

La gestion correcte du HDR demanderait notamment de connaître et d'interpréter la fonction de transfert, l'espace colorimétrique, le tone mapping et la luminance de référence.

## Décision

La première version prend officiellement en charge l'analyse des vidéos SDR.

- Les axes verticaux utilisent une échelle normalisée de `0` à `100`.
- `0` représente le noir rendu par Chrome.
- `100` représente le blanc rendu par Chrome.
- L'interface n'emploie pas les unités IRE, les valeurs de code 10 bits ou les nits pour qualifier cette échelle.
- Lorsqu'une vidéo HDR est détectée, l'interface affiche un avertissement indiquant que les mesures ne sont pas garanties.
- La première version ne fournit pas d'analyse HDR calibrée ni d'échelle en nits.

## Conséquences

- Les instruments doivent partager la même conversion des composantes rendues vers l'intervalle `0–100`.
- Les libellés de l'interface doivent distinguer clairement une valeur normalisée d'une mesure du signal source.
- La détection HDR doit échouer prudemment : l'absence de détection ne doit jamais être présentée comme une preuve que la vidéo est SDR.
- Une future prise en charge HDR devra définir le pipeline colorimétrique et les métadonnées nécessaires avant d'afficher des mesures garanties.

