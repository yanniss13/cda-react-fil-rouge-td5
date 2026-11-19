import { useCategoryMeals, useSearchMeals } from '../api/mealQueries';
import { DEFAULT_CATEGORY } from '../data/planning';
import { useDebouncedSearchParam, useSearchParam } from '../hooks/useSearchParam';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import RecipeList from '../components/RecipeList';

// Recherche et catégorie vivent dans l'URL (?q=…&c=…)
export default function Home() {
  const [category, setCategory] = useSearchParam('c', DEFAULT_CATEGORY);
  const [query, setQuery, search] = useDebouncedSearchParam('q');
  // Une seule des deux requêtes est active à la fois (option enabled)
  const searchResults = useSearchMeals(search);
  const categoryMeals = useCategoryMeals(category, { enabled: !search });

  return (
    <>
      <section className="hero">
        <h1 className="hero__title">Que mange-t-on cette semaine ?</h1>
        <SearchBar value={query} onChange={setQuery} />
      </section>
      {search ? (
        <section aria-live="polite">
          <h2 className="section-title">Résultats pour « {search} »</h2>
          <RecipeList query={searchResults} emptyText="Aucune recette ne porte ce nom." />
        </section>
      ) : (
        <section>
          <CategoryFilter selected={category} onSelect={setCategory} />
          <h2 className="section-title">{category}</h2>
          <RecipeList query={categoryMeals} emptyText="Aucune recette dans cette catégorie." />
        </section>
      )}
    </>
  );
}
