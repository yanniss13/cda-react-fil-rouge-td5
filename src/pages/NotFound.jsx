import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="empty">
      <h1 className="page-title">Page introuvable</h1>
      <Link to="/" className="btn btn--primary">Retour à l'accueil</Link>
    </section>
  );
}
