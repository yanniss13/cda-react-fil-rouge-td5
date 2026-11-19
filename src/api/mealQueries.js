import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchMeal, fetchMealsByCategory, searchMeals } from './mealdb';

// Fabrique de clés : une clé distincte par type de lecture et par paramètre.
// Toutes commencent par 'meals' : invalidateQueries({ queryKey: mealKeys.all }) vide tout.
export const mealKeys = {
  all: ['meals'],
  categories: () => [...mealKeys.all, 'categories'],
  category: (category) => [...mealKeys.all, 'category', category],
  search: (name) => [...mealKeys.all, 'search', name.toLowerCase()],
  detail: (id) => [...mealKeys.all, 'detail', id],
};

export function useCategories() {
  return useQuery({
    queryKey: mealKeys.categories(),
    queryFn: fetchCategories,
    staleTime: Infinity, // la liste des catégories ne change pas pendant une session
  });
}

export function useCategoryMeals(category, { enabled = true } = {}) {
  return useQuery({
    queryKey: mealKeys.category(category),
    queryFn: (context) => fetchMealsByCategory(category, context),
    enabled,
  });
}

export function useSearchMeals(name) {
  return useQuery({
    queryKey: mealKeys.search(name),
    queryFn: (context) => searchMeals(name, context),
    enabled: name.length > 0, // pas de requête pour une recherche vide
  });
}

// Partagée par la fiche recette et la modale de planification : même clé = même cache
export function useMeal(id) {
  return useQuery({
    queryKey: mealKeys.detail(id),
    queryFn: (context) => fetchMeal(id, context),
  });
}
