import { describe, it, expect } from 'vitest';
import { fortschritt } from '@/domain/engine/fortschritt';
import type { HebelLaufzeit } from '@/domain/types';

const relevant = (id: string): HebelLaufzeit => ({
  hebelId: id,
  zustand: 'relevant',
  rahmung: 'chance',
});
const quantifiziert = (id: string): HebelLaufzeit => ({
  hebelId: id,
  zustand: 'quantifiziert',
  rahmung: 'chance',
  spanne: { min: 1, max: 2 },
});

describe('fortschritt (§8.4 "x von y analysiert")', () => {
  it('zählt quantifizierte/präzisierte Hebel als analysiert', () => {
    const f = fortschritt([quantifiziert('a'), relevant('b'), relevant('c')]);
    expect(f.analysiert).toBe(1);
    expect(f.gesamt).toBe(3);
  });

  it('liefert 0 von y zu Beginn', () => {
    const f = fortschritt([relevant('a'), relevant('b')]);
    expect(f.analysiert).toBe(0);
    expect(f.anteil).toBe(0);
  });

  it('liefert y von y und Anteil 1 am Ende', () => {
    const f = fortschritt([quantifiziert('a'), quantifiziert('b')]);
    expect(f.analysiert).toBe(2);
    expect(f.anteil).toBe(1);
  });

  it('liefert bei leerer Liste einen Anteil von 0 (kein NaN)', () => {
    expect(fortschritt([]).anteil).toBe(0);
  });

  it('zählt qualitative Hebel (nutzenAussage, keine Detailfrage) als analysiert', () => {
    const qualitativ: HebelLaufzeit = {
      hebelId: 'expose-optimierung',
      zustand: 'relevant',
      rahmung: 'chance',
      nutzenAussage: 'Bessere Exposés ziehen mehr qualifizierte Interessenten an.',
    };
    const f = fortschritt([quantifiziert('a'), qualitativ]);
    expect(f.analysiert).toBe(2);
    expect(f.anteil).toBe(1);
  });
});
