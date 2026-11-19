import { Link, useNavigate } from 'react-router-dom';

// Revient à la page précédente (conserve recherche et catégorie), sinon à l'accueil
export default function BackLink() {
  const navigate = useNavigate();
  const canGoBack = (window.history.state?.idx ?? 0) > 0;

  if (!canGoBack) return <Link to="/" className="back">← Accueil</Link>;
  return (
    <button type="button" className="back" onClick={() => navigate(-1)}>
      ← Retour
    </button>
  );
}
