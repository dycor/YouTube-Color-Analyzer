# Contexte du domaine

## Intention

Permettre à une personne regardant une vidéo sur YouTube dans Google Chrome d'en examiner les caractéristiques colorimétriques à l'aide d'instruments de mesure visuels, afin de reproduire ensuite une colorimétrie similaire dans DaVinci Resolve.

Le produit observe la vidéo. Il ne la corrige pas, ne l'étalonne pas et ne modifie ni son contenu ni son rendu.

## Utilisateur principal

Monteur ou coloriste utilisant déjà DaVinci Resolve et connaissant les principes de base des scopes. Cette personne analyse une vidéo YouTube comme référence avant d'étalonner son propre projet.

La première version fournit des mesures, pas des recommandations. Elle ne propose ni correction automatique, ni conseil d'étalonnage, ni parcours pédagogique. De courtes infobulles peuvent définir les commandes sans interpréter les résultats à la place de l'utilisateur.

## Vocabulaire partagé

### Vidéo analysée

La vidéo actuellement affichée par le lecteur YouTube et utilisée comme source des mesures.

Dans la première version, elle doit être ouverte sur une page classique `youtube.com/watch`, avec le lecteur en mode normal ou cinéma. Les vidéos enregistrées et les directs utilisant ce lecteur sont acceptés.

L'analyse est suspendue avec un message explicatif lorsque le lecteur passe en plein écran, en mini-lecteur ou en Picture-in-Picture. Les Shorts, les lecteurs YouTube intégrés sur d'autres sites et YouTube Music ne sont pas pris en charge.

### Instrument colorimétrique

Une représentation calculée à partir de l'image de la vidéo analysée pour aider à évaluer ses couleurs ou sa luminance.

La première version doit fournir une parade, un oscilloscope et un vecteurscope.

### Référence colorimétrique

Le rendu de la vidéo analysée que l'utilisateur cherche à comprendre, puis à reproduire sur une autre vidéo dans DaVinci Resolve.

### Parade

Instrument qui sépare les composantes de l'image afin de rendre leurs niveaux comparables.

La première version fournit deux modes de Parade :

- `YRGB`, sélectionné par défaut, affiche côte à côte la luminance `Y`, puis les canaux rouge, vert et bleu ;
- `RGB` affiche uniquement les trois canaux de couleur et leur accorde davantage de largeur dans le panneau.

La trace `Y` est blanche et les traces `R`, `G` et `B` sont colorées. Tous les graphiques utilisent l'échelle normalisée `0–100`, avec des repères à `0`, `25`, `50`, `75` et `100`, et conservent la même correspondance horizontale avec l'image source.

Le mode `YCbCr` n'est pas proposé dans la première version.

### Oscilloscope (Waveform)

Instrument inspiré du Waveform de DaVinci Resolve qui représente les niveaux de l'image courante :

- l'axe horizontal correspond à la position horizontale des pixels dans l'image ;
- l'axe vertical correspond au niveau du signal, des valeurs sombres en bas aux valeurs claires en haut ;
- les traces rouge, verte et bleue sont superposées ;
- lorsque les trois canaux ont une intensité égale au même endroit, leurs traces coïncident et apparaissent blanches.

Le blanc n'est donc pas une ligne de référence indépendante. Il signale l'égalité des intensités RGB et, en pratique, une zone neutre de l'image.

Dans la première version, l'utilisateur peut activer ou masquer séparément les canaux `Y`, `R`, `G` et `B`.

Par défaut, `R`, `G` et `B` sont visibles et colorisés, tandis que `Y` est masqué. Lorsque la colorisation est désactivée, toutes les traces actives sont affichées en blanc. Le canal de chrominance `C` n'est pas proposé dans la première version.

### Vecteurscope

Instrument circulaire qui représente la distribution des couleurs de l'image selon une projection `Rec.709` dérivée des pixels SDR rendus par Chrome.

- L'angle représente la teinte.
- Le centre représente une saturation nulle.
- Le bord extérieur représente une saturation normalisée de `100 %`.
- La trace est colorisée selon la teinte analysée.
- Le graticule identifie les teintes rouge (`R`), magenta (`Mg`), bleu (`B`), cyan (`Cy`), vert (`G`) et jaune (`Y`).
- Une ligne indicative des tons chair peut être masquée ; elle est visible par défaut.

La première version ne propose pas de zoom `2×`, car il fausserait la lecture directe de la saturation.

### Analyse non destructive

