# ADR-0017 — Conserver la session entre deux vidéos

- Statut : accepté
- Date : 2026-07-15

## Contexte

La capture d’un onglet Chrome est maintenue par le navigateur lors des navigations dans ce même onglet. Pourtant, lors du passage d’une vidéo YouTube à une autre, l’extension arrêtait parfois sa propre capture et le panneau revenait à « En attente ».

Le panneau avait été ouvert avec un contexte lié à l’onglet. Sa connexion au service worker pouvait alors être brièvement interrompue pendant une navigation. Un délai de seulement 250 ms interprétait cette interruption transitoire comme une fermeture volontaire et fermait le flux avant que le panneau puisse se reconnecter.

## Décision

- Le panneau est ouvert avec le `windowId` de la fenêtre Chrome, et non avec le `tabId` capturé.
- La capture reste liée au `tabId` choisi par l’utilisateur.
- Une déconnexion du port du panneau déclenche un délai de grâce de trois secondes.
- Si une nouvelle instance du panneau se connecte pendant ce délai, l’arrêt est annulé.
- Si aucun panneau ne se reconnecte, la capture est arrêtée comme auparavant.
- Le bouton `Arrêter`, la fermeture de l’onglet et la navigation hors d’une page YouTube prise en charge arrêtent immédiatement la session.

## Conséquences

- Le passage d’une page `youtube.com/watch` à une autre conserve les scopes sans nouveau clic.
- Le panneau peut rester visible lorsque l’utilisateur change temporairement d’onglet ; l’analyse de la source capturée est alors suspendue par la détection de visibilité.
- Fermer le panneau peut laisser la capture active pendant trois secondes au maximum, uniquement pour distinguer une vraie fermeture d’un rechargement transitoire.

## Sources

- [Chrome Extensions — Side Panel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
- [Chrome Extensions — Tab Capture API](https://developer.chrome.com/docs/extensions/reference/api/tabCapture)
