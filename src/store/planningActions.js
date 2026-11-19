import { toIngredientLines } from './ingredientSlice';

// Actions transverses : elles modifient les deux slices dans UN SEUL set().
// Les abonnés (composants, persist) ne voient jamais d'état intermédiaire,
// par exemple une recette planifiée dont les ingrédients ne sont pas encore ajoutés.
export const createPlanningActions = (set) => ({
  // Appelée à la validation de la modale de planification
  planRecipe: ({ mealId, name, thumb, ingredients }, date) => {
    const planningId = crypto.randomUUID(); // id propre à cette planification

    set((state) => ({
      plannings: [...state.plannings, { id: planningId, mealId, name, thumb, date }],
      ingredients: [...state.ingredients, ...toIngredientLines(planningId, ingredients, date)],
    }));

    return planningId;
  },

  // Suppression d'une entrée du planning : ses ingrédients partent avec elle
  removePlanning: (planningId) =>
    set((state) => ({
      plannings: state.plannings.filter((planning) => planning.id !== planningId),
      ingredients: state.ingredients.filter((ingredient) => ingredient.planningId !== planningId),
    })),

  // Déplacement dans le calendrier : les ingrédients associés prennent la nouvelle date.
  // Le spread conserve tout le reste de la ligne (quantité, unité, même modifiées).
  movePlanning: (planningId, date) =>
    set((state) => ({
      plannings: state.plannings.map((planning) =>
        planning.id === planningId ? { ...planning, date } : planning,
      ),
      ingredients: state.ingredients.map((ingredient) =>
        ingredient.planningId === planningId ? { ...ingredient, date } : ingredient,
      ),
    })),
});
