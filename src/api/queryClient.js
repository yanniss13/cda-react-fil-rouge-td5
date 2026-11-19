import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // les recettes TheMealDB changent rarement : 5 min de fraîcheur
      retry: 1, // une seule nouvelle tentative avant d'afficher l'erreur
      refetchOnWindowFocus: false,
    },
  },
});
