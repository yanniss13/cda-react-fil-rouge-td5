import { useCallback, useState } from 'react';

// Inverse un booléen, ou force une valeur : toggle(true) / toggle(false)
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback((next) => {
    setValue((current) => (typeof next === 'boolean' ? next : !current));
  }, []);

  return [value, toggle];
}
