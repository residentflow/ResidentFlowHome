import { type RouteObject } from 'react-router-dom';
import type { ReactNode, ReactElement } from 'react';
import { LandingPage } from './pages/LandingPage';
import { FounderStory } from './components/content/FounderStory';
import { FAQ } from './components/content/FAQ';
import { Impressum } from './components/content/Impressum';
import { Datenschutz } from './components/content/Datenschutz';
import { NichtGefunden } from './components/content/NichtGefunden';
import { Footer } from './components/ui/Footer';

/** Jede Seite bekommt den Footer (Impressum/Datenschutz müssen von überall erreichbar sein). */
function mitFooter(element: ReactNode): ReactElement {
  return (
    <>
      {element}
      <Footer />
    </>
  );
}

/**
 * Routing der Landingpage. Die CMS-Route (/admin) ist eine reine Dev-Route und darf nicht in den
 * Prod-Build gelangen (§13.1) — sie wird nur unter import.meta.env.DEV hinzugefügt.
 */

const CMS_PFAD = '/admin';

export function istCmsRoute(pfad: string): boolean {
  return pfad === CMS_PFAD;
}

const basisRouten: RouteObject[] = [
  { path: '/', element: mitFooter(<LandingPage />) },
  { path: '/founder', element: mitFooter(<FounderStory />) },
  { path: '/faq', element: mitFooter(<FAQ />) },
  { path: '/impressum', element: mitFooter(<Impressum />) },
  { path: '/datenschutz', element: mitFooter(<Datenschutz />) },
  // Catch-all: gestaltete 404 statt React-Router-Fehlermeldung. Nicht prerendern (kein statischer Pfad).
  { path: '*', element: mitFooter(<NichtGefunden />) },
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
