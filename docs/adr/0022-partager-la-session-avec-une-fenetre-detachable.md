# ADR-0022 — Partager la session avec une fenêtre détachable

- Statut : accepté
- Date : 2026-07-31

## Contexte

Le panneau latéral reste la surface la plus directe pour lancer l’analyse sans recouvrir YouTube, mais sa largeur limite la lecture d’un Waveform détaillé. Une fenêtre séparée peut offrir davantage d’espace sans améliorer à elle seule la fidélité de la capture. Créer une seconde capture pour cette fenêtre gaspillerait des ressources et risquerait de désynchroniser les instruments.

L’utilisateur doit également pouvoir ajuster la lisibilité de la trace et conserver ponctuellement l’image exacte à l’origine d’une mesure, tout en maintenant la promesse de traitement local et d’absence de sauvegarde automatique.

## Décision

- Le panneau latéral reste l’interface par défaut et propose l’ouverture de `scope-window.html` dans une fenêtre détachable.
- Le panneau et la fenêtre utilisent la même session, le même flux capturé et les mêmes images de scope. Les préférences d’affichage sont synchronisées par le stockage local de Chrome.
- La session reste active tant qu’au moins une interface est connectée. La fermeture de la dernière interface déclenche le délai de grâce de trois secondes ; `Arrêter` met immédiatement fin à la session pour toutes les interfaces.
- Le direct conserve jusqu’à 512 colonnes horizontales. Une image détaillée en pause conserve jusqu’à 1920 colonnes, sans dépasser la largeur analysée.
- L’intensité de trace est un réglage de rendu uniquement. Les minimums et maximums RGB de l’image courante sont affichés comme diagnostic de la source.
- L’export PNG est disponible uniquement pour la mesure détaillée courante lorsque la vidéo est en pause. Il produit l’image exacte déjà analysée, sans nouvelle capture.
- L’export résulte toujours d’une action explicite. Aucun fichier n’est créé automatiquement, aucun historique n’est conservé et aucune image n’est envoyée sur Internet.
- La divulgation relative aux données passe à la version 2 afin que les utilisateurs existants acceptent le texte décrivant cet export local optionnel.

## Conséquences

- Une grande fenêtre améliore la lisibilité et l’espace horizontal sans modifier les pixels capturés ni la colorimétrie calculée.
- Une seule capture alimente toutes les interfaces et évite les écarts de session.
- Fermer une interface n’interrompt pas le travail réalisé dans l’autre ; le bouton `Arrêter` garde un comportement global et prévisible.
- L’image détaillée exacte doit rester temporairement disponible dans le document hors écran jusqu’à son remplacement ou l’arrêt, uniquement pour permettre l’export demandé.
- Le PNG téléchargé est ensuite géré par Chrome et l’utilisateur ; l’extension ne peut pas supprimer les fichiers déjà exportés.
- Aucun nouveau serveur, appel réseau ou stockage automatique n’est introduit.

## Sources

- [Chrome Extensions — Windows API](https://developer.chrome.com/docs/extensions/reference/api/windows)
- [Chrome Extensions — Side Panel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
- [Chrome Extensions — Offscreen API](https://developer.chrome.com/docs/extensions/reference/api/offscreen)
