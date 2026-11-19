import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { useMealStore } from '../store/useMealStore';
import { usePlanningEvents } from '../store/selectors';
import PlanningEvent from '../components/PlanningEvent';
import EventDialog from '../components/EventDialog';

const PLUGINS = [dayGridPlugin, listPlugin, interactionPlugin];
const TOOLBAR = { left: 'prev,next today', center: 'title', right: 'dayGridMonth,dayGridWeek,listWeek' };
const initialView = () => (window.matchMedia('(max-width: 719px)').matches ? 'listWeek' : 'dayGridMonth'); // liste sur mobile

export default function Planning() {
  const events = usePlanningEvents();
  const movePlanning = useMealStore((state) => state.movePlanning);
  const [selected, setSelected] = useState(null);

  // Le store reste la source de vérité : FullCalendar ne fait qu'afficher et signaler
  const handleClick = ({ event }) =>
    setSelected({ id: event.id, title: event.title, date: event.startStr, ...event.extendedProps });
  const handleDrop = ({ event }) => movePlanning(event.id, event.startStr); // + date des ingrédients

  return (
    <section>
      <h1 className="page-title">Planning</h1>
      <p className="muted subtitle">Cliquez sur une recette pour la retirer, glissez-la pour changer sa date.</p>
      <div className="calendar">
        <FullCalendar
          plugins={PLUGINS}
          locale={frLocale}
          initialView={initialView()}
          headerToolbar={TOOLBAR}
          height="auto"
          events={events}
          editable
          eventDurationEditable={false}
          eventInteractive
          eventContent={({ event }) => <PlanningEvent event={event} />}
          eventClick={handleClick}
          eventDrop={handleDrop}
          noEventsContent="Aucune recette planifiée sur cette période."
        />
      </div>
      {selected && <EventDialog planning={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
