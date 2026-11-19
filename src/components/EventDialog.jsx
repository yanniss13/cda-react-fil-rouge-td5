import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMealStore } from '../store/useMealStore';
import { formatDay } from '../lib/dates';

// Détail d'une recette planifiée, ouvert au clic sur un événement du calendrier
export default function EventDialog({ planning, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => dialogRef.current?.showModal(), []);
  const removePlanning = useMealStore((state) => state.removePlanning);

  function handleRemove() {
    removePlanning(planning.id);
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="event-title"
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
    >
      <div className="modal__body">
        {planning.thumb && <img src={`${planning.thumb}/medium`} alt="" className="modal__img" />}
        <h2 id="event-title" className="modal__title">{planning.title}</h2>
        <p className="modal__hint">Prévu le {formatDay(planning.date)}</p>
        <div className="modal__actions">
          <button type="button" className="btn" onClick={onClose}>Fermer</button>
          <Link to={`/recette/${planning.mealId}`} className="btn">Voir la recette</Link>
          <button type="button" className="btn btn--danger" onClick={handleRemove}>Retirer</button>
        </div>
      </div>
    </dialog>
  );
}
