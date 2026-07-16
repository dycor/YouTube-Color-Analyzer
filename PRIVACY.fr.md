# Politique de confidentialité — YouTube Color Analyzer

**Français** | [English](./PRIVACY.md) | [中文](./PRIVACY.zh-CN.md) | [Español](./PRIVACY.es.md) | [Português](./PRIVACY.pt-BR.md)

Date d’entrée en vigueur : 17 juillet 2026  
Dernière mise à jour : 17 juillet 2026

Éditeur : **[NOM DE L’ÉDITEUR À COMPLÉTER]**  
Contact confidentialité : **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**

## 1. Objet de l’extension

YouTube Color Analyzer est une extension Chrome qui génère localement une Parade, un Waveform et un Vecteurscope à partir de l’image visible d’une vidéo YouTube. Elle sert uniquement à observer et analyser la colorimétrie ; elle ne modifie ni la vidéo, ni son fichier source, ni son rendu.

## 2. Résumé

- l’analyse commence uniquement après une action explicite de l’utilisateur sur l’icône de l’extension ;
- les pixels visibles de la vidéo sont traités localement sur l’appareil ;
- l’audio n’est pas capturé ;
- aucune image de la vidéo n’est enregistrée sur le disque ou envoyée à l’éditeur ;
- l’extension ne comporte ni compte utilisateur, ni publicité, ni outil d’analyse d’audience, ni serveur applicatif ;
- l’éditeur ne vend, ne partage et ne reçoit aucune donnée issue de l’analyse.

## 3. Données traitées

### 3.1 Pixels visibles de la vidéo

Pendant une session d’analyse active, l’extension capture temporairement le rendu visuel de l’ensemble de l’onglet YouTube sélectionné. Elle recadre ensuite la zone visible de la vidéo et lit uniquement les valeurs de pixels de cette zone afin de calculer les trois instruments colorimétriques.

Le rendu capturé peut inclure les éléments visibles superposés à la vidéo, notamment des sous-titres ou des commandes du lecteur. L’extension signale certains de ces cas, car ils peuvent influencer la mesure.

Les tableaux de pixels bruts sont conservés en mémoire de travail le temps nécessaire au calcul, puis leurs références sont libérées. Le canvas local peut conserver la dernière image recadrée en mémoire jusqu’à son remplacement par une autre image ou la destruction du document hors écran. Aucune image n’est écrite dans un stockage persistant, ajoutée à un historique ou transmise sur Internet.

### 3.2 Contexte de la page et état du lecteur

Un script local de l’extension est présent sur les pages `youtube.com`. Il observe périodiquement le contexte de la page et l’état du lecteur, y compris lorsqu’aucune capture n’est active. En l’absence de session d’analyse, ces messages sont ignorés et ne sont pas enregistrés. Pour localiser correctement la vidéo, gérer les navigations internes de YouTube et synchroniser les mesures, l’extension traite temporairement :

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

YouTube Color Analyzer ne transmet aucune donnée utilisateur à l’éditeur ou à un tiers. Les échanges entre le script de la page, le document hors écran, le Web Worker, le service worker et le panneau latéral restent internes à l’extension sur l’appareil.

L’extension :

- ne vend aucune donnée ;
- ne partage aucune donnée à des fins publicitaires, de profilage ou d’évaluation de solvabilité ;
- n’utilise aucune donnée pour une finalité sans rapport avec l’analyse colorimétrique ;
- n’exécute aucun code hébergé à distance ;
- ne contient aucun système de télémétrie ou d’analyse d’audience.

YouTube et Google peuvent traiter des données indépendamment lorsque l’utilisateur emploie leurs services. Ces traitements relèvent de leurs propres politiques et ne sont pas contrôlés par cette extension.

## 5. Conservation et suppression

- **Pixels vidéo** : mémoire de travail locale ; les tableaux bruts sont libérés après calcul, tandis que le dernier recadrage peut rester dans le canvas jusqu’à son remplacement ou la destruction du document hors écran.
- **Contexte du lecteur** : mémoire temporaire, remplacée continuellement. L’observation locale continue tant que la page YouTube reste chargée, mais les messages sont ignorés et non enregistrés lorsqu’aucune analyse n’est active.
- **État de session** : l’identifiant de la capture active est retiré à l’arrêt ; le dernier statut peut rester dans le stockage de session Chrome jusqu’à la fin de la session du navigateur.
- **Préférences d’affichage et version du consentement** : stockage local Chrome, conservées jusqu’à leur modification, leur effacement ou la désinstallation.

L’utilisateur peut interrompre la capture et l’analyse des pixels avec le bouton « Arrêter », en fermant le panneau, en quittant la vidéo ou en fermant l’onglet. La fermeture du panneau applique un bref délai technique afin de tolérer son rechargement. Sur une page YouTube toujours chargée, l’observation locale du contexte du lecteur peut continuer, mais ses messages sont ignorés tant qu’aucune analyse n’est active. L’utilisateur peut supprimer les préférences enregistrées en effaçant les données de l’extension dans Chrome ou en désinstallant l’extension.

L’éditeur ne possède aucune copie distante de ces informations et ne peut donc ni les consulter ni les supprimer à distance.

## 6. Permissions Chrome

L’extension utilise uniquement les permissions nécessaires à sa finalité :

- **activeTab** : vérifier, après l’action de l’utilisateur, que l’onglet actif est une vidéo YouTube compatible ;
- **tabCapture** : capturer temporairement le rendu visible de l’onglet sélectionné, sans audio ;
- **offscreen** : recevoir et analyser localement le flux capturé dans un document Chrome hors écran ;
- **sidePanel** : afficher les instruments et leurs réglages dans le panneau latéral ;
- **storage** : conserver les préférences locales, la version du consentement et l’état technique de la session ;
- **accès à `https://www.youtube.com/*`** : détecter le lecteur, sa géométrie et son état sur YouTube. La capture elle-même ne démarre que sur une page `/watch` compatible après l’action de l’utilisateur.

## 7. Sécurité

Le traitement est isolé dans les composants locaux de l’extension. La politique de sécurité du contenu autorise uniquement les scripts intégrés au paquet de l’extension. Aucune donnée de capture n’est transmise sur un réseau.

## 8. Conformité à l’utilisation limitée

L’utilisation des informations reçues des API Google respecte la Politique relative aux données utilisateur du Chrome Web Store, y compris les exigences d’utilisation limitée.

## 9. Modifications de cette politique

Cette politique sera mise à jour si les pratiques de traitement des données changent. Toute modification de ces pratiques sera signalée activement et de manière visible dans la fiche Chrome Web Store et dans l’interface de l’extension avant son application. Un nouveau consentement sera demandé avant tout traitement fondé sur les pratiques modifiées.

## 10. Contact

Pour toute question relative à cette politique ou au fonctionnement de l’extension, contactez : **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**.

## 11. Indépendance

YouTube Color Analyzer est un projet indépendant. Il n’est ni affilié, ni approuvé, ni sponsorisé par Google, YouTube ou Blackmagic Design. YouTube et DaVinci Resolve sont des marques de leurs propriétaires respectifs.
