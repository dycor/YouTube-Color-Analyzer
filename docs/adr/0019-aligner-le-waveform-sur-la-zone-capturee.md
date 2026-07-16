# ADR-0019 — Aligner le Waveform sur la zone réellement capturée

- Statut : accepté
- Date : 2026-07-15

## Contexte

La comparaison d'une même image entre DaVinci Resolve et l'extension a révélé deux écarts. La trace de l'extension était comprimée au centre avec de longues lignes artificielles à zéro, et son intensité variait entre l'analyse en direct et l'image détaillée.

Le flux fourni par `chrome.tabCapture` n'a pas nécessairement le même ratio que le viewport CSS. Chromium conserve le ratio du viewport, le centre dans le flux et remplit les marges restantes en noir. La conversion précédente appliquait deux facteurs indépendants sur les axes horizontal et vertical ; elle traitait donc les marges du flux comme du contenu et pouvait demander à Canvas une zone partiellement hors limites.

Le Waveform utilisait par ailleurs 384 colonnes dans tous les modes, une normalisation au maximum global de chaque image et des couleurs déjà pondérées par l'intensité auxquelles Canvas appliquait une seconde fois l'alpha.

## Décision

### Géométrie de capture

- La conversion du viewport CSS vers le flux capturé utilise un facteur uniforme égal au plus petit rapport entre leurs dimensions.
- La zone du viewport est centrée dans le flux ; ses décalages horizontal et vertical sont intégrés avant de convertir le rectangle vidéo.
- Un rectangle qui sort de la zone capturée est rejeté au lieu de produire des pixels Canvas transparents mesurés comme du noir.
- Les pixels totalement transparents sont ignorés par le cœur d'analyse comme défense supplémentaire.
- Seules les marges ajoutées par le lecteur ou par `tabCapture` sont exclues. Les bandes noires réellement encodées dans la vidéo restent dans la mesure, comme dans DaVinci Resolve.

### Précision et rendu du Waveform

- Le direct utilise jusqu'à 512 colonnes horizontales et l'image détaillée jusqu'à 1024.
- Les 256 niveaux verticaux sont conservés, car Chrome expose des composantes rendues sur 8 bits ; une échelle interne de 1024 niveaux inventerait une précision absente de la source.
- L'intensité est normalisée avec une réponse fixe selon la proportion de pixels de chaque niveau dans sa propre colonne. Une zone dense ne modifie donc plus la luminosité des autres colonnes ni celle de l'image suivante.
- Les composantes colorées sont converties en RGB non prémultiplié avant d'appliquer leur alpha. Une trace rouge faible reste rouge saturé et des traces R, G et B identiques apparaissent blanches.

### Cycle de calcul

- La normalisation et l'encodage Base64 sont effectués dans le worker. La contre-pression mesure ainsi le calcul complet jusqu'au message prêt à être envoyé.
- Une image détaillée en pause n'est recalculée que si la vidéo, la position temporelle, la géométrie ou la résolution de la source change.
- Les changements de taille du viewport et de la vidéo déclenchent immédiatement un nouvel état géométrique, en complément du contrôle périodique.

## Conséquences

- La position horizontale du signal reste comparable à celle de DaVinci Resolve même lorsque le panneau latéral change le ratio du viewport.
- Les lignes à zéro ajoutées par le conteneur de capture disparaissent sans supprimer les noirs appartenant à l'œuvre analysée.
- Le rendu détaillé est plus fin et la luminosité de la trace est stable entre lecture et pause.
- Le message détaillé est plus volumineux, mais il n'est envoyé qu'une fois par image arrêtée inchangée.
- Les tests couvrent désormais le letterboxing et le pillarboxing du flux, les rectangles invalides, les pixels transparents, la résolution adaptative, la stabilité de densité et la composition YRGB.
