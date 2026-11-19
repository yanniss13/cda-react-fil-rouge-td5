import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMealStore } from './useMealStore';

const teriyaki = {
  mealId: '52772',
  name: 'Teriyaki Chicken Casserole',
  thumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
  ingredients: [
    { name: 'soy sauce', measure: '3/4 cup' },
    { name: 'water', measure: '1/2 cup' },
    { name: 'chicken breasts', measure: '2' },
  ],
};

// Compte les notifications du store pendant l'exécution d'une action
function countUpdates(action) {
  const listener = vi.fn();
  const unsubscribe = useMealStore.subscribe(listener);
  const result = action();
  unsubscribe();
  return { updates: listener.mock.calls.length, result };
}

beforeEach(() => useMealStore.setState({ plannings: [], ingredients: [] }));

describe('planRecipe', () => {
  it('ajoute la recette et ses ingrédients en une seule mise à jour du store', () => {
    const { updates, result: planningId } = countUpdates(() =>
      useMealStore.getState().planRecipe(teriyaki, '2026-11-20'),
    );

    expect(updates).toBe(1);
    const { plannings, ingredients } = useMealStore.getState();
    expect(plannings).toEqual([
      { id: planningId, mealId: '52772', name: teriyaki.name, thumb: teriyaki.thumb, date: '2026-11-20' },
    ]);
    expect(ingredients).toHaveLength(3);
    expect(ingredients.every((line) => line.planningId === planningId)).toBe(true);
    expect(ingredients[0]).toMatchObject({ name: 'soy sauce', quantity: 0.75, unit: 'cup' });
  });

  it('donne un identifiant distinct à chaque planification, même pour la même recette', () => {
    const { planRecipe } = useMealStore.getState();
    const first = planRecipe(teriyaki, '2026-11-20');
    const second = planRecipe(teriyaki, '2026-11-21');

    expect(first).not.toBe(second);
    const { ingredients } = useMealStore.getState();
    expect(ingredients.filter((line) => line.planningId === first)).toHaveLength(3);
    expect(ingredients.filter((line) => line.planningId === second)).toHaveLength(3);
    expect(new Set(ingredients.map((line) => line.id)).size).toBe(6);
  });
});

describe('removePlanning', () => {
  it('retire la recette et ses ingrédients en une seule mise à jour', () => {
    const { planRecipe } = useMealStore.getState();
    const kept = planRecipe(teriyaki, '2026-11-20');
    const removed = planRecipe(teriyaki, '2026-11-21');

    const { updates } = countUpdates(() => useMealStore.getState().removePlanning(removed));

    expect(updates).toBe(1);
    const { plannings, ingredients } = useMealStore.getState();
    expect(plannings.map((planning) => planning.id)).toEqual([kept]);
    expect(ingredients.every((line) => line.planningId === kept)).toBe(true);
  });
});
