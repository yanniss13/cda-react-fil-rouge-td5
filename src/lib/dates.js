// Les dates sont stockées en "YYYY-MM-DD" (heure locale) : comparables comme des chaînes
export function toISODate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export const todayISO = () => toISODate(new Date());

const fromISODate = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Les 7 jours (lundi → dimanche) de la semaine contenant la date de référence
export function getWeekDays(reference = new Date()) {
  const offset = (reference.getDay() + 6) % 7; // lundi = 0
  return Array.from({ length: 7 }, (_, index) =>
    toISODate(new Date(reference.getFullYear(), reference.getMonth(), reference.getDate() - offset + index)),
  );
}

export function getCurrentWeek() {
  const days = getWeekDays();
  return { start: days[0], end: days[6] };
}

export function formatDay(iso, options = { weekday: 'long', day: 'numeric', month: 'long' }) {
  return fromISODate(iso).toLocaleDateString('fr-FR', options);
}