Lecture et calcul de mesures à partir de la vidéo analysée sans altérer la vidéo, son fichier source, son flux, ni son rendu dans le lecteur YouTube.

### Image de mesure

Image vidéo unique utilisée simultanément pour calculer la parade, le Waveform et le vecteurscope. Les trois instruments doivent toujours représenter la même image de mesure.

Dans la première version, l'image de mesure couvre toujours l'intégralité de l'image vidéo. L'utilisateur ne peut pas sélectionner, masquer ou isoler une zone particulière.

Pendant la lecture, une nouvelle image de mesure est échantillonnée au maximum 15 fois par seconde. En pause, l'image correspondant à la position courante est calculée précisément puis reste figée. Pendant un déplacement dans la barre temporelle, l'actualisation est limitée et un calcul précis est effectué dès que la nouvelle position est fixée.

Pendant la lecture, l'échantillonnage uniforme est limité à `640 × 360` pixels en conservant le ratio de l'image et sans moyenner les couleurs. En pause ou après un déplacement, un calcul détaillé utilise jusqu'à `1920 × 1080` pixels réellement visibles. Le Waveform conserve jusqu'à 512 colonnes en direct et 1024 en pause, sur 256 niveaux issus du rendu 8 bits de Chrome. Les marges noires ajoutées par le lecteur ou le conteneur de capture sont exclues géométriquement ; les bandes noires encodées dans la vidéo restent analysées.

Les trois instruments sont calculés en une traversée de la même image. Le calcul vise au maximum `50 ms` par image pendant la lecture ; si la machine ne tient pas ce budget, la fréquence d'actualisation diminue automatiquement sous le plafond de 15 Hz.

L'analyse est suspendue lorsque l'onglet est inactif ou lorsque les instruments sont masqués, puis reprend automatiquement lorsqu'ils redeviennent visibles.

### Niveau normalisé

Valeur comprise entre `0` et `100` dérivée des pixels SDR effectivement rendus par Google Chrome. `0` représente le noir affiché et `100` le blanc affiché.

Cette valeur ne prétend pas représenter le signal vidéo original ni constituer une mesure broadcast calibrée.

### Vidéo HDR

Vidéo utilisant une plage dynamique élevée. La première version tente de la détecter et affiche un avertissement, car elle ne garantit pas la fiabilité de ses mesures HDR. Elle ne propose ni échelle en nits ni interprétation HDR calibrée.

### Panneau d'analyse

Panneau latéral natif de Google Chrome qui contient l'interface de l'extension. Il s'ouvre depuis l'icône de l'extension et reste séparé de la page YouTube afin de ne jamais recouvrir la vidéo.

Le panneau propose trois onglets : `Parade`, `Waveform` et `Vecteurscope`. Un seul instrument est affiché en grand à la fois et le dernier onglet utilisé est mémorisé.

### Session d'analyse

Période pendant laquelle l'extension capture localement la zone visible du lecteur YouTube et calcule les instruments. Elle commence après un clic explicite sur l'icône de l'extension.

L'extension capture uniquement la vidéo de l'onglet, sans l'audio, avec `chrome.tabCapture`. Un script présent sur YouTube communique les coordonnées du lecteur afin que le flux soit recadré sur sa zone visible. Le traitement est réalisé dans un document hors écran de l'extension.

Les images brutes ne sont ni enregistrées, ni envoyées sur Internet, ni transmises au panneau d'analyse. Seules les données calculées nécessaires au rendu des instruments sont communiquées au panneau.

La session s'arrête lorsque le panneau est fermé, que l'utilisateur quitte YouTube ou que l'onglet capturé disparaît.

### Superposition YouTube

Élément visuel ajouté par YouTube au-dessus de la vidéo, comme les commandes du lecteur ou les sous-titres. Puisque la capture observe le rendu visible de l'onglet, ces éléments feraient partie de l'image de mesure.

L'analyse est suspendue lorsque les commandes du lecteur sont visibles. Lorsque des sous-titres sont actifs, l'extension avertit l'utilisateur sans les masquer ni modifier la page.

## Hors périmètre confirmé

- Modifier les pixels visibles de la vidéo.
- Appliquer une correction colorimétrique ou un étalonnage.
- Modifier ou remplacer le fichier vidéo YouTube.
- Fournir des mesures HDR garanties ou une échelle en nits.
- Enregistrer, exporter ou transmettre les images de la vidéo analysée.
- Analyser les Shorts, les lecteurs intégrés sur d'autres sites ou YouTube Music.
- Dépendre d'un backend ou d'un service distant pendant l'analyse.
