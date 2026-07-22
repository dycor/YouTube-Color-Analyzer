# Fiche Chrome Web Store — Français

> Document prêt à copier dans le Dashboard.

## Informations générales

- **Nom** : Color Analyzer for YouTube
- **Résumé court** : Analysez localement les couleurs d’une vidéo YouTube avec Parade YRGB/RGB, Waveform et Vecteurscope Rec.709.
- **Langue** : français
- **Catégorie recommandée** : Productivité
- **URL d’accueil** : `https://dycor.github.io/YouTube-Color-Analyzer/fr/`
- **URL d’assistance** : `https://dycor.github.io/YouTube-Color-Analyzer/fr/support/`
- **URL de confidentialité** : `https://dycor.github.io/YouTube-Color-Analyzer/fr/privacy/` (`PRIVACY.fr.md`)

## Divulgation visible relative aux données

Placer ce texte près du début de la description, sans le masquer dans une section secondaire :

> **Traitement des données :** ce n’est qu’après votre acceptation de la divulgation en vigueur dans l’extension et le démarrage explicite de l’analyse que celle-ci lit localement l’adresse de la page YouTube, l’identifiant vidéo et l’état du lecteur nécessaires pour détecter et cadrer une vidéo compatible. Elle observe ce contexte uniquement pendant la session d’analyse active. L’extension capture temporairement le rendu visuel de l’onglet actif, sans audio, et recadre la zone vidéo pour calculer les instruments. « Arrêter », la fermeture du panneau latéral, une navigation ou la fin de la capture arrêtent immédiatement l’observation du contexte et la capture. Les pixels, l’adresse de la page et l’état de lecture restent dans votre navigateur. Aucune image ou donnée de lecture n’est envoyée à un serveur, à l’éditeur ou à un tiers. Les préférences d’affichage et la version du consentement sont conservées dans le stockage local de Chrome. Un identifiant de capture et le dernier état technique sont conservés temporairement dans le stockage de session et disparaissent au plus tard à la fin de la session du navigateur.

## Description détaillée

Color Analyzer for YouTube affiche des instruments colorimétriques dans le panneau latéral de Chrome à partir des pixels visibles de la vidéo en cours de lecture.

Il s’adresse aux monteurs, coloristes et créateurs qui souhaitent étudier une vidéo de référence avant de reproduire une esthétique similaire dans leur propre projet.

TRAITEMENT DES DONNÉES

Ce n’est qu’après votre acceptation de la divulgation en vigueur dans l’extension et le démarrage explicite de l’analyse que celle-ci lit localement l’adresse de la page YouTube, l’identifiant vidéo et l’état du lecteur nécessaires pour détecter et cadrer une vidéo compatible. Elle observe ce contexte uniquement pendant la session d’analyse active. L’extension capture temporairement le rendu visuel de l’onglet actif, sans audio, et recadre la zone vidéo pour calculer les instruments.

« Arrêter », la fermeture du panneau latéral, une navigation ou la fin de la capture arrêtent immédiatement l’observation du contexte et la capture. Les pixels, l’adresse de la page et l’état de lecture restent dans votre navigateur. Aucune image ou donnée de lecture n’est envoyée à un serveur, à l’éditeur ou à un tiers. Les préférences d’affichage et la version du consentement sont conservées dans le stockage local de Chrome. Un identifiant de capture et le dernier état technique sont conservés temporairement dans le stockage de session et disparaissent au plus tard à la fin de la session du navigateur.

INSTRUMENTS INCLUS

• Parade YRGB ou RGB, avec une échelle normalisée de 0 à 100.  
• Waveform avec canaux Y, R, G et B sélectionnables séparément, en affichage colorisé ou monochrome.  
• Vecteurscope dérivé du Rec.709, avec repères de teinte et ligne indicative des tons chair.

FONCTIONNEMENT

Ouvrez une page YouTube classique, cliquez sur l’icône de l’extension et acceptez la divulgation affichée lors de la première utilisation. Le panneau latéral s’ouvre et l’analyse démarre pour la vidéo visible de l’onglet sélectionné.

Pendant la lecture, les instruments sont actualisés en direct. Lorsque la vidéo est en pause, une image plus détaillée est analysée. Les trois instruments sont calculés à partir de la même image. Le panneau ne recouvre pas la vidéo et les réglages sélectionnés sont mémorisés localement.

CONFIDENTIALITÉ

Tout le calcul est réalisé sur l’appareil. Les pixels vidéo restent uniquement dans la mémoire de travail locale pendant la session d’analyse active. À l’arrêt, la source vidéo est libérée et le canvas est réinitialisé à 1 × 1 pixel. Aucune image n’est enregistrée dans un stockage persistant, exportée ou envoyée vers un serveur. L’extension ne possède aucun backend, aucune publicité, aucun outil d’analyse d’audience et ne capture pas l’audio.

COMPATIBILITÉ

• Google Chrome 116 ou version ultérieure.  
• Pages classiques `youtube.com/watch`.  
• Modes normal et cinéma.  
• Interface en français, anglais, chinois, espagnol et portugais.

LIMITES DE LA VERSION 1

L’extension analyse le rendu SDR effectivement affiché par Chrome, pas le fichier vidéo ni le signal original. Les valeurs normalisées de 0 à 100 ne constituent donc pas des mesures broadcast calibrées.

L’analyse HDR calibrée, les Shorts, YouTube Music, les lecteurs intégrés, le plein écran, le mini-lecteur et le mode Picture-in-Picture ne sont pas pris en charge.

Les sous-titres et autres éléments superposés à la vidéo visible peuvent influencer les mesures. L’analyse est suspendue lorsque les commandes YouTube sont visibles.

L’extension fournit uniquement des instruments de mesure. Elle ne modifie pas la vidéo, n’applique aucune correction colorimétrique et ne produit aucune recommandation automatique.

INDÉPENDANCE

Cette extension est un projet indépendant. Elle n’est ni affiliée, ni sponsorisée, ni approuvée, ni officiellement liée à YouTube, Google LLC, Blackmagic Design Pty. Ltd. ou à leurs filiales. YouTube, DaVinci Resolve et les autres marques citées appartiennent à leurs propriétaires respectifs.

## Textes suggérés pour les captures

1. **Trois instruments colorimétriques directement dans Chrome**  
   Parade YRGB/RGB, Waveform et Vecteurscope dans un panneau latéral dédié.
2. **Analyse en direct pendant la lecture**  
   Suivez la luminance, les canaux RGB et la saturation au fil de la vidéo.
3. **Une image plus détaillée lorsque vous mettez en pause**  
   Figez une référence et observez plus précisément sa distribution colorimétrique.
4. **Réglages familiers pour les coloristes**  
   Canaux YRGB, affichage colorisé ou monochrome et ligne indicative des tons chair.
5. **Traitement local et non destructif**  
   Aucune image envoyée ou enregistrée dans un stockage persistant ; la vidéo n’est jamais modifiée.

## Texte pour la vignette 440 × 280

Préférer une vignette sans texte pour qu’elle fonctionne dans toutes les langues. Si du texte est nécessaire :

> COLOR ANALYZER  
> PARADE · WAVEFORM · VECTORSCOPE
