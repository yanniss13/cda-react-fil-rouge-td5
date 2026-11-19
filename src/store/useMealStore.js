import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPlanningSlice } from './planningSlice';
import { createIngredientSlice } from './ingredientSlice';
import { createPlanningActions } from './planningActions';

// v1 → v2 : les ingrédients n'avaient pas de date, on leur donne celle de leur planification
export function migrate(persisted, version) {
  if (version >= 2) return persisted;
  const dates = new Map(persisted.plannings.map((planning) => [planning.id, planning.date]));
  return {
    ...persisted,
    ingredients: persisted.ingredients.map((line) => ({ ...line, date: dates.get(line.planningId) })),
  };
}

// Un seul store : deux slices de données + les actions qui les relient,
// sauvegardé dans le localStorage
export const useMealStore = create(
  persist(
    (...args) => ({
      ...createPlanningSlice(...args),
      ...createIngredientSlice(...args),
      ...createPlanningActions(...args),
    }),
    { name: 'mijote-store', version: 2, migrate },
  ),
);
