# Politique de confidentialité — Color Analyzer for YouTube

**Français** | [English](./PRIVACY.md) | [中文](./PRIVACY.zh-CN.md) | [Español](./PRIVACY.es.md) | [Português](./PRIVACY.pt-BR.md)

Date d’entrée en vigueur : 17 juillet 2026  
Dernière mise à jour : 22 juillet 2026

Éditeur : **Color Analyzer**

Contact confidentialité : **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**

## 1. Objet de l’extension

Color Analyzer for YouTube est une extension Chrome qui génère localement une Parade, un Waveform et un Vecteurscope à partir de l’image visible d’une vidéo YouTube. Elle sert uniquement à observer et analyser la colorimétrie ; elle ne modifie ni la vidéo, ni son fichier source, ni son rendu.

## 2. Résumé

- l’analyse commence uniquement après une action explicite de l’utilisateur sur l’icône de l’extension et, lors de la première utilisation ou après une mise à jour de la divulgation, l’acceptation de la divulgation relative aux données affichée dans l’extension ;
- le contexte de la page et l’état du lecteur sont observés uniquement pendant une session d’analyse active, et cette observation s’arrête avec la session ;
- les pixels visibles de la vidéo sont traités localement sur l’appareil ;
- l’audio n’est pas capturé ;
- aucune image de la vidéo n’est enregistrée sur le disque ou envoyée à l’éditeur ;
- l’extension ne comporte ni compte utilisateur, ni publicité, ni outil d’analyse d’audience, ni serveur applicatif ;
- l’éditeur ne vend, ne partage et ne reçoit aucune donnée issue de l’analyse.

## 3. Données traitées

### 3.1 Pixels visibles de la vidéo

Pendant une session d’analyse active, l’extension capture temporairement le rendu visuel de l’ensemble de l’onglet YouTube sélectionné. Elle recadre ensuite la zone visible de la vidéo et lit uniquement les valeurs de pixels de cette zone afin de calculer les trois instruments colorimétriques.

Le rendu capturé peut inclure les éléments visibles superposés à la vidéo, notamment des sous-titres ou des commandes du lecteur. L’extension signale certains de ces cas, car ils peuvent influencer la mesure.

Les tableaux de pixels bruts sont conservés en mémoire de travail le temps nécessaire au calcul, puis leurs références sont libérées. Pendant une session active, le canvas local peut conserver la dernière image recadrée en mémoire jusqu’à son remplacement par une autre image. À l’arrêt de la capture, le canvas est réinitialisé à 1 × 1 pixel et la source vidéo est libérée. Aucune image n’est écrite dans un stockage persistant, ajoutée à un historique ou transmise sur Internet.

### 3.2 Contexte de la page et état du lecteur

Un script local de l’extension est présent sur les pages `youtube.com`, mais il reste inactif jusqu’à ce que l’utilisateur ait accepté la divulgation relative aux données en vigueur et démarre explicitement une analyse. Uniquement pendant une session d’analyse active, il observe périodiquement le contexte de la page et l’état du lecteur. Cette observation s’arrête immédiatement lorsque l’utilisateur choisit « Arrêter », navigue vers une page non prise en charge, ferme l’onglet ou que la capture prend fin. La fermeture du panneau latéral l’arrête après un bref délai technique qui permet de tolérer un rechargement du panneau. Le contexte du lecteur n’est pas observé entre deux sessions d’analyse. Pour localiser correctement la vidéo, détecter les navigations internes de YouTube et synchroniser les mesures pendant la session active, l’extension traite temporairement :

- l’adresse de la page YouTube courante et l’identifiant de la vidéo ;
- le temps de lecture et l’état lecture, pause ou recherche ;
- le mode du lecteur, la visibilité de l’onglet et la présence des commandes ou sous-titres ;
- les dimensions de la fenêtre, du lecteur et de la vidéo.

Ces informations sont utilisées uniquement pour fournir l’analyse demandée, suspendre le calcul des mesures lorsque la source n’est pas exploitable et éviter d’analyser une mauvaise zone. L’adresse, l’identifiant vidéo et le temps de lecture ne sont pas enregistrés de manière persistante et ne sont pas transmis à l’éditeur.

### 3.3 Préférences locales

L’extension enregistre dans le stockage local de Chrome les préférences d’affichage suivantes : instrument sélectionné, mode de Parade, canaux du Waveform, colorisation et affichage de la ligne des tons chair. Elle conserve également la version de la divulgation relative aux données que l’utilisateur a acceptée. Cette valeur technique ne contient ni identité, ni adresse de page, ni image vidéo.

Ces préférences restent sur l’appareil jusqu’à leur remplacement, l’effacement des données de l’extension ou sa désinstallation.

### 3.4 Données techniques de session

