import { Link } from 'react-router-dom';
import { groupByDate, useWeekGroceries } from '../store/selectors';
import { formatDay, getCurrentWeek } from '../lib/dates';
import GroceryRow from '../components/GroceryRow';

const SHORT_DATE = { day: 'numeric', month: 'long' };

export default function ShoppingList() {
  const groceries = useWeekGroceries();
  const { start, end } = getCurrentWeek();

  return (
    <section>
      <h1 className="page-title">Liste de courses</h1>
      <p className="muted subtitle">
        Semaine du {formatDay(start, SHORT_DATE)} au {formatDay(end, SHORT_DATE)} · {groceries.length} ingrédient(s)
      </p>
      {groceries.length ? (
        groupByDate(groceries).map(([date, items]) => (
          <section key={date}>
            <h2 className="section-title">{formatDay(date)}</h2>
            <ul className="panel groceries">
              {items.map((item) => <GroceryRow key={item.id} item={item} />)}
            </ul>
          </section>
        ))
      ) : (
        <div className="empty">
          <p>Aucun ingrédient prévu cette semaine.</p>
          <p className="muted">Planifiez des recettes : leurs ingrédients s'ajouteront ici.</p>
          <Link to="/" className="btn btn--primary">Choisir des recettes</Link>
        </div>
      )}
    </section>
  );
}
