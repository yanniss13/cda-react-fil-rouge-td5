import { getIngredients, getSteps, toRecipeCard } from '../api/mealdb';
import BackLink from './BackLink';
import PlanButton from './PlanButton';

export default function RecipeDetail({ meal }) {
  const ingredients = getIngredients(meal);
  const tags = [meal.strCategory, meal.strArea].filter(Boolean);

  return (
    <article className="recipe">
      <BackLink />
      <header className="recipe__hero">
        <img src={meal.strMealThumb} alt="" className="recipe__img" />
        <div className="recipe__intro">
          <h1 className="recipe__title">{meal.strMeal}</h1>
          <p className="tags">
            {tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
          </p>
          <div className="recipe__actions">
            <PlanButton recipe={toRecipeCard(meal)} />
            {meal.strYoutube && (
              <a href={meal.strYoutube} target="_blank" rel="noreferrer" className="btn">
                Voir la vidéo
              </a>
            )}
          </div>
        </div>
      </header>
      <div className="recipe__content">
        <section className="panel">
          <h2 className="section-title">Ingrédients ({ingredients.length})</h2>
          <ul className="ingredients">
            {ingredients.map(({ name, measure }, index) => (
              <li key={`${name}-${index}`}>
                <span>{name}</span>
                <span className="muted">{measure}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="section-title">Préparation</h2>
          {getSteps(meal).map((step, index) => <p key={index} className="step">{step}</p>)}
        </section>
      </div>
    </article>
  );
}
