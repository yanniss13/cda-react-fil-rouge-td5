import { parseMeasure } from '../lib/measure';

// Transforme les ingrédients TheMealDB ([{ name, measure }]) en lignes de courses
// reliées à leur planification. Fonction pure : utilisée par l'action planRecipe.
export const toIngredientLines = (planningId, list, date) =>
  list.map(({ name, measure }) => ({
    id: crypto.randomUUID(),
    planningId,
    name,
    ...parseMeasure(measure), // { quantity, unit }
    date, // date de consommation propre à la ligne (modifiable seule)
  }));

// Slice "ingredients" : une ligne de la liste de courses, reliée à sa planification.
// updateIngredient modifie quantité, unité ou date d'une seule ligne.
export const createIngredientSlice = (set) => ({
  ingredients: [],

  updateIngredient: (id, changes) =>
    set((state) => ({
      ingredients: state.ingredients.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, ...changes } : ingredient,
      ),
    })),

  removeIngredient: (id) =>
    set((state) => ({
      ingredients: state.ingredients.filter((ingredient) => ingredient.id !== id),
    })),
});
