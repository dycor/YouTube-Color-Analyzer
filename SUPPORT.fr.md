# Assistance — YouTube Color Analyzer

**Français** | [English](./SUPPORT.md) | [中文](./SUPPORT.zh-CN.md) | [Español](./SUPPORT.es.md) | [Português](./SUPPORT.pt-BR.md)

## Obtenir de l’aide

- Adresse d’assistance : **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**
- Suivi des problèmes : **[URL PUBLIQUE DES ISSUES À COMPLÉTER]**
- Politique de confidentialité : [PRIVACY.fr.md](./PRIVACY.fr.md)
- Délai de réponse indicatif : **[DÉLAI À COMPLÉTER, PAR EXEMPLE 5 JOURS OUVRÉS]**

N’envoyez pas de capture contenant des informations personnelles, un compte privé ou du contenu confidentiel. L’extension ne nécessite jamais votre mot de passe YouTube ou Google.

## Vérifications rapides

### Le panneau reste en attente

1. Utilisez Google Chrome 116 ou une version ultérieure.
2. Ouvrez une page classique `https://www.youtube.com/watch?...`.
3. Rechargez la page après avoir installé ou mis à jour l’extension.
4. Cliquez sur l’icône de l’extension et acceptez la divulgation lors de la première utilisation.

### L’analyse est suspendue

- utilisez le mode normal ou cinéma ;
- quittez le plein écran, le mini-lecteur et Picture-in-Picture ;
- rendez l’onglet YouTube actif ;
- vérifiez que toute l’image vidéo est visible ;
- éloignez le pointeur afin de masquer les commandes YouTube.

### Les instruments ne se mettent pas à jour

- vérifiez que la vidéo contient déjà une image décodée ;
- cliquez sur « Arrêter », puis de nouveau sur l’icône de l’extension ;
- rechargez la page YouTube si l’extension vient d’être mise à jour ;
- essayez une autre vidéo publique afin d’écarter une restriction propre à la source.

### Les mesures semblent différentes de DaVinci Resolve

La version 1 analyse le rendu SDR visible produit par Chrome. Elle n’accède ni au fichier vidéo original, ni au signal décodé avant l’affichage, ni aux métadonnées colorimétriques complètes. Les instruments sont destinés à l’observation et ne constituent pas des mesures broadcast calibrées.

Les sous-titres, commandes et autres superpositions visibles peuvent également influencer le résultat.

## Périmètre pris en charge

- pages classiques `youtube.com/watch` ;
- modes normal et cinéma ;
- Parade YRGB/RGB, Waveform YRGB et Vecteurscope Rec.709 ;
- analyse en direct et image plus détaillée en pause.

Ne sont pas pris en charge dans la version 1 : Shorts, YouTube Music, lecteurs intégrés, plein écran, mini-lecteur, Picture-in-Picture et analyse HDR calibrée.

## Signaler un problème

Indiquez, sans joindre de données sensibles :

1. la version de Chrome ;
2. le système d’exploitation ;
3. la version de l’extension ;
4. le type de page et le mode du lecteur ;
5. les étapes permettant de reproduire le problème ;
6. le résultat observé et le résultat attendu ;
7. les erreurs visibles sur `chrome://extensions`, si elles existent.

## Confidentialité et sécurité

Pour une question relative aux données ou pour signaler une vulnérabilité, écrivez à **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**. Ne publiez pas publiquement les détails d’une vulnérabilité non corrigée.

## Indépendance

YouTube Color Analyzer est un projet indépendant. Il n’est ni affilié, ni approuvé, ni sponsorisé par Google, YouTube ou Blackmagic Design.
