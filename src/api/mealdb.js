import { mealApi } from './client';

// ---------- Fonctions de lecture (queryFn de TanStack Query) ----------
// Elles reçoivent le signal d'annulation fourni par TanStack Query et renvoient
// des données déjà normalisées : les composants ne voient jamais le format brut de l'API.

export async function fetchCategories({ signal }) {
  const { data } = await mealApi.get('/categories.php', { signal });
  return data.categories ?? [];
}

export async function fetchMealsByCategory(category, { signal }) {
  const { data } = await mealApi.get('/filter.php', { params: { c: category }, signal });
  return (data.meals ?? []).map(toRecipeCard); // { meals: null } si catégorie inconnue
}

export async function searchMeals(name, { signal }) {
  const { data } = await mealApi.get('/search.php', { params: { s: name }, signal });
  return (data.meals ?? []).map(toRecipeCard); // { meals: null } si aucun résultat
}

export async function fetchMeal(id, { signal }) {
  const { data } = await mealApi.get('/lookup.php', { params: { i: id }, signal });
  return data.meals?.[0] ?? null; // null = recette introuvable
}

// ---------- Helpers de format ----------

// Format réduit utilisé par les cartes et la modale
export const toRecipeCard = (meal) => ({
  id: meal.idMeal,
  name: meal.strMeal,
  thumb: meal.strMealThumb,
});

// L'API expose strIngredient1..20 / strMeasure1..20 : on les regroupe en tableau
export function getIngredients(meal) {
  return Array.from({ length: 20 }, (_, i) => ({
    name: meal[`strIngredient${i + 1}`]?.trim(),
    measure: meal[`strMeasure${i + 1}`]?.trim() ?? '',
  })).filter((ingredient) => ingredient.name);
}

export function getSteps(meal) {
  return (meal.strInstructions ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
