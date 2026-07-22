# Checklist de publication Chrome Web Store

Date de préparation : 22 juillet 2026.

## 1. Blocages à résoudre dans le produit

- [x] Implémenter la divulgation et le consentement de [`DATA_DISCLOSURE.md`](./DATA_DISCLOSURE.md) avant toute observation de l’état YouTube et toute capture.
- [x] Empêcher le content script de publier ses snapshots avant consentement et en dehors d’une session d’analyse active.
- [x] Enregistrer uniquement la version du consentement nécessaire, localement dans Chrome.
- [x] Ajouter dans le panneau un lien permanent vers la politique de confidentialité.
- [x] Réinitialiser le canvas d’analyse à 1 × 1 pixel et libérer la source vidéo à l’arrêt.
- [x] Retirer du manifeste et de la documentation la permission inutilisée d’accès temporaire à l’onglet actif.
- [x] Aligner la version affichée dans le panneau sur le manifeste (`V1.0.0`).
- [ ] Vérifier que la fermeture du panneau, le bouton Arrêter, la navigation et la fermeture de l’onglet arrêtent la capture.

## 2. Informations de l’éditeur

- [ ] Choisir le compte Google éditeur définitif et activer la validation en deux étapes.
- [ ] Régler les frais uniques du compte développeur.
- [ ] Vérifier l’adresse e-mail du compte développeur.
- [x] Retenir le nom public **Color Analyzer for YouTube**, le développeur **dycor** et le contact **dyvyn.7@gmail.com** dans les documents.
- [ ] Déclarer correctement le statut trader ou non-trader.
- [x] Remplacer tous les marqueurs de remplacement dans les cinq langues.

Le contrôle automatisé du site vérifie l’absence de marqueurs non résolus dans les politiques, pages d’assistance, fiches Store, divulgation et réponses Privacy practices.

## 3. Pages publiques

- [ ] Héberger la politique de confidentialité sur une URL HTTPS accessible sans connexion.
- [ ] Héberger la page d’assistance ou configurer le Support Hub du Chrome Web Store.
- [x] Ajouter le workflow GitHub Pages officiel qui ne publie que `website/dist/`.
- [x] Générer les quinze routes anglaises, françaises, espagnoles, portugaises et chinoises avec l’anglais par défaut.
- [x] Vérifier les liens, URL canoniques et balises `hreflang` entre toutes les versions linguistiques.
- [ ] Maintenir ces pages disponibles aussi longtemps que l’extension est publiée.

## 4. Fiche Store

- [ ] Saisir la fiche anglaise principale depuis [`STORE_LISTING.en.md`](./STORE_LISTING.en.md).
- [ ] Ajouter les localisations française, chinoise, espagnole et portugaise.
- [x] Inclure la divulgation relative aux données près du début de chaque description préparée.
- [ ] Choisir la catégorie Productivité ou son équivalent actuel.
- [ ] Ajouter l’URL d’accueil, l’URL d’assistance et l’URL de confidentialité.
- [x] Ajouter une mention d’indépendance vis-à-vis de Google, YouTube et Blackmagic Design dans chaque description préparée.
- [ ] Déclarer l’extension gratuite et sans achat intégré dans les champs correspondants.
- [ ] Vérifier et renseigner correctement le classement de contenu mature si le Dashboard affiche ce champ.

## 5. Visuels

- [x] Icône d’extension 128 × 128 incluse dans le paquet.
- [x] Au moins une capture d’écran 1280 × 800 ou 640 × 400, sans marge.
- [x] Cinq captures 1280 × 800 montrent Waveform, Parade YRGB, Vecteurscope, image détaillée en pause et consentement au traitement local.
- [x] Vignette promotionnelle 440 × 280.
- [x] Bannière 1400 × 560 si une promotion étendue est souhaitée.
- [x] Vérifier visuellement que les visuels utilisent l’interface réelle, l’identité Color Analyzer et aucune marque graphique YouTube ou DaVinci Resolve.

## 6. Privacy practices

- [x] Préparer la finalité unique, les justifications des permissions finales, les catégories de données, l’absence de code distant et les certifications dans [`PRIVACY_PRACTICES.md`](./PRIVACY_PRACTICES.md).
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

- [x] Exécuter `pnpm verify` : 70 tests et les contrôles build/site réussis le 22 juillet 2026.
- [x] Exécuter `pnpm test:e2e` : 7 scénarios Chromium réussis le 22 juillet 2026.
- [x] Charger le build final dans un profil Chromium temporaire propre via Playwright.
- [x] Tester une première installation sans consentement déjà enregistré, l’annulation puis l’acceptation.
- [x] Vérifier sur une page YouTube simulée qu’un démarrage sans consentement ou sans session active produit zéro snapshot, que l’observation démarre avec la session autorisée et s’arrête à sa fin.
- [ ] Tester les cinq langues du navigateur.
- [ ] Tester lecture, pause, navigation YouTube SPA et arrêt de capture.
- [ ] Suivre intégralement [`TEST_INSTRUCTIONS.md`](./TEST_INSTRUCTIONS.md) sur le build final.
- [ ] Vérifier l’absence d’erreur sur `chrome://extensions`.

## 8. Paquet de soumission

- [x] Automatiser la construction et la vérification d’un `dist/` propre.
- [x] Exclure les source maps du build de publication.
- [x] Exclure `icons/logo-master.png`, inutile à l’exécution.
- [x] Vérifier automatiquement que `manifest.json` est à la racine du ZIP.
- [x] Confirmer `1.0.0` comme version de première soumission ; l’augmenter avant tout nouvel import après celui-ci.
- [x] Générer une archive versionnée dans `release/` dont le contenu correspond exactement au build vérifié.

Archive finale locale : `release/color-analyzer-1.0.0.zip`

Empreinte vérifiable : `release/SHA256SUMS.txt` (générée avec l’archive).

Commande :

```bash
pnpm package:store
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
