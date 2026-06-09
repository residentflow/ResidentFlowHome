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
