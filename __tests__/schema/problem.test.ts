import { describe, it, expect } from 'vitest';
import { ProblemSchema } from '@/domain/schema/problem';

const basis = {
  id: 'p1',
  schmerzBereich: 'ertrag',
  text: 'Mieterhöhungen werden nicht konsequent gezogen',
  rollenFilter: ['buyAndHold'],
  verknuepfteLoesung: ['h1'],
  aktiv: true,
};

describe('ProblemSchema (§5.3/§14)', () => {
  it('akzeptiert ein Problem mit mindestens einem verknüpften Loesung', () => {
    expect(ProblemSchema.safeParse(basis).success).toBe(true);
  });

  it('lehnt ein Problem ohne verknüpften Loesung ab', () => {
    expect(ProblemSchema.safeParse({ ...basis, verknuepfteLoesung: [] }).success).toBe(false);
  });

  it('verlangt schmerzBereich, text und rollenFilter', () => {
    const { schmerzBereich: _s, ...ohne } = basis;
    void _s;
    expect(ProblemSchema.safeParse(ohne).success).toBe(false);
  });

  it('erlaubt eine optionale größenBedingung', () => {
    const mit = { ...basis, groessenBedingung: { minEinheiten: 50 } };
    expect(ProblemSchema.safeParse(mit).success).toBe(true);
  });
});
