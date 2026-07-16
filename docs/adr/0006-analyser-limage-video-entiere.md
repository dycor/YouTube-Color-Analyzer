# ADR-0006 — Analyser l'image vidéo entière

- Statut : accepté
- Date : 2026-07-15

## Contexte

Les instruments pourraient analyser toute l'image vidéo ou seulement une région sélectionnée par l'utilisateur. La sélection d'une région demanderait des outils de tracé, de manipulation et de visualisation supplémentaires, ainsi qu'une gestion précise des transformations du lecteur YouTube.

## Décision

Dans la première version, la parade, le Waveform et le vecteurscope analysent toujours l'intégralité de l'image vidéo courante.

La sélection, le masquage et l'isolation d'une région de l'image ne sont pas proposés.

## Conséquences

- Les trois instruments reçoivent tous les pixels de chaque image de mesure.
- Aucun outil de sélection ne doit être superposé au lecteur YouTube.
- Les calculs et les critères d'acceptation n'ont pas à gérer de masque ou de région d'intérêt.
- Une future analyse régionale devra faire l'objet d'une nouvelle décision de produit et d'architecture.

