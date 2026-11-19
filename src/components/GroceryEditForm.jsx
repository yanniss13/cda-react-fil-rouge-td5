import { useMealStore } from '../store/useMealStore';

// Modifie la quantité + l'unité et la date de consommation de CETTE ligne uniquement
export default function GroceryEditForm({ item, onDone }) {
  const updateIngredient = useMealStore((state) => state.updateIngredient);

  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const quantity = form.get('quantity');
    updateIngredient(item.id, {
      quantity: quantity === '' ? null : Number(quantity),
      unit: form.get('unit').trim(),
      date: form.get('date'),
    });
    onDone();
  }

  return (
    <form className="grocery-form" onSubmit={handleSubmit} aria-label={`Modifier ${item.name}`}>
      <p className="grocery__main">
        <span className="grocery__name">{item.name}</span>
        <span className="grocery__recipe">{item.recipeName}</span>
      </p>
      <label className="field">
        Quantité
        <input name="quantity" type="number" min="0" step="any" defaultValue={item.quantity ?? ''} className="field__control" />
      </label>
      <label className="field">
        Unité
        <input name="unit" defaultValue={item.unit} placeholder="g, cl, cuillère…" className="field__control" />
      </label>
      <label className="field">
        Date de consommation
        <input name="date" type="date" required defaultValue={item.date} className="field__control" />
      </label>
      <div className="grocery__actions">
        <button type="button" className="btn btn--small" onClick={onDone}>Annuler</button>
        <button type="submit" className="btn btn--small btn--primary">Enregistrer</button>
      </div>
    </form>
  );
}
