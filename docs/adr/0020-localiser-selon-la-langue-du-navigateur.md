# ADR-0020 — Localiser selon la langue du navigateur

- Statut : accepté
- Date : 2026-07-16

## Contexte

Le panneau, les états de capture et les métadonnées de l'extension étaient initialement écrits uniquement en français. L'extension doit suivre automatiquement la langue d'interface du navigateur sans ajouter de réglage de langue au panneau.

## Décision

L'extension prend en charge cinq langues :

- anglais (`en`) ;
- français (`fr`) ;
- chinois (`zh`) ;
- espagnol (`es`) ;
- portugais (`pt`).

La langue est déterminée avec `chrome.i18n.getUILanguage()`. Les variantes régionales sont ramenées à leur langue principale : par exemple `es-MX` utilise l'espagnol, `pt-BR` et `pt-PT` utilisent le portugais, et `zh-CN` ou `zh-TW` utilisent le chinois.

Toute langue non prise en charge utilise explicitement l'anglais. La même règle est appliquée lorsque la langue du navigateur est absente ou illisible.

Les textes du panneau sont regroupés dans un catalogue TypeScript dont les clés sont vérifiées au typage. Les variables techniques, telles que les dimensions de l'image, sont interpolées après sélection de la traduction. Les nombres utilisent le format régional correspondant à la langue active.

Le manifeste Chrome utilise également son système `_locales`, avec l'anglais comme `default_locale`. Des métadonnées sont fournies pour `en`, `fr`, `es`, `zh_CN`, `zh_TW`, `pt_BR` et `pt_PT`, afin de couvrir les variantes reconnues par Chrome tout en conservant cinq langues produit.

## Conséquences

- Le panneau, les états, les avertissements, les libellés Canvas et les erreurs contrôlées sont traduits automatiquement.
- Le nom, la description et l'infobulle d'action de l'extension suivent aussi la langue de Chrome.
- Aucun sélecteur de langue ni préférence supplémentaire n'est nécessaire.
- L'anglais reste toujours disponible comme catalogue complet et comme langue de repli.
- L'ajout d'une langue exige un catalogue complet et des tests de résolution de locale.
