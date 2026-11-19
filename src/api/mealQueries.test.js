import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mealApi } from './client';
import { fetchCategories, fetchMeal, fetchMealsByCategory, searchMeals } from './mealdb';
import { mealKeys } from './mealQueries';

vi.mock('./client', () => ({ mealApi: { get: vi.fn() } }));

const signal = new AbortController().signal;
const respond = (data) => mealApi.get.mockResolvedValueOnce({ data });
const rawMeal = { idMeal: '52772', strMeal: 'Teriyaki Chicken Casserole', strMealThumb: 'teriyaki.jpg' };

beforeEach(() => mealApi.get.mockReset());

describe('mealKeys', () => {
  it('donne une clé distincte aux catégories, recherches et fiches', () => {
    const keys = [
      mealKeys.categories(),
      mealKeys.category('Beef'),
      mealKeys.category('Seafood'),
      mealKeys.search('curry'),
      mealKeys.detail('52772'),
    ].map((key) => JSON.stringify(key));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('partage le préfixe "meals" et ignore la casse de la recherche', () => {
    expect(mealKeys.category('Beef').slice(0, 1)).toEqual(mealKeys.all);
    expect(mealKeys.search('Curry')).toEqual(mealKeys.search('curry'));
  });
});

describe('fonctions de lecture', () => {
  it('transmettent les paramètres et le signal d’annulation', async () => {
    respond({ meals: [rawMeal] });
    await fetchMealsByCategory('Beef', { signal });
    expect(mealApi.get).toHaveBeenCalledWith('/filter.php', { params: { c: 'Beef' }, signal });
  });

  it('normalisent les recettes en cartes', async () => {
    respond({ meals: [rawMeal] });
    expect(await searchMeals('teriyaki', { signal })).toEqual([
      { id: '52772', name: 'Teriyaki Chicken Casserole', thumb: 'teriyaki.jpg' },
    ]);
  });

  it('renvoient un tableau vide quand l’API répond { meals: null }', async () => {
    respond({ meals: null });
    expect(await searchMeals('zzz', { signal })).toEqual([]);
    respond({ meals: null });
    expect(await fetchMealsByCategory('Inconnue', { signal })).toEqual([]);
    respond({ categories: null });
    expect(await fetchCategories({ signal })).toEqual([]);
  });

  it('renvoient null pour une fiche introuvable', async () => {
    respond({ meals: null });
    expect(await fetchMeal('0', { signal })).toBeNull();
  });

  it('laissent remonter les erreurs réseau (gérées par useQuery)', async () => {
    mealApi.get.mockRejectedValueOnce(new Error('Network Error'));
    await expect(fetchMeal('52772', { signal })).rejects.toThrow('Network Error');
  });
});
