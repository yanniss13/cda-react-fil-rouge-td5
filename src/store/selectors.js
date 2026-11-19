import { useMemo } from 'react';
import { useMealStore } from './useMealStore';
import { getCurrentWeek } from '../lib/dates';

// ---------- Sélecteurs de base ----------
export const selectPlannings = (state) => state.plannings;
export const selectIngredients = (state) => state.ingredients;

// On sélectionne les tableaux bruts puis on dérive avec useMemo :
// un sélecteur qui renverrait un nouveau tableau à chaque appel provoquerait des rendus en boucle.

// ---------- Planning (FullCalendar) ----------
export const toCalendarEvent = (planning) => ({
  id: planning.id, // id de la planification (pas l'id TheMealDB)
  title: planning.name,
  start: planning.date,
  allDay: true,
  extendedProps: { mealId: planning.mealId, thumb: planning.thumb },
});

export function usePlanningEvents() {
  const plannings = useMealStore(selectPlannings);
  return useMemo(() => plannings.map(toCalendarEvent), [plannings]);
}

// ---------- Liste de courses ----------
// Ingrédients de la semaine (selon la date propre à chaque ligne), enrichis du nom
// de leur recette via planningId, triés par date de consommation croissante puis par recette
export function selectGroceries(ingredients, plannings, { start, end }) {
  const recipeNames = new Map(plannings.map((planning) => [planning.id, planning.name]));

  return ingredients
    .filter((ingredient) => ingredient.date >= start && ingredient.date <= end)
    .map((ingredient) => ({ ...ingredient, recipeName: recipeNames.get(ingredient.planningId) ?? '' }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.recipeName.localeCompare(b.recipeName));
}

// [[date, lignes]] en conservant l'ordre du tri
export const groupByDate = (items) => Object.entries(Object.groupBy(items, (item) => item.date));

export function useWeekGroceries() {
  const ingredients = useMealStore(selectIngredients);
  const plannings = useMealStore(selectPlannings);
  return useMemo(
    () => selectGroceries(ingredients, plannings, getCurrentWeek()),
    [ingredients, plannings],
  );
}
