import { useParams } from 'react-router-dom';
import { useMeal } from '../api/mealQueries';
import Status from '../components/Status';
import RecipeDetail from '../components/RecipeDetail';

export default function Recipe() {
  const { id } = useParams();
  const { data: meal, isPending, error, refetch } = useMeal(id);

  return (
    <Status loading={isPending} error={error} onRetry={refetch} isEmpty={!meal} emptyText="Recette introuvable.">
      {meal && <RecipeDetail meal={meal} />}
    </Status>
  );
}
