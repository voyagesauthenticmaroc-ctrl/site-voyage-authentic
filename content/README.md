# Contenu — Agence de voyage Maroc

Contenu chargé via [`lib/content.ts`](../lib/content.ts).

## Structure

```
content/
├── site.json                 # Config globale : agence, contact, nav, langues, note tarifs
├── circuits/                 # [À CRÉER] Circuits Maroc (JSON par circuit)
├── destinations/             # [À CRÉER] Destinations Maroc (JSON par destination)
├── blog/                     # Articles MDX du blog
└── testimonials/
    └── reviews.json          # Avis clients
```

## Contenu à renseigner (en attente des PDF client)

| Section | Fichier | Statut |
|---|---|---|
| Config globale (nom, contact, langues) | `site.json` | `[PLACEHOLDER]` |
| Circuits | `circuits/*.json` | À créer |
| Destinations | `destinations/*.json` | À créer |
| Témoignages | `testimonials/reviews.json` | `[]` vide |

> **RÈGLE ABSOLUE** : aucun contenu inventé. Tout vient des PDF fournis par le client.
> Si une information manque, utiliser un placeholder visible `[...]`.
