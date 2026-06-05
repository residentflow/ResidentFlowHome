import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { App } from './App';

/**
 * Routing-Skelett (M0). Inhaltsseiten-Komponenten werden in M7 ergänzt, hier zunächst als
 * Lazy-Platzhalter über App referenziert. Die CMS-Route (/admin) ist eine reine Dev-Route und
 * darf nicht in den Prod-Build gelangen (§13.1) — sie wird nur unter import.meta.env.DEV hinzugefügt.
 */

const CMS_PFAD = '/admin';

export function istCmsRoute(pfad: string): boolean {
  return pfad === CMS_PFAD;
}

const basisRouten: RouteObject[] = [
  { path: '/', element: <App /> },
  { path: '/founder', element: <App /> },
  { path: '/faq', element: <App /> },
  { path: '/impressum', element: <App /> },
  { path: '/datenschutz', element: <App /> },
];

const devRouten: RouteObject[] = import.meta.env.DEV
  ? [{ path: CMS_PFAD, element: <App /> }]
  : [];

export const routes: RouteObject[] = [...basisRouten, ...devRouten];

export const router = createBrowserRouter(routes);
