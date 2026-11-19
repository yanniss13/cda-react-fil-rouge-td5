import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Status from './components/Status';
import Home from './pages/Home';
import Recipe from './pages/Recipe';
import ShoppingList from './pages/ShoppingList';
import NotFound from './pages/NotFound';

// FullCalendar est lourd : la page Planning n'est chargée qu'à la première visite
const Planning = lazy(() => import('./pages/Planning'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="recette/:id" element={<Recipe />} />
        <Route path="courses" element={<ShoppingList />} />
        <Route path="planning" element={<Suspense fallback={<Status loading />}><Planning /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
