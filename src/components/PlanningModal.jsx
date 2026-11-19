import { useEffect, useRef } from 'react';
import { getIngredients } from '../api/mealdb';
import { useMeal } from '../api/mealQueries';
import { useMealStore } from '../store/useMealStore';
import { todayISO } from '../lib/dates';

// Modale native <dialog> : lit la fiche (cache partagé avec la page recette) puis planifie
export default function PlanningModal({ recipe, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => dialogRef.current?.showModal(), []);
  const planRecipe = useMealStore((state) => state.planRecipe);
  const { data: meal, isPending, error } = useMeal(recipe.id);
  const ingredients = meal ? getIngredients(meal) : null;

  function handleSubmit(event) {
    event.preventDefault();
    const date = new FormData(event.currentTarget).get('date');
    planRecipe({ mealId: recipe.id, name: recipe.name, thumb: recipe.thumb, ingredients }, date);
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="planning-title"
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
    >
      <form className="modal__body" onSubmit={handleSubmit}>
        <h2 id="planning-title" className="modal__title">Planifier « {recipe.name} »</h2>
        <label className="field">
          Date de consommation
          <input type="date" name="date" required min={todayISO()} defaultValue={todayISO()} className="field__control" />
        </label>
        <p className="modal__hint" role="status">
          {isPending && 'Chargement des ingrédients…'}
          {error && 'Ingrédients indisponibles, réessayez plus tard.'}
          {meal === null && 'Recette introuvable.'}
          {ingredients && `${ingredients.length} ingrédients seront ajoutés à la liste de courses.`}
        </p>
        <div className="modal__actions">
          <button type="button" className="btn" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn--primary" disabled={!ingredients}>Valider</button>
        </div>
      </form>
    </dialog>
  );
}
