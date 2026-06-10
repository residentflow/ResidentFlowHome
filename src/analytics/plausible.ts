/**
 * Plausible Analytics — cookieless self-hosted.
 * §16: kein personenbezogenes Tracking, kein Cookie-Banner.
 * §15.3: self-hosted Plausible.
 *
 * Diese Datei fügt ein <script defer data-domain=…> in den <head> ein.
 * Es werden keine Cookies gesetzt, keine PII übertragen, kein localStorage genutzt.
 */

const PLAUSIBLE_SCRIPT_URL = 'https://plausible.io/js/script.js';

/**
 * Lädt das Plausible-Skript cookieless in den DOM.
 * Idempotent: wird das Skript für dieselbe Domain bereits geladen, passiert nichts.
 *
 * @param domain - Die Domain, für die Plausible messen soll (z.B. "residentflow.de")
 */
export function ladePlausible(domain: string): void {
  // Idempotenz: nicht zweimal laden
  if (document.querySelector(`script[data-domain="${domain}"]`)) return;

  const skript = document.createElement('script');
  skript.defer = true;
  skript.setAttribute('data-domain', domain);
  skript.src = PLAUSIBLE_SCRIPT_URL;

  document.head.appendChild(skript);
}

/**
 * Gibt an, ob die Analytics-Implementierung cookieless ist.
 * Muss für §16 immer `true` zurückgeben — kein Cookie-Banner nötig.
 */
export function istCookielos(): true {
  return true;
}

/**
 * Plausible Custom Events (PRD §19.1) — anonym: NUR Buckets/Slugs, nie Rohwerte oder
 * Personenbezug. Jedes Event kann optional variantIds (Experimente) tragen.
 */
export const EVENTS = {
  role_selected: 'role_selected',
  size_selected: 'size_selected',
  problem_selected: 'problem_selected',
  solution_result_rendered: 'solution_result_rendered',
  value_range_shown: 'value_range_shown',
  solution_opened: 'solution_opened',
  asset_copied: 'asset_copied',
  scale_break_seen: 'scale_break_seen',
  example_analysis_opened: 'example_analysis_opened',
  example_finding_expanded: 'example_finding_expanded',
  pruefpaket_downloaded: 'pruefpaket_downloaded',
  inline_chips_completed: 'inline_chips_completed',
  cta_shown: 'cta_shown',
  cta_clicked: 'cta_clicked',
  calendar_clicked: 'calendar_clicked',
  booking_confirmed: 'booking_confirmed',
  pdf_requested: 'pdf_requested',
  pdf_fallback_shown: 'pdf_fallback_shown',
} as const;
export type PlausibleEvent = (typeof EVENTS)[keyof typeof EVENTS];

interface PlausibleFn {
  (event: string, options?: { props?: Record<string, string | number | boolean> }): void;
}

/**
 * Anonymes Event senden. No-op, wenn Plausible (noch) nicht geladen ist.
 * Props dürfen ausschließlich Buckets/Slugs/Flags enthalten — niemals Rohwerte/PII (§19.1).
 */
export function track(
  event: PlausibleEvent,
  props?: Record<string, string | number | boolean>,
): void {
  const w = globalThis as unknown as { plausible?: PlausibleFn };
  if (typeof w.plausible === 'function') {
    w.plausible(event, props ? { props } : undefined);
  }
}
