import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './router';
import './styles/global.css';

/**
 * SSG/Prerender-Entry (§15.4): vite-react-ssg rendert die statischen Routen vor (für den
 * googelnden Besucher) und hydratisiert im Browser. Die Schatzsuche bleibt clientseitig (§8.5).
 * Die CMS-Route (/admin) ist nur im Dev-Build in `routes` enthalten und wird nicht vorgerendert.
 */
export const createRoot = ViteReactSSG({ routes });
