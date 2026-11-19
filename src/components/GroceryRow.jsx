import { useToggle } from '../hooks/useToggle';
import { useMealStore } from '../store/useMealStore';
import { formatMeasure } from '../lib/measure';
import GroceryEditForm from './GroceryEditForm';

// item : ligne enrichie par selectGroceries ({ ...ingredient, date, recipeName })
export default function GroceryRow({ item }) {
  const [isEditing, toggleEditing] = useToggle(false);
  const removeIngredient = useMealStore((state) => state.removeIngredient);

  if (isEditing) {
    return (
      <li className="grocery grocery--editing">
        <GroceryEditForm item={item} onDone={() => toggleEditing(false)} />
      </li>
    );
  }

  return (
    <li className="grocery">
      <div className="grocery__main">
        <span className="grocery__name">{item.name}</span>
        <span className="grocery__recipe">{item.recipeName}</span>
      </div>
      <span className="grocery__qty">{formatMeasure(item)}</span>
      <div className="grocery__actions">
        <button type="button" className="btn btn--small" onClick={() => toggleEditing(true)}
          aria-label={`Modifier ${item.name} (${item.recipeName})`}>
          Modifier
        </button>
        <button type="button" className="btn btn--small btn--danger" onClick={() => removeIngredient(item.id)}
          aria-label={`Supprimer ${item.name} (${item.recipeName})`}>
          Supprimer
        </button>
      </div>
    </li>
  );
}
