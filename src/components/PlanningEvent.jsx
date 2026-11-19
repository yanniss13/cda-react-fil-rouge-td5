// Rendu personnalisé d'un événement FullCalendar (vignette + nom de la recette)
export default function PlanningEvent({ event }) {
  const { thumb } = event.extendedProps;

  return (
    <span className="cal-event">
      {thumb && <img src={`${thumb}/small`} alt="" className="cal-event__img" />}
      <span className="cal-event__title">{event.title}</span>
    </span>
  );
}
