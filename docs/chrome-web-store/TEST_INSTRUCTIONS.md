# Instructions de test pour l’examen Chrome Web Store

## Texte anglais à copier dans le Dashboard

> Requirements: Google Chrome 116 or later. No account, payment, subscription, credentials, or external server is required.
>
> 1. Open a public video on a standard `https://www.youtube.com/watch?...` page in normal or theater mode.
> 2. Make sure the complete video image is visible within the browser window.
> 3. Click the extension icon. On first use, review the local data-processing disclosure and select “Accept and start analysis.”
> 4. Move the pointer away from the video so the YouTube controls become hidden.
> 5. Confirm that the YRGB Parade appears in Chrome's side panel. Select “Open in window” and confirm that a detached analysis window shows the same active session.
> 6. Select RGB mode, then return to YRGB mode.
> 7. Select Waveform, enable or disable the Y, R, G, and B channels, test the colorized display, and adjust Trace intensity. Confirm that both interfaces keep the same settings.
> 8. Select Vectorscope and enable or disable the skin tone line.
> 9. Play the video. The scopes should update and the panel should show live analysis.
> 10. Pause the video. The interfaces should show a detailed frame using up to 1920 horizontal columns, display RGB minimum/maximum values, and remain fixed until playback resumes or the position changes.
> 11. Select “Export frame.” Confirm that Chrome downloads a PNG of the exact detailed paused frame. Resume playback and confirm that export is no longer available. No file should be created without this explicit action.
> 12. Enable captions. A warning should appear because visible captions are included in the measured pixels.
> 13. Enter fullscreen, the YouTube miniplayer, or Picture-in-Picture. Analysis should be suspended with an explanatory status.
> 14. Return to normal or theater mode. Analysis should resume when the video is fully visible and controls are hidden.
> 15. Close only the side panel. The detached window should remain connected and the capture should continue. Reopen the side panel if desired.
> 16. Select “Stop” from either interface. Both interfaces should show that the global capture session has ended. Alternatively, closing the last interface should end capture after the short reload grace period.
>
> The extension captures no audio and makes no request to a server operated by the publisher. All scope calculations occur locally in the browser.

## Version française de référence

Prérequis : Google Chrome 116 ou version ultérieure. Aucun compte, paiement, abonnement, identifiant ou serveur externe n’est requis.

1. Ouvrir une vidéo publique sur une page standard `https://www.youtube.com/watch?...` en mode normal ou cinéma.
2. Vérifier que l’image vidéo entière est visible dans la fenêtre.
3. Cliquer sur l’icône de l’extension. Lors de la première utilisation, lire la divulgation puis choisir « Accepter et démarrer l’analyse ».
4. Éloigner le pointeur afin de masquer les commandes YouTube.
5. Vérifier que la Parade YRGB apparaît dans le panneau latéral de Chrome. Choisir « Ouvrir dans une fenêtre » et vérifier que la fenêtre d’analyse détachable affiche la même session active.
6. Sélectionner RGB, puis revenir à YRGB.
7. Sélectionner Waveform, activer ou désactiver Y, R, G et B, tester l’affichage colorisé et régler l’intensité de trace. Vérifier que les deux interfaces conservent les mêmes réglages.
8. Sélectionner Vecteurscope et activer ou désactiver la ligne des tons chair.
9. Lire la vidéo : les instruments doivent s’actualiser et le panneau doit indiquer une analyse en direct.
10. Mettre la vidéo en pause : les interfaces doivent afficher une image détaillée utilisant jusqu’à 1920 colonnes horizontales, les minimums/maximums RGB et des instruments figés jusqu’à la reprise ou au déplacement de la position.
11. Choisir « Exporter l’image » : vérifier que Chrome télécharge un PNG de l’image détaillée exacte en pause. Reprendre la lecture et vérifier que l’export n’est plus disponible. Aucun fichier ne doit être créé sans cette action explicite.
12. Activer les sous-titres : un avertissement doit apparaître, car les sous-titres visibles sont inclus dans les pixels mesurés.
13. Passer en plein écran, mini-lecteur ou Picture-in-Picture : l’analyse doit être suspendue avec un statut explicatif.
14. Revenir en mode normal ou cinéma : l’analyse doit reprendre lorsque la vidéo est entièrement visible et les commandes masquées.
15. Fermer uniquement le panneau latéral : la fenêtre détachable doit rester connectée et la capture continuer. Rouvrir le panneau si souhaité.
16. Choisir « Arrêter » depuis l’une des interfaces : les deux doivent indiquer la fin de la session globale. À défaut, fermer la dernière interface doit arrêter la capture après le bref délai de rechargement.

L’extension ne capture pas l’audio et ne contacte aucun serveur exploité par l’éditeur. Tous les calculs sont réalisés localement dans le navigateur.

## Avant de transmettre ces instructions

- remplacer le texte du consentement si le libellé final diffère ;
- tester chaque étape sur la version exacte du ZIP soumis ;
- fournir une URL de vidéo publique stable si l’examinateur le demande ;
- ne jamais fournir de contenu protégé ou de compte personnel comme donnée de test.
