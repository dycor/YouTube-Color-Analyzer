# ADR-0018 — Adopter une interface HUD neutre

- Statut : accepté
- Date : 2026-07-15

## Contexte

L’interface fonctionnelle initiale utilisait une succession de panneaux standards. Elle ne reflétait ni le caractère technique des scopes ni la direction visuelle souhaitée, inspirée d’un poste de contrôle cinématique avec navigation flottante, verre fumé et télémétrie discrète.

Une reproduction littérale de cette référence introduirait cependant de fortes dominantes bleues et orange autour des instruments. Pour un outil d’analyse colorimétrique, ces couleurs périphériques pourraient influencer la perception visuelle des traces.

## Décision

- L’interface adopte un langage visuel de HUD cinématique : fond profond, panneaux translucides, bordures fines, navigation en capsules et télémétrie monospace.
- La zone du scope reste presque noire et chromatiquement neutre.
- Les accents cyan sont désaturés et réservés aux états actifs et aux éléments de navigation.
- L’orange est réservé aux avertissements et erreurs.
- Les couleurs saturées restent principalement celles des traces et des canaux `R`, `G` et `B`.
- En lecture et en pause, la carte d’état se réduit pour ne pas masquer le scope. Elle reprend un format détaillé lorsqu’une intervention de l’utilisateur est nécessaire.
- Les commandes propres à l’instrument actif sont regroupées dans un panneau inférieur nommé `Control deck`.
- La mise en page reste utilisable à partir de 300 px de large et respecte `prefers-reduced-motion`.
- Aucun asset, police ou script distant n’est chargé.

## Conséquences

- Le scope occupe la majorité de la hauteur disponible et les réglages restent accessibles sans changer de page.
- Le panneau expose la source, le nombre d’échantillons et le temps de calcul sous forme de télémétrie.
- Les trois instruments conservent les mêmes contrats de données et le moteur d’analyse n’est pas modifié par la refonte.
- Une page locale `preview.html` fournit des données synthétiques pour vérifier l’interface sans démarrer une capture YouTube.
