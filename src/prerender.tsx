/**
 * Prerender-Konfiguration — statische Routen für SSG/Prerender.
 * §9.1/§22: vorgerendert für den googelnden Besucher und No-JS-Lesbarkeit.
 * §13.1: /admin ist nur lokal/Dev erreichbar — NICHT im Prod-Build.
 */
import { checkConfig } from '@/config/checkConfig';

/** Lösungsseiten je live-fähigem Problem (Objekt-Gate-gefiltert im Build-Export). */
export const LOESUNGS_ROUTEN: string[] = checkConfig.problems.map((p) => `/loesungen/${p.slug}`);

/**
 * Alle statischen Routen, die vorgerendert (SSG) werden sollen.
 * /admin ist bewusst ausgeschlossen — CMS-Route nur lokal/Dev.
 */
export const ROUTEN_ZUM_PRERENDERN: string[] = [
  '/',
  ...LOESUNGS_ROUTEN,
  '/mietanpassungs-pruefpaket',
  '/methodik',
  '/founder',
  '/faq',
  '/impressum',
  '/datenschutz',
];

/**
 * Fallback-Hinweis für Besucher ohne JavaScript.
 * Der Bestands-Check ist JS-abhängig (§9.1/§18).
 */
export const NO_JS_HINWEIS =
  'Der Bestands-Check benötigt JavaScript. Bitte aktivieren Sie JavaScript in Ihrem Browser, ' +
  'um die Analyse zu nutzen — oder vereinbaren Sie direkt ein Gespräch.';
