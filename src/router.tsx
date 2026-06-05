import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { FounderStory } from './components/content/FounderStory';
import { FAQ } from './components/content/FAQ';
import { Impressum } from './components/content/Impressum';
import { Datenschutz } from './components/content/Datenschutz';

/**
 * Routing der Landingpage. Die CMS-Route (/admin) ist eine reine Dev-Route und darf nicht in den
 * Prod-Build gelangen (§13.1) — sie wird nur unter import.meta.env.DEV hinzugefügt.
 */

const CMS_PFAD = '/admin';

export function istCmsRoute(pfad: string): boolean {
  return pfad === CMS_PFAD;
}

const basisRouten: RouteObject[] = [
  { path: '/', element: <LandingPage /> },
  { path: '/founder', element: <FounderStory /> },
  { path: '/faq', element: <FAQ /> },
  { path: '/impressum', element: <Impressum /> },
  { path: '/datenschutz', element: <Datenschutz /> },
];

// CMS nur im Dev-Build (§13.1). Dynamischer Import → CmsApp wird aus dem Prod-Bundle entfernt.
const devRouten: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: CMS_PFAD,
        lazy: async () => {
          const { CmsApp } = await import('./components/admin/CmsApp');
          return { Component: CmsApp };
        },
      },
    ]
  : [];

export const routes: RouteObject[] = [...basisRouten, ...devRouten];

export const router = createBrowserRouter(routes);
