/**
 * Prerender-Konfiguration — statische Routen für SSG/Prerender.
 * §15.4: vorgerendert für den googelnden Besucher.
 * §13.1: /admin ist nur lokal/Dev erreichbar — NICHT im Prod-Build.
 */

/**
 * Alle statischen Routen, die vorgerendert (SSG) werden sollen.
 * /admin ist bewusst ausgeschlossen — CMS-Route nur lokal/Dev.
 */
export const ROUTEN_ZUM_PRERENDERN: string[] = [
  '/',
  '/founder',
  '/faq',
  '/impressum',
  '/datenschutz',
];

/**
 * Fallback-Hinweis für Besucher ohne JavaScript.
 * Die Schatzsuche (Bestandspotenzial-Analyse) ist JS-abhängig.
 * §15.4: „Suche ist JS-only → klarer No-JS-Hinweis-Fallback"
 */
export const NO_JS_HINWEIS =
  'Die Bestandspotenzial-Suche (Schatzsuche) benötigt JavaScript. ' +
  'Bitte aktivieren Sie JavaScript in Ihrem Browser, um alle Funktionen nutzen zu können.';
