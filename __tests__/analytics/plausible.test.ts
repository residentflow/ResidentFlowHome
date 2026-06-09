import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ladePlausible, istCookielos } from '@/analytics/plausible';

describe('Plausible Analytics (cookieless)', () => {
  beforeEach(() => {
    // DOM-Cleanup: alle zuvor eingefügten Plausible-Skripte entfernen
    document.querySelectorAll('script[data-domain]').forEach((el) => el.remove());
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
    });
  });

  afterEach(() => {
    document.querySelectorAll('script[data-domain]').forEach((el) => el.remove());
  });

  it('initialisiert Plausible cookieless (data-domain, kein Cookie)', () => {
    ladePlausible('example.de');

    const skript = document.querySelector('script[data-domain]');
    expect(skript, 'Kein <script data-domain> gefunden').not.toBeNull();
    expect(skript!.getAttribute('data-domain')).toBe('example.de');
    expect(skript!.hasAttribute('defer')).toBe(true);

    // Kein Cookie gesetzt
    expect(document.cookie).toBe('');
  });

  it('sendet keine personenbezogenen Daten', () => {
    ladePlausible('example.de');

    const skript = document.querySelector('script[data-domain]');
    expect(skript).not.toBeNull();

    // Das Skript darf keine PII-Weitergabe über URL-Parameter erlauben
    const src = skript!.getAttribute('src') ?? '';
    expect(src).not.toContain('email');
    expect(src).not.toContain('userid');
    expect(src).not.toContain('user_id');

    // Kein localStorage/sessionStorage-Zugriff durch den Init-Code
    expect(localStorage.length).toBe(0);
  });

  it('erzeugt keinen Cookie-Banner (istCookielos()===true)', () => {
    expect(istCookielos()).toBe(true);
  });
});
