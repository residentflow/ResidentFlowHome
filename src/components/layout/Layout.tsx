import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Nav } from './Nav';
import { Footer } from './Footer';

/**
 * Gemeinsames Seitenlayout (Richtung A): Kopf-Navigation, Seiteninhalt, Footer.
 * Nimmt entweder explizite `children` (flache Routen, router.tsx) oder rendert ein <Outlet/>.
 */
export function Layout({ children }: { children?: ReactNode }) {
  return (
    <>
      <Nav />
      {children ?? <Outlet />}
      <Footer />
    </>
  );
}
