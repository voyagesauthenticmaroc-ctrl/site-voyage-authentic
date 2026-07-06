# Traductions de contenu

Ce dossier contient les traductions des fichiers de `content/excursions/` et
`content/destinations/`, organisées par langue :

```
content/i18n/
  en/
    excursions/
      marrakech-merzouga-3j.json   ← même nom de fichier que le français
    destinations/
      marrakech.json
```

## Fonctionnement

- Le fichier de traduction **surcharge champ par champ** le fichier français.
  Tout champ absent garde automatiquement sa valeur française (fallback).
- Le champ `slug` définit l'**URL traduite** de la page :
  `"slug": "marrakech-merzouga-desert-tour-3-days"` donne
  `/en/private-morocco-tours/marrakech-merzouga-desert-tour-3-days`.
- Champs conseillés à traduire en priorité : `slug`, `name`, `seo.title`,
  `seo.description`, `hero.tagline`, `intro`, `priceFrom`.
  Ensuite : `programs`, `included`, `excluded`, `faq`, `highlights`.

## Ajouter une langue au site

Voir les instructions dans `i18n/routing.ts`.
