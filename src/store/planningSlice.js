// Slice "plannings" : une entrée = une recette TheMealDB prévue à une date.
// Toute modification d'une planification touche aussi ses ingrédients :
// ces actions sont donc dans planningActions.js (un seul set pour les deux slices).
export const createPlanningSlice = () => ({
  plannings: [],
});
