import { describe, it, expect } from 'vitest';
import { schatzsucheConfig } from '@/content/schatzsuche.config';

/**
 * Playbook-Schwerpunkte (§6, fokussierte Methodenbibliothek):
 * genau 6 ergebnisorientierte Schwerpunkte ersetzen die früheren 8 Lebenszyklus-Phasen.
 */
const ERWARTETE_TITEL = [
  'Bessere Deals finden',
  'Cashflow & Rendite steigern',
  'Leerstand reduzieren',
  'Verwaltung automatisieren',
  'Projekte erfolgreich entwickeln',
  'KI professionell nutzen',
];

describe('Playbook-Schwerpunkte (Methodenbibliothek)', () => {
  it('enthält genau 6 Schwerpunkte', () => {
    expect(schatzsucheConfig.phasen).toHaveLength(6);
  });

  it('führt die erwarteten Cover-Titel in der richtigen Reihenfolge', () => {
    const sortiert = [...schatzsucheConfig.phasen].sort((a, b) => a.reihenfolge - b.reihenfolge);
    expect(sortiert.map((p) => p.name)).toEqual(ERWARTETE_TITEL);
  });

  it('hat für jeden Schwerpunkt eine nicht-leere Beschreibung in Sie-Form', () => {
    for (const p of schatzsucheConfig.phasen) {
      expect(p.beschreibung, `Schwerpunkt "${p.name}" ohne Beschreibung`).toBeTruthy();
      expect((p.beschreibung ?? '').length).toBeGreaterThan(30);
      // Sie-Form: keine 'du'-Ansprache am Satzanfang
      expect(p.beschreibung).not.toMatch(/\bdu\b/i);
    }
  });

  it('jeder Loesung verweist auf einen existierenden Schwerpunkt (1–6)', () => {
    const ids = new Set(schatzsucheConfig.phasen.map((p) => p.id));
    for (const h of schatzsucheConfig.loesung) {
      expect(ids.has(h.lebenszyklusPhase), `Loesung "${h.id}" → ${h.lebenszyklusPhase}`).toBe(true);
    }
  });

  it('verwendet das Wort "Kurs" nicht in den Schwerpunkt-Titeln/Beschreibungen', () => {
    const text = schatzsucheConfig.phasen.map((p) => `${p.name} ${p.beschreibung ?? ''}`).join(' ');
    expect(text).not.toMatch(/Kurs/i);
  });
});
