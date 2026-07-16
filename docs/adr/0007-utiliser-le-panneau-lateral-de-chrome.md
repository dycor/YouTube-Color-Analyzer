# ADR-0007 — Utiliser le panneau latéral de Chrome

- Statut : accepté
- Date : 2026-07-15

## Contexte

L'interface des instruments peut être injectée dans la page YouTube, superposée au lecteur ou hébergée dans une surface native de Chrome. Une interface injectée dépendrait de la structure interne de YouTube et une superposition masquerait une partie de la vidéo analysée.

Les instruments ont besoin d'une surface stable et suffisamment lisible, sans modifier la page ni le rendu de la vidéo.

## Décision

L'extension utilise le panneau latéral natif de Google Chrome comme interface principale.

- Le panneau s'ouvre depuis l'icône de l'extension.
- Il est ouvert au niveau de la fenêtre Chrome afin de rester stable lorsque l'onglet navigue vers une autre vidéo.
- Il ne superpose aucun élément à la vidéo YouTube.
- Il contient les onglets `Parade`, `Waveform` et `Vecteurscope`.
- Un seul instrument est affiché en grand à la fois.
- Le dernier onglet utilisé est mémorisé et restauré à la prochaine ouverture.
- Une déconnexion transitoire de son document dispose d'un délai de reconnexion de trois secondes ; le bouton `Arrêter` interrompt toujours la capture immédiatement.

## Conséquences

- L'interface reste indépendante de la structure DOM et des changements visuels de YouTube.
- La capture de l'onglet peut continuer lors du passage d'une vidéo classique à une autre sans nouvelle autorisation utilisateur.
- L'extension doit demander et configurer la capacité `sidePanel` dans son manifeste Chrome.
- Le rendu de chaque instrument doit s'adapter à la largeur variable du panneau.
- Un instrument non affiché n'a pas besoin d'être rendu en continu ; lors de son ouverture, il est recalculé à partir de l'image de mesure courante.
- La première version ne propose ni fenêtre flottante, ni interface injectée sous le lecteur, ni vue simultanée des trois instruments.
