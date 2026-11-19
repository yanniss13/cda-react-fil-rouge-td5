import { Link } from 'react-router-dom';
import PlanButton from './PlanButton';

export default function RecipeCard({ recipe }) {
  return (
    <article className="card">
      <Link to={`/recette/${recipe.id}`} className="card__link">
        <img src={recipe.thumb} alt="" loading="lazy" className="card__img" />
        <h3 className="card__title">{recipe.name}</h3>
      </Link>
      <div className="card__footer">
        <PlanButton recipe={recipe} />
      </div>
    </article>
  );
}
