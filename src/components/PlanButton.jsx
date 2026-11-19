import { useToggle } from '../hooks/useToggle';
import PlanningModal from './PlanningModal';

// Bouton "Planifier" : ouvre/ferme la modale grâce au hook useToggle
export default function PlanButton({ recipe, className = 'btn btn--primary' }) {
  const [isOpen, toggleModal] = useToggle(false);

  return (
    <>
      <button type="button" className={className} onClick={() => toggleModal()}>
        Planifier
      </button>
      {isOpen && <PlanningModal recipe={recipe} onClose={() => toggleModal(false)} />}
    </>
  );
}
