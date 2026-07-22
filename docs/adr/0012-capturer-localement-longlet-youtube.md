# ADR-0012 — Capturer localement l'onglet YouTube

- Statut : accepté
- Date : 2026-07-15
- Dernière mise à jour : 2026-07-22

## Contexte

Les fichiers et flux vidéo YouTube ne constituent pas une source que l'extension peut supposer lisible directement pixel par pixel. Google Chrome fournit en revanche `chrome.tabCapture`, qui expose un flux de la zone visible de l'onglet après une action explicite de l'utilisateur.

Depuis Chrome 116, un identifiant de flux obtenu par le service worker peut être consommé par un document hors écran. Cette architecture permet de maintenir le traitement séparé du panneau latéral.

## Décision

La première version requiert Google Chrome 116 ou une version ultérieure et utilise le pipeline suivant :

1. le clic sur l'icône de l'extension ouvre le panneau ; lors de la première utilisation, une divulgation décrit précisément les données traitées et la session ne démarre qu'après consentement explicite ;
2. le service worker obtient un flux vidéo de l'onglet avec `chrome.tabCapture`, sans demander ni capturer l'audio ;
3. un script de contenu communique la position et les dimensions visibles du lecteur YouTube ;
4. un document hors écran recadre le flux sur cette zone et échantillonne les images de mesure au maximum à 15 Hz ;
5. le document calcule les données des instruments localement ;
6. seules les données de scopes sont transmises au panneau latéral pour affichage.

Avant ce consentement, le script de contenu n'observe ni l'adresse, ni le lecteur, ni la géométrie de la page. Les images brutes ne sont jamais enregistrées, exportées, envoyées vers un serveur ou transmises au panneau latéral.

La session et ses pistes de capture sont arrêtées lorsque le panneau ferme, lorsque l'utilisateur quitte YouTube ou lorsque l'onglet capturé est fermé.

Les commandes YouTube et les sous-titres appartiennent au rendu visible capturé. Pour éviter qu'ils contaminent les mesures :

- l'analyse est suspendue lorsque les commandes sont visibles ;
- un avertissement est affiché lorsque des sous-titres sont actifs ;
- l'extension ne masque ni ne modifie automatiquement ces éléments.

## Conséquences

- Le manifeste doit demander uniquement `tabCapture`, `offscreen`, `sidePanel` et `storage`, ainsi qu'un accès hôte limité à YouTube. `activeTab` n'est pas requis par cette architecture.
- Le recadrage doit convertir correctement les coordonnées CSS du lecteur vers les dimensions réelles du flux capturé, y compris après redimensionnement ou passage en mode cinéma.
- Le panneau ne doit recevoir que des tableaux de densité, des réglages et des états de session.
- Une déconnexion du panneau ou une navigation doit libérer le flux et les ressources de calcul ; le canvas est ramené à une surface de 1 × 1 à l'arrêt pour effacer le dernier recadrage.
- Les superpositions intégrées directement à l'image par l'auteur de la vidéo restent naturellement incluses dans les mesures.

## Sources

- [Chrome Extensions — `chrome.tabCapture`](https://developer.chrome.com/docs/extensions/reference/api/tabCapture)
- [Chrome Extensions — Audio recording and screen capture](https://developer.chrome.com/docs/extensions/how-to/web-platform/screen-capture)
- [Chrome Extensions — `chrome.sidePanel`](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