Pendant la session du navigateur, l’extension peut conserver un identifiant aléatoire de session, l’identifiant interne de l’onglet capturé et le dernier état de l’analyse. Ces informations servent uniquement à associer les mesures à la bonne capture et à arrêter proprement celle-ci. Elles restent dans le stockage de session de Chrome et ne sont pas envoyées à l’éditeur.

## 4. Transmission, partage et vente

Color Analyzer for YouTube ne transmet aucune donnée utilisateur à l’éditeur ou à un tiers. Les échanges entre le script de la page, le document hors écran, le Web Worker, le service worker et le panneau latéral restent internes à l’extension sur l’appareil.

L’extension :

- ne vend aucune donnée ;
- ne partage aucune donnée à des fins publicitaires, de profilage ou d’évaluation de solvabilité ;
- n’utilise aucune donnée pour une finalité sans rapport avec l’analyse colorimétrique ;
- n’exécute aucun code hébergé à distance ;
- ne contient aucun système de télémétrie ou d’analyse d’audience.

YouTube et Google peuvent traiter des données indépendamment lorsque l’utilisateur emploie leurs services. Ces traitements relèvent de leurs propres politiques et ne sont pas contrôlés par cette extension.

## 5. Conservation et suppression

- **Pixels vidéo** : mémoire de travail locale ; les tableaux bruts sont libérés après calcul. Le dernier recadrage peut rester dans le canvas uniquement pendant la session active ; à l’arrêt, le canvas est réinitialisé à 1 × 1 pixel et la source vidéo est libérée.
- **Contexte du lecteur** : mémoire temporaire, remplacée continuellement uniquement pendant une session d’analyse active. L’observation ne commence pas avant le consentement et s’arrête immédiatement à la fin de la session.
- **État de session** : l’identifiant de la capture active est retiré à l’arrêt ; le dernier statut peut rester dans le stockage de session Chrome jusqu’à la fin de la session du navigateur.
- **Préférences d’affichage et version du consentement** : stockage local Chrome, conservées jusqu’à leur modification, leur effacement ou la désinstallation.

« Arrêter », la navigation vers une page non prise en charge, la fermeture de l’onglet ou la fin de la capture arrêtent immédiatement la capture, l’analyse des pixels et l’observation du contexte du lecteur. La fermeture du panneau latéral déclenche le même nettoyage après un bref délai technique qui permet de tolérer un rechargement du panneau. Ce nettoyage réinitialise le canvas d’analyse à 1 × 1 pixel et libère la source vidéo. Aucune observation du contexte du lecteur n’a lieu avant consentement ni après la fin de la session d’analyse active. L’utilisateur peut supprimer les préférences enregistrées en effaçant les données de l’extension dans Chrome ou en désinstallant l’extension.

L’éditeur ne possède aucune copie distante de ces informations et ne peut donc ni les consulter ni les supprimer à distance.

## 6. Permissions Chrome

L’extension utilise uniquement les permissions nécessaires à sa finalité :

- **tabCapture** : capturer temporairement le rendu visible de l’onglet sélectionné, sans audio ;
- **offscreen** : recevoir et analyser localement le flux capturé dans un document Chrome hors écran ;
- **sidePanel** : afficher les instruments et leurs réglages dans le panneau latéral ;
- **storage** : conserver les préférences locales, la version du consentement et l’état technique de la session ;
- **accès à `https://www.youtube.com/*`** : uniquement pendant une session d’analyse active, détecter le lecteur YouTube, sa géométrie, son état et la navigation hors de la vidéo sélectionnée. La capture ne démarre que sur une page `/watch` compatible après consentement et une action de l’utilisateur.

## 7. Sécurité

Le traitement est isolé dans les composants locaux de l’extension. La politique de sécurité du contenu autorise uniquement les scripts intégrés au paquet de l’extension. Aucune donnée de capture n’est transmise sur un réseau.

## 8. Conformité à l’utilisation limitée

L’utilisation des informations reçues des API Google respecte la Politique relative aux données utilisateur du Chrome Web Store, y compris les exigences d’utilisation limitée.

## 9. Modifications de cette politique

Cette politique sera mise à jour si les pratiques de traitement des données changent. Toute modification de ces pratiques sera signalée activement et de manière visible dans la fiche Chrome Web Store et dans l’interface de l’extension avant son application. Un nouveau consentement sera demandé avant tout traitement fondé sur les pratiques modifiées.

## 10. Contact

Pour toute question relative à cette politique ou au fonctionnement de l’extension, contactez : **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**.

## 11. Indépendance

Color Analyzer for YouTube est un projet indépendant. Il n’est ni affilié, ni approuvé, ni sponsorisé par Google, YouTube ou Blackmagic Design. YouTube et DaVinci Resolve sont des marques de leurs propriétaires respectifs.
