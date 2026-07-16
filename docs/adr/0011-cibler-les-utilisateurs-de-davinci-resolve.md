# ADR-0011 — Cibler les utilisateurs de DaVinci Resolve

- Statut : accepté
- Date : 2026-07-15

## Contexte

Le produit pourrait être conçu comme un outil pédagogique pour débutants, un assistant donnant des conseils d'étalonnage ou un instrument destiné à des personnes connaissant déjà les scopes. Ces orientations demanderaient des interfaces, des contenus et des critères de qualité très différents.

## Décision

L'utilisateur principal de la première version est un monteur ou coloriste qui :

- utilise déjà DaVinci Resolve ;
- connaît les principes de base des scopes ;
- consulte une vidéo YouTube comme référence colorimétrique ;
- veut ensuite reproduire un rendu similaire sur son propre projet.

La première version fournit des instruments et des mesures. Elle ne propose pas de correction automatique, de recommandation colorimétrique ou de parcours d'apprentissage.

Des infobulles courtes peuvent expliquer le rôle d'une commande, mais elles ne doivent pas interpréter les traces à la place de l'utilisateur.

## Conséquences

- L'interface peut employer le vocabulaire professionnel défini dans le contexte du domaine.
- Les critères d'acceptation privilégient la cohérence des mesures et la lisibilité des traces.
- Les fonctionnalités éducatives, les diagnostics automatiques et les recettes d'étalonnage sont hors périmètre de la première version.

