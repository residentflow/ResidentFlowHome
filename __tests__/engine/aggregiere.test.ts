import { describe, it, expect } from 'vitest';
import { aggregiere, zaehleQualitative } from '@/domain/engine/aggregiere';
import type { LoesungLaufzeit } from '@/domain/types';

const quant1: LoesungLaufzeit = {
  loesungId: 'a',
  zustand: 'quantifiziert',
  rahmung: 'chance',
  spanne: { min: 2000, max: 4000 },
};
const quant2: LoesungLaufzeit = {
  loesungId: 'b',
  zustand: 'quantifiziert',
  rahmung: 'chance',
  spanne: { min: 6000, max: 9000 },
};
const qual: LoesungLaufzeit = {
  loesungId: 'c',
  zustand: 'relevant',
  rahmung: 'verlust',
  nutzenAussage: 'Risiko',
};

describe('aggregiere (§10.2)', () => {
  it('aggregiert das Gesamtpotenzial als Spanne (Summe min, Summe max)', () => {
    expect(aggregiere([quant1, quant2])).toEqual({ min: 8000, max: 13000 });
  });

  it('ignoriert qualitative Loesung in der Euro-Summe', () => {
    expect(aggregiere([quant1, qual])).toEqual({ min: 2000, max: 4000 });
  });

  it('liefert eine Null-Spanne {0,0}, wenn kein Loesung quantifiziert ist', () => {
    expect(aggregiere([qual])).toEqual({ min: 0, max: 0 });
  });
});

describe('zaehleQualitative', () => {
  it('zählt qualitative Loesung separat', () => {
    expect(zaehleQualitative([quant1, qual])).toBe(1);
  });
});
