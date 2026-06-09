import { describe, it, expect } from 'vitest';
import { initialerZustand, uebergang } from '@/domain/engine/zustandsmaschine';
import type { Hebel } from '@/domain/schema/hebel';

const quantHebel: Hebel = {
  id: 'staging',
  name: 'Virtuelles Staging',
  lebenszyklusPhase: 3,
  wertKategorie: 'ertrag',
  rahmung: 'chance',
  quantifizierbar: true,
  taetigkeiten: ['B'],
  detailFragen: ['neuvermietungenProJahr'],
  berechnung: {
    inputs: ['neuvermietungenProJahr'],
    faktoren: {
      mieteProMonat: { min: 550, max: 650 },
      verkuerzungWochen: { min: 3, max: 4 },
    },
    ausgabe: { min: 2700, max: 3600 },
    einheit: '€ p.a.',
    rechenwegText: 'Neuvermietungen × Ø-Miete × Verkürzung',
  },
  playbookLink: '#',
  kartenText: 't',
};

const qualHebel: Hebel = {
  id: 'fristen',
  name: 'Fristenüberwachung',
  lebenszyklusPhase: 5,
  wertKategorie: 'risiko',
  rahmung: 'verlust',
  quantifizierbar: false,
  taetigkeiten: ['A'],
  detailFragen: [],
  nutzenAussage: 'Verhindert übersehene Fristen.',
  playbookLink: '#',
  kartenText: 't',
};

describe('Zustandsmaschine relevant → quantifiziert → präzisiert (§7)', () => {
  it('ein Hebel startet im Zustand relevant ohne Euro-Spanne', () => {
    const z = initialerZustand(quantHebel);
    expect(z.zustand).toBe('relevant');
    expect(z.spanne).toBeUndefined();
  });

  it('ein Risiko-Hebel zeigt im Zustand relevant einen Risiko-Hinweis und keine Euro-Zahl', () => {
    const z = initialerZustand(qualHebel);
    expect(z.risikoHinweis).toBeTruthy();
    expect(z.spanne).toBeUndefined();
  });

  it('ein quantifizierbarer Hebel wechselt nach Detailangabe zu quantifiziert mit Spanne', () => {
    const z = uebergang(initialerZustand(quantHebel), quantHebel, { neuvermietungenProJahr: 5 });
    expect(z.zustand).toBe('quantifiziert');
    expect(z.spanne).toBeDefined();
    expect(z.spanne!.min).toBeLessThan(z.spanne!.max);
  });

  it('ein qualitativer Hebel bleibt relevant und trägt eine nutzenAussage statt Euro', () => {
    const z = uebergang(initialerZustand(qualHebel), qualHebel, {});
    expect(z.zustand).toBe('relevant');
    expect(z.nutzenAussage).toBeTruthy();
    expect(z.spanne).toBeUndefined();
  });

  it('ohne vollständige Detailangaben bleibt der quantifizierbare Hebel relevant (keine Euro-Zahl)', () => {
    const z = uebergang(initialerZustand(quantHebel), quantHebel, {});
    expect(z.zustand).toBe('relevant');
    expect(z.spanne).toBeUndefined();
  });

  it('weitere Detailangaben präzisieren und verengen die Spanne', () => {
    const erst = uebergang(initialerZustand(quantHebel), quantHebel, { neuvermietungenProJahr: 5 });
    const praez = uebergang(erst, quantHebel, {
      neuvermietungenProJahr: 5,
      mieteBekannt: 600,
    });
    expect(praez.zustand).toBe('praezisiert');
    const breiteErst = erst.spanne!.max - erst.spanne!.min;
    const breitePraez = praez.spanne!.max - praez.spanne!.min;
    expect(breitePraez).toBeLessThanOrEqual(breiteErst);
  });
});
