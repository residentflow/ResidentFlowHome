import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './router';
import './styles/global.css';

/**
 * SSG/Prerender-Entry (§9.1/§22): vite-react-ssg rendert die statischen Routen vor (für den
 * googelnden Besucher) und hydratisiert im Browser. Der Bestands-Check bleibt clientseitig (§10).
 * Die dynamische Route /loesungen/:slug wird über ssgOptions.includedRoutes (vite.config.ts)
 * auf die live-fähigen Slugs expandiert. Die CMS-Route (/admin) ist nur im Dev-Build enthalten.
 */
export const createRoot = ViteReactSSG({ routes });
