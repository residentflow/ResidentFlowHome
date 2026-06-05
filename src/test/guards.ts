import { expect, vi } from 'vitest';

/**
 * Wiederverwendbare Test-Wächter für die rote Linie §8.5 / §17:
 * Die Schatzsuche überträgt nichts — kein fetch, kein Cookie, keine Speicherung.
 *
 * Verwendung:
 *   const wache = installiereWaechter();
 *   // ... Interaktion ...
 *   wache.erwarteKeinNetzwerk();
 *   wache.erwarteKeineSpeicherung();
 *   wache.erwarteKeinCookie();
 *   wache.aufraeumen();
 */
export interface SuchWaechter {
  erwarteKeinNetzwerk(): void;
  erwarteKeineSpeicherung(): void;
  erwarteKeinCookie(): void;
  aufraeumen(): void;
}

export function installiereWaechter(): SuchWaechter {
  const fetchSpy = vi.fn();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = fetchSpy as unknown as typeof fetch;

  const xhrOpenSpy = vi.spyOn(XMLHttpRequest.prototype, 'open');
  const localSetSpy = vi.spyOn(Storage.prototype, 'setItem');

  const cookieVorher = document.cookie;

  return {
    erwarteKeinNetzwerk() {
      expect(fetchSpy, 'Die Suche darf kein fetch auslösen').not.toHaveBeenCalled();
      expect(xhrOpenSpy, 'Die Suche darf kein XHR öffnen').not.toHaveBeenCalled();
    },
    erwarteKeineSpeicherung() {
      expect(
        localSetSpy,
        'Die Suche darf nicht in localStorage/sessionStorage schreiben',
      ).not.toHaveBeenCalled();
    },
    erwarteKeinCookie() {
      expect(document.cookie, 'Die Suche darf kein Cookie setzen').toBe(cookieVorher);
    },
    aufraeumen() {
      globalThis.fetch = originalFetch;
      xhrOpenSpy.mockRestore();
      localSetSpy.mockRestore();
    },
  };
}
