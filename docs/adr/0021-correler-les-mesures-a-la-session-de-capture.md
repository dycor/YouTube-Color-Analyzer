# ADR-0021 — Corréler les mesures à la session de capture

- Statut : accepté
- Date : 2026-07-16

## Contexte

Le calcul d’une image est asynchrone. Un résultat déjà envoyé au Web Worker peut donc revenir après un arrêt ou le démarrage d’une nouvelle capture. Le panneau peut également être recréé pendant une navigation interne de YouTube ou pendant que la vidéo est en pause ; dans ce cas, l’état de session est restauré mais aucune nouvelle image n’est nécessairement calculée.

Sans corrélation explicite, une mesure de l’ancienne vidéo pourrait réapparaître après l’arrêt. Sans remise à disposition de la dernière mesure, un panneau reconnecté pourrait rester vide jusqu’à la reprise de la lecture.

## Décision

- Chaque capture reçoit un identifiant de session aléatoire créé par le service worker et mémorisé avec l’identifiant de l’onglet.
- Un second clic pendant l’initialisation ne lance pas une capture concurrente ; il se contente de maintenir le panneau ouvert.
- Cet identifiant accompagne le démarrage, l’arrêt, les requêtes au Worker, les résultats calculés, les états de session et les images de scope.
- Le document hors écran n’accepte qu’un seul calcul en vol et ignore tout résultat qui ne correspond pas simultanément à la session et à l’image attendues.
- L’arrêt d’une capture invalide immédiatement le calcul en vol et termine le Worker. Une réponse déjà mise en file ne peut donc plus réactiver l’interface.
- Le panneau efface sa mesure lorsque l’identifiant de session change et refuse les images provenant d’une autre session.
- Le document hors écran conserve uniquement la dernière image de scope encodée de la session active. Lorsque le panneau signale qu’il est prêt, cette mesure lui est renvoyée ; aucune image RGBA n’est conservée.
- Une fin inattendue de piste libère la capture active. Une erreur transitoire du Worker ou de Canvas libère le verrou de calcul afin que l’analyse puisse réessayer.
- Les états produits hors écran transitent par le service worker, qui rejette ceux d’une ancienne session avant de les mémoriser et de les relayer au panneau.

## Conséquences

- Une mesure ne peut plus être publiée après l’arrêt ni contaminer la capture suivante.
- Recharger ou reconnecter le panneau en pause restaure le dernier scope sans relire ni enregistrer les pixels de la vidéo.
- La dernière mesure encodée reste en mémoire uniquement pendant la session active et disparaît à son arrêt.
- Les messages de session deviennent légèrement plus verbeux, mais permettent des tests déterministes des arrêts, remplacements et reconnexions.
