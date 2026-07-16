# ADR-0016 — Transporter les mesures par la messagerie Chrome

- Statut : accepté
- Date : 2026-07-15

## Contexte

Le document hors écran capture et analyse les pixels tandis que le panneau latéral affiche les instruments. La première implémentation reliait ces deux contextes avec `BroadcastChannel`. En conditions réelles, le panneau restait sur « En attente d’une image » : ce canal ne respectait pas le chemin de communication prévu pour un document hors écran d’extension.

La messagerie Manifest V3 sérialise par ailleurs les messages en JSON. Envoyer directement les tableaux `Uint32Array` de densité produirait donc un message volumineux et dont le type ne serait pas conservé.

## Décision

- Le document hors écran et le panneau latéral communiquent avec `chrome.runtime.sendMessage` et `chrome.runtime.onMessage`.
- Chaque message destiné au panneau porte explicitement `target: "sidepanel"`.
- Les densités brutes restent internes au worker de calcul.
- Avant l’envoi, elles sont normalisées logarithmiquement en intensités `Uint8Array`, puis encodées en Base64 afin de rester compatibles avec la sérialisation JSON de Chrome.
- Le panneau décode et valide la longueur des deux tableaux avant de les afficher.
- Les états de session sont mémorisés dans `chrome.storage.session`, afin que le panneau puisse afficher une erreur ou une suspension même s’il n’était pas encore prêt lors du premier message.

## Conséquences

- Une image de mesure transporte quatre cartes d’intensité YRGB et une carte de vecteurscope, sans exposer les pixels vidéo originaux.
- Le rendu du panneau utilise directement les intensités normalisées et ne recalcule plus le maximum des densités.
- Toute erreur de capture devient visible dans l’interface au lieu de laisser un état d’attente ambigu.
- Un test vérifie l’aller-retour JSON, la reconstruction des tableaux typés et le rejet des messages incomplets.

## Sources

- [Chrome Extensions — Offscreen API](https://developer.chrome.com/docs/extensions/reference/api/offscreen)
- [Chrome Extensions — Message passing](https://developer.chrome.com/docs/extensions/develop/concepts/messaging)
- [Chrome Extensions — Storage and cookies](https://developer.chrome.com/docs/extensions/develop/concepts/storage-and-cookies)
