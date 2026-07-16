# ADR-0010 — Définir le vecteurscope Rec.709 de la première version

- Statut : accepté
- Date : 2026-07-15

## Contexte

Le vecteurscope doit permettre d'interpréter la teinte et la saturation de la référence YouTube avec des conventions familières aux utilisateurs de DaVinci Resolve. La première version analyse toutefois les pixels SDR rendus par Chrome et ne prétend pas mesurer directement le signal vidéo source.

DaVinci Resolve propose notamment un graticule de teintes, un indicateur facultatif des tons chair et un zoom `2×`. Sa documentation précise que le zoom `2×` ne conserve pas une représentation exacte des valeurs de saturation.

## Décision

Le vecteurscope de la première version utilise une projection `Rec.709` dérivée des valeurs RGB de l'image de mesure SDR.

- L'angle autour du centre représente la teinte.
- Le centre représente une saturation nulle.
- Le bord extérieur représente une saturation normalisée de `100 %`.
- La trace est colorisée selon la teinte analysée.
- Le graticule affiche les cibles rouge (`R`), magenta (`Mg`), bleu (`B`), cyan (`Cy`), vert (`G`) et jaune (`Y`).
- Une ligne indicative des tons chair est affichée par défaut et peut être masquée.
- Le zoom `2×` n'est pas proposé dans la première version.

## Conséquences

- La conversion des pixels RGB vers la projection du vecteurscope doit être explicitement testée avec des aplats de couleur Rec.709 connus.
- La densité de la trace doit refléter le nombre de pixels projetés dans chaque zone sans saturer immédiatement l'affichage.
- La ligne des tons chair doit être présentée comme une indication, pas comme une règle imposant une teinte unique à toutes les peaux.
- L'absence de zoom préserve la relation directe entre le rayon et la saturation normalisée.

## Sources

- [DaVinci Resolve — Color, Professional Scopes](https://www.blackmagicdesign.com/products/davinciresolve/color)
- [The Colorist Guide to DaVinci Resolve 20](https://documents.blackmagicdesign.com/UserManuals/DaVinci-Resolve-20-Colorist-Guide.pdf)

