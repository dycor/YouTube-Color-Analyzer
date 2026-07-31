# ADR-0017 — Conserver la session entre deux vidéos

- Statut : accepté
- Date : 2026-07-15
- Dernière mise à jour : 2026-07-31

## Contexte

La capture d’un onglet Chrome est maintenue par le navigateur lors des navigations dans ce même onglet. Pourtant, lors du passage d’une vidéo YouTube à une autre, l’extension arrêtait parfois sa propre capture et le panneau revenait à « En attente ».

Le panneau avait été ouvert avec un contexte lié à l’onglet. Sa connexion au service worker pouvait alors être brièvement interrompue pendant une navigation. Un délai de seulement 250 ms interprétait cette interruption transitoire comme une fermeture volontaire et fermait le flux avant que le panneau puisse se reconnecter.

## Décision

- Le panneau est ouvert avec le `windowId` de la fenêtre Chrome, et non avec le `tabId` capturé.
- La capture reste liée au `tabId` choisi par l’utilisateur.
- Le panneau latéral et la fenêtre d’analyse détachable utilisent des ports distincts, mais possèdent collectivement la session de capture.
- Une déconnexion du dernier port d’interface déclenche un délai de grâce de trois secondes.
- Si une interface se connecte pendant ce délai, l’arrêt est annulé.
- Si aucune interface ne se reconnecte, la capture est arrêtée comme auparavant.
- Le bouton `Arrêter`, depuis n’importe quelle interface, la fermeture de l’onglet et la navigation hors d’une page YouTube prise en charge arrêtent immédiatement la session globale.

## Conséquences

- Le passage d’une page `youtube.com/watch` à une autre conserve les scopes sans nouveau clic.
- Le panneau peut rester visible lorsque l’utilisateur change temporairement d’onglet ; l’analyse de la source capturée est alors suspendue par la détection de visibilité.
- Fermer le panneau latéral ne coupe pas la capture si la fenêtre détachable reste ouverte, et réciproquement.
- Fermer la dernière interface peut laisser la capture active pendant trois secondes au maximum, uniquement pour distinguer une vraie fermeture d’un rechargement transitoire.

## Sources

- [Chrome Extensions — Side Panel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
- [Chrome Extensions — Tab Capture API](https://developer.chrome.com/docs/extensions/reference/api/tabCapture)
