# Mijoté – TD5 : TanStack Query

Planificateur de repas réalisé dans le cadre du fil rouge React (formation CDA), à partir de l'API publique [TheMealDB](https://www.themealdb.com/api.php).

Ce dépôt correspond au **TD5** : les lectures TheMealDB passent par TanStack Query (`useQuery`), avec une clé distincte pour les catégories, les recherches et les fiches recettes, et une gestion des états de chargement, d'erreur et de résultat vide.

## Fonctionnalités

- **Accueil** : recettes par catégorie et recherche par nom
- **Fiche recette** : ingrédients, préparation, vidéo
- **Planification** : une modale pour choisir la date de consommation d'une recette
- **Liste de courses** : ingrédients de la semaine triés par date, avec quantité, unité et date modifiables, et suppression d'une ligne
- **Planning** : calendrier FullCalendar, avec suppression d'une recette et déplacement par glisser-déposer (les ingrédients suivent)

## Stack

React 19 · Vite · React Router · Zustand (store en deux slices + `persist`) · TanStack Query · Axios · FullCalendar · Vitest · CSS natif

## Lancer le projet

```bash
npm install
npm run dev     # serveur de développement
npm test        # tests (Vitest)
npm run build   # build de production
```

## Organisation du code

| Dossier | Rôle |
|---|---|
| `src/api/` | Lectures TheMealDB (`mealdb.js`), clés et hooks `useQuery` (`mealQueries.js`), configuration du `QueryClient` |
| `src/store/` | Store Zustand : slices `plannings` et `ingredients`, actions transverses (`planRecipe`, `movePlanning`, `removePlanning`), sélecteurs |
| `src/pages/` | Accueil, fiche recette, liste de courses, planning |
| `src/components/` | Composants d'interface (50 lignes maximum chacun) |
| `src/hooks/`, `src/lib/` | Hooks utilitaires (`useToggle`, debounce, paramètres d'URL), dates et mesures |

**Répartition des rôles** : Zustand garde les données créées par l'utilisateur (planning, liste de courses), TanStack Query gère les données du serveur (recettes TheMealDB : cache, nouvel essai, annulation).
