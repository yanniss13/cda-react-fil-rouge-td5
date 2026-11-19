import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';

function withParam(params, key, value) {
  const next = new URLSearchParams(params);
  if (value) next.set(key, value);
  else next.delete(key);
  return next;
}

// Paramètre d'URL simple (?key=value) : la valeur survit au retour arrière
export function useSearchParam(key, fallback = '') {
  const [params, setParams] = useSearchParams();
  const setValue = (value) => setParams((previous) => withParam(previous, key, value));
  return [params.get(key) ?? fallback, setValue];
}

// Variante pour un champ texte : l'input garde son propre état (saisie fluide),
// seule la valeur "debouncée" est écrite dans l'URL.
export function useDebouncedSearchParam(key, delay = 400) {
  const [params, setParams] = useSearchParams();
  const urlValue = params.get(key) ?? '';
  const [input, setInput] = useState(urlValue);
  const debounced = useDebounce(input.trim(), delay);

  useEffect(() => {
    if (debounced === urlValue) return;
    setParams((previous) => withParam(previous, key, debounced), { replace: true });
  }, [debounced, urlValue, key, setParams]);

  return [input, setInput, debounced];
}
