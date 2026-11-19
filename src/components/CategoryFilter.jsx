import { useCategories } from '../api/mealQueries';
import Status from './Status';

export default function CategoryFilter({ selected, onSelect }) {
  const { data: categories = [], isPending, error, refetch } = useCategories();

  return (
    <Status loading={isPending} error={error} onRetry={refetch} isEmpty={!categories.length}
      emptyText="Aucune catégorie disponible.">
      <ul className="chips" aria-label="Catégories">
        {categories.map(({ idCategory, strCategory }) => (
          <li key={idCategory}>
            <button
              type="button"
              className="chip"
              aria-pressed={strCategory === selected}
              onClick={() => onSelect(strCategory)}
            >
              {strCategory}
            </button>
          </li>
        ))}
      </ul>
    </Status>
  );
}
