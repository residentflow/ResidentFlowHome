import { describe, it, expect } from 'vitest';
import { FormelSchema } from '@/domain/schema/formel';

const basis = {
  inputs: ['neuvermietungenProJahr'],
  faktoren: { mieteProMonat: { min: 550, max: 650 }, verkuerzungWochen: { min: 3, max: 4 } },
  ausgabe: { min: 2700, max: 3600 },
  einheit: '€ p.a.',
  rechenwegText: 'Eingaben × Benchmark-Spannen',
};

describe('FormelSchema (§7/§14)', () => {
  it('akzeptiert eine gültige Formel mit Spannen-Ausgabe', () => {
    expect(FormelSchema.safeParse(basis).success).toBe(true);
  });

  it('lehnt einen Punktwert als Ausgabe ab (min === max)', () => {
    expect(FormelSchema.safeParse({ ...basis, ausgabe: { min: 3000, max: 3000 } }).success).toBe(
      false,
    );
  });

  it('erzwingt Benchmark-Faktoren als Spannen', () => {
    const punktFaktor = { ...basis, faktoren: { mieteProMonat: { min: 600, max: 600 } } };
    expect(FormelSchema.safeParse(punktFaktor).success).toBe(false);
  });

  it('verlangt rechenwegText', () => {
    const { rechenwegText: _r, ...ohne } = basis;
    void _r;
    expect(FormelSchema.safeParse(ohne).success).toBe(false);
  });

  it('verlangt mindestens einen Input', () => {
    expect(FormelSchema.safeParse({ ...basis, inputs: [] }).success).toBe(false);
  });
});
