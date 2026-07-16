# Checklist de publication Chrome Web Store

Date de préparation : 17 juillet 2026.

## 1. Blocages à résoudre dans le produit

- [ ] Implémenter la divulgation et le consentement de [`DATA_DISCLOSURE.md`](./DATA_DISCLOSURE.md) avant toute observation de l’état YouTube et toute capture.
- [ ] Empêcher le content script de publier ses snapshots avant consentement.
- [ ] Enregistrer uniquement la version du consentement nécessaire, localement dans Chrome.
- [ ] Ajouter dans le panneau un lien permanent vers la politique de confidentialité.
- [ ] Effacer ou redimensionner le canvas d’analyse à l’arrêt afin que le dernier recadrage ne reste pas inutilement en mémoire.
- [ ] Réauditer `activeTab` et retirer cette permission si l’extension fonctionne sans elle.
- [ ] Aligner la version affichée dans le panneau (`V0.1` actuellement) avec le manifeste (`1.0.0`).
- [ ] Vérifier que la fermeture du panneau, le bouton Arrêter, la navigation et la fermeture de l’onglet arrêtent la capture.

## 2. Informations de l’éditeur

- [ ] Choisir le compte Google éditeur définitif et activer la validation en deux étapes.
- [ ] Régler les frais uniques du compte développeur.
- [ ] Vérifier l’adresse e-mail du compte développeur.
- [ ] Renseigner le nom de l’éditeur.
- [ ] Déclarer correctement le statut trader ou non-trader.
- [ ] Remplacer tous les marqueurs de remplacement dans les cinq langues.

Commande de contrôle :

```bash
rg -n "À COMPLÉTER|TO COMPLETE|待填写|PENDIENTE|A PREENCHER|À traduire" . -g '!node_modules' -g '!dist'
```

## 3. Pages publiques

- [ ] Héberger la politique de confidentialité sur une URL HTTPS accessible sans connexion.
- [ ] Héberger la page d’assistance ou configurer le Support Hub du Chrome Web Store.
- [ ] Vérifier les liens entre toutes les versions linguistiques.
- [ ] Maintenir ces pages disponibles aussi longtemps que l’extension est publiée.

## 4. Fiche Store

- [ ] Saisir la fiche anglaise principale depuis [`STORE_LISTING.en.md`](./STORE_LISTING.en.md).
- [ ] Ajouter les localisations française, chinoise, espagnole et portugaise.
- [ ] Placer la divulgation relative aux données près du début de chaque description.
- [ ] Choisir la catégorie Productivité ou son équivalent actuel.
- [ ] Ajouter l’URL d’accueil, l’URL d’assistance et l’URL de confidentialité.
- [ ] Ajouter une mention d’indépendance vis-à-vis de Google, YouTube et Blackmagic Design.
- [ ] Déclarer l’extension gratuite et sans achat intégré dans les champs correspondants.
- [ ] Vérifier et renseigner correctement le classement de contenu mature si le Dashboard affiche ce champ.

## 5. Visuels

- [x] Icône d’extension 128 × 128 incluse dans le paquet.
- [ ] Au moins une capture d’écran 1280 × 800 ou 640 × 400, sans marge.
- [ ] Idéalement cinq captures montrant Parade, Waveform, Vecteurscope, image en pause et traitement local.
- [ ] Vignette promotionnelle 440 × 280.
- [ ] Bannière 1400 × 560 si une promotion étendue est souhaitée.
- [ ] Vérifier que les visuels montrent l’interface réelle et n’imitent pas une affiliation officielle.

## 6. Privacy practices

- [ ] Copier la finalité unique depuis [`PRIVACY_PRACTICES.md`](./PRIVACY_PRACTICES.md).
- [ ] Justifier séparément chaque permission encore présente dans le manifeste final.
- [ ] Déclarer l’absence de code distant.
- [ ] Déclarer Website content.
- [ ] Déclarer Web history / browsing activity pour l’adresse YouTube et l’identifiant vidéo traités.
- [ ] Déclarer User activity si cette catégorie couvre l’état et la position du lecteur dans le formulaire actuel.
- [ ] Ne pas déclarer de catégories que le code ne traite pas.
- [ ] Certifier la conformité Limited Use seulement après avoir vérifié toutes les affirmations.
- [ ] Saisir l’URL publique de la politique de confidentialité.

## 7. Tests

- [ ] Exécuter `pnpm verify`.
- [ ] Exécuter `pnpm test:e2e`.
- [ ] Charger le paquet final dans un profil Chrome propre.
- [ ] Tester une première installation sans consentement déjà enregistré.
- [ ] Tester les cinq langues du navigateur.
- [ ] Tester lecture, pause, navigation YouTube SPA et arrêt de capture.
- [ ] Suivre intégralement [`TEST_INSTRUCTIONS.md`](./TEST_INSTRUCTIONS.md) sur le build final.
- [ ] Vérifier l’absence d’erreur sur `chrome://extensions`.

## 8. Paquet de soumission

- [ ] Construire un `dist/` propre.
- [ ] Exclure les source maps si elles ne sont pas volontairement distribuées.
- [ ] Exclure `icons/logo-master.png`, inutile à l’exécution.
- [ ] Vérifier que `manifest.json` est à la racine du ZIP.
- [ ] Vérifier que la version du manifeste est supérieure à toute version déjà importée.
- [ ] Conserver une copie exacte du ZIP soumis.

Exemple :

```bash
pnpm verify
cd dist
zip -r ../youtube-color-analyzer-1.0.0.zip .
```

## 9. Soumission

- [ ] Importer le ZIP dans le Chrome Web Store Developer Dashboard.
- [ ] Choisir une distribution publique et toutes les régions souhaitées.
- [ ] Coller les instructions de test anglaises.
- [ ] Choisir la publication différée afin de contrôler le lancement après approbation.
- [ ] Relire l’aperçu public dans chaque langue.
- [ ] Soumettre pour examen.

## 10. Après approbation

- [ ] Installer la version Store depuis sa fiche publique.
- [ ] Réaliser un test complet sur cette version signée par le Store.
- [ ] Publier manuellement si la publication différée a été choisie.
- [ ] Vérifier les liens de confidentialité et d’assistance.
- [ ] Conserver le numéro de version, le ZIP et la date de publication dans les notes de version.
- [ ] Surveiller les e-mails du Chrome Web Store et répondre aux demandes d’examen.

## Sources officielles

- [Préparer une extension](https://developer.chrome.com/docs/webstore/prepare)
- [Compléter la fiche Store](https://developer.chrome.com/docs/webstore/cws-dashboard-listing)
- [Privacy practices](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [Instructions de test](https://developer.chrome.com/docs/webstore/cws-dashboard-test-instructions)
- [Publier dans le Chrome Web Store](https://developer.chrome.com/docs/webstore/publish)
- [Mise à jour des règles au 1er août 2026](https://developer.chrome.com/blog/cws-policy-updates-2026?hl=en)
