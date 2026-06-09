import { describe, it, expect } from 'vitest';
import { berechneSpanne, rechenweg } from '@/domain/engine/berechneSpanne';
import type { Formel } from '@/domain/schema/formel';

// §7-Rechenbeispiel: 5 Neuvermietungen × Ø-Miete × Verkürzung (als Monatsanteil) ≈ 2.700–3.600 €.
const stagingFormel: Formel = {
  inputs: ['neuvermietungenProJahr'],
  faktoren: {
    mieteProMonat: { min: 580, max: 620 },
    verkuerzungMonatsanteil: { min: 0.9, max: 1.2 },
  },
  ausgabe: { min: 2700, max: 3600 },
  einheit: '€ p.a.',
  rechenwegText: 'Neuvermietungen × Ø-Miete (580–620 €) × Verkürzung (0,9–1,2 Monate)',
};

describe('berechneSpanne (§7 Rechenbeispiel Virtuelles Staging)', () => {
  it('berechnet 5 Neuvermietungen ≈ 2.700–3.600 € p.a. (konservative Spanne)', () => {
    const s = berechneSpanne({ neuvermietungenProJahr: 5 }, stagingFormel);
    expect(s.min).toBeGreaterThanOrEqual(2000);
    expect(s.min).toBeLessThanOrEqual(2800);
    expect(s.max).toBeGreaterThanOrEqual(3000);
    expect(s.max).toBeLessThanOrEqual(3800);
  });

  it('liefert immer min < max (Spanne, nie Punktwert)', () => {
    const s = berechneSpanne({ neuvermietungenProJahr: 5 }, stagingFormel);
    expect(s.min).toBeLessThan(s.max);
  });

  it('rechnet konservativ: min nutzt die untere Faktor-Grenze', () => {
    const s = berechneSpanne({ neuvermietungenProJahr: 5 }, stagingFormel);
    expect(s.min).toBeCloseTo(5 * 580 * 0.9, 5);
  });

  it('skaliert linear mit der Nutzereingabe', () => {
    const s5 = berechneSpanne({ neuvermietungenProJahr: 5 }, stagingFormel);
    const s10 = berechneSpanne({ neuvermietungenProJahr: 10 }, stagingFormel);
    expect(s10.max).toBeCloseTo(2 * s5.max, 5);
  });

  it('wirft, wenn die Berechnung einen Punktwert ergäbe (Spannen-Zwang §7)', () => {
    const kollabiert = {
      ...stagingFormel,
      faktoren: { faktor: { min: 100, max: 100 } },
      inputs: ['x'],
    } as unknown as Formel;
    expect(() => berechneSpanne({ x: 5 }, kollabiert)).toThrow();
  });

  it('liefert einen sichtbaren, nachvollziehbaren Rechenweg mit den Faktorwerten', () => {
    expect(rechenweg({ neuvermietungenProJahr: 5 }, stagingFormel)).toContain('580');
  });
});
