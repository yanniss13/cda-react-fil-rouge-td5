import { beforeEach, describe, expect, it, vi } from 'vitest';
import { migrate, useMealStore } from './useMealStore';
import { selectGroceries } from './selectors';

const teriyaki = {
  mealId: '52772',
  name: 'Teriyaki Chicken Casserole',
  thumb: 'teriyaki.jpg',
  ingredients: [
    { name: 'soy sauce', measure: '3/4 cup' },
    { name: 'water', measure: '1/2 cup' },
  ],
};
const pie = {
  mealId: '52874',
  name: 'Beef and Mustard Pie',
  thumb: 'pie.jpg',
  ingredients: [{ name: 'beef', measure: '1kg' }],
};

function countUpdates(action) {
  const listener = vi.fn();
  const unsubscribe = useMealStore.subscribe(listener);
  action();
  unsubscribe();
  return listener.mock.calls.length;
}

const linesOf = (planningId) =>
  useMealStore.getState().ingredients.filter((line) => line.planningId === planningId);

beforeEach(() => useMealStore.setState({ plannings: [], ingredients: [] }));

describe('planRecipe', () => {
  it('donne aux ingrédients la date de consommation choisie', () => {
    const id = useMealStore.getState().planRecipe(teriyaki, '2026-11-20');
    expect(linesOf(id).map((line) => line.date)).toEqual(['2026-11-20', '2026-11-20']);
  });
});

describe('removePlanning', () => {
  it('retire aussi les ingrédients associés, et seulement eux', () => {
    const { planRecipe } = useMealStore.getState();
    const kept = planRecipe(pie, '2026-11-18');
    const removed = planRecipe(teriyaki, '2026-11-20');

    const updates = countUpdates(() => useMealStore.getState().removePlanning(removed));

    expect(updates).toBe(1);
    expect(linesOf(removed)).toEqual([]);
    expect(linesOf(kept)).toHaveLength(1);
  });
});

describe('movePlanning', () => {
  it('déplace la recette et la date de ses ingrédients en une seule mise à jour', () => {
    const id = useMealStore.getState().planRecipe(teriyaki, '2026-11-20');

    const updates = countUpdates(() => useMealStore.getState().movePlanning(id, '2026-11-22'));

    expect(updates).toBe(1);
    expect(useMealStore.getState().plannings[0].date).toBe('2026-11-22');
    expect(linesOf(id).map((line) => line.date)).toEqual(['2026-11-22', '2026-11-22']);
  });

  it('conserve les quantités, y compris celles modifiées à la main', () => {
    const { planRecipe, updateIngredient } = useMealStore.getState();
    const id = planRecipe(teriyaki, '2026-11-20');
    const [soy, water] = linesOf(id);
    updateIngredient(soy.id, { quantity: 2, unit: 'tbsp' });

    useMealStore.getState().movePlanning(id, '2026-11-22');

    const [movedSoy, movedWater] = linesOf(id);
    expect(movedSoy).toEqual({ ...soy, quantity: 2, unit: 'tbsp', date: '2026-11-22' });
    expect(movedWater).toEqual({ ...water, date: '2026-11-22' });
  });

  it('ne touche pas aux ingrédients des autres planifications', () => {
    const { planRecipe } = useMealStore.getState();
    const other = planRecipe(pie, '2026-11-18');
    const before = linesOf(other);
    const moved = planRecipe(teriyaki, '2026-11-20');

    useMealStore.getState().movePlanning(moved, '2026-11-22');

    expect(linesOf(other)).toEqual(before);
  });
});

describe('selectGroceries', () => {
  it('trie selon la date propre à chaque ligne', () => {
    const { planRecipe, updateIngredient } = useMealStore.getState();
    const id = planRecipe(teriyaki, '2026-11-20');
    updateIngredient(linesOf(id)[1].id, { date: '2026-11-17' }); // water avancé au 17

    const { ingredients, plannings } = useMealStore.getState();
    const rows = selectGroceries(ingredients, plannings, { start: '2026-11-16', end: '2026-11-22' });

    expect(rows.map((row) => [row.name, row.date, row.recipeName])).toEqual([
      ['water', '2026-11-17', 'Teriyaki Chicken Casserole'],
      ['soy sauce', '2026-11-20', 'Teriyaki Chicken Casserole'],
    ]);
  });
});

describe('migrate (données sauvegardées en v1)', () => {
  it('donne à chaque ingrédient la date de sa planification', () => {
    const v1 = {
      plannings: [{ id: 'p1', date: '2026-11-20' }, { id: 'p2', date: '2026-11-22' }],
      ingredients: [{ id: 'i1', planningId: 'p1', quantity: 1 }, { id: 'i2', planningId: 'p2', quantity: 3 }],
    };
    expect(migrate(v1, 1).ingredients).toEqual([
      { id: 'i1', planningId: 'p1', quantity: 1, date: '2026-11-20' },
      { id: 'i2', planningId: 'p2', quantity: 3, date: '2026-11-22' },
    ]);
  });
});
