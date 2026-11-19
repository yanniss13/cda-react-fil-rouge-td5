const UNICODE_FRACTIONS = { '½': ' 1/2', '¼': ' 1/4', '¾': ' 3/4', '⅓': ' 1/3', '⅔': ' 2/3' };

// "1 1/2", "1/2", "1.5" ou "1,5" → nombre
function toNumber(text) {
  return text
    .trim()
    .split(/\s+/)
    .reduce((total, part) => {
      const [numerator, denominator] = part.replace(',', '.').split('/').map(Number);
      return total + (denominator ? numerator / denominator : numerator);
    }, 0);
}

// TheMealDB fournit une mesure libre ("300g", "1 1/2 cups", "pinch").
// On la découpe en { quantity, unit } pour pouvoir modifier chaque partie.
export function parseMeasure(measure = '') {
  const text = measure.replace(/[½¼¾⅓⅔]/g, (char) => UNICODE_FRACTIONS[char]).trim();
  // Ordre important : fraction seule, puis entier/décimal suivi d'une fraction éventuelle
  const match = text.match(/^(\d+\/\d+|\d+(?:[.,]\d+)?(?:\s+\d+\/\d+)?)\s*(.*)$/);
  if (!match) return { quantity: null, unit: text };
  return { quantity: Math.round(toNumber(match[1]) * 100) / 100, unit: match[2].trim() };
}

export function formatMeasure({ quantity, unit }) {
  const amount = quantity == null ? '' : quantity.toLocaleString('fr-FR');
  return `${amount} ${unit}`.trim() || '—';
}
