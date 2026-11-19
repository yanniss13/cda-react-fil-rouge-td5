import Status from './Status';
import RecipeCard from './RecipeCard';

// query : résultat d'un useQuery qui renvoie des cartes recette (catégorie ou recherche)
export default function RecipeList({ query, emptyText }) {
  const { data: recipes = [], isPending, error, refetch, isFetching } = query;

  return (
    <Status loading={isPending} error={error} onRetry={refetch} isEmpty={!recipes.length} emptyText={emptyText}>
      <ul className="grid" aria-busy={isFetching}>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>
    </Status>
  );
}
