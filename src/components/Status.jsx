// Les trois états d'une lecture (chargement, erreur, résultat vide) ; sinon rend les enfants.
// onRetry : en général le refetch renvoyé par useQuery.
export default function Status({ loading, error, onRetry, isEmpty, emptyText = 'Aucun résultat.', children }) {
  if (loading) {
    return (
      <p className="status" role="status">
        <span className="spinner" aria-hidden="true" /> Chargement…
      </p>
    );
  }
  if (error) {
    return (
      <div className="status status--error" role="alert">
        <span>Impossible de charger les données ({error.message}).</span>
        {onRetry && <button type="button" className="btn btn--small" onClick={() => onRetry()}>Réessayer</button>}
      </div>
    );
  }
  if (isEmpty) return <p className="status">{emptyText}</p>;
  return children;
}
