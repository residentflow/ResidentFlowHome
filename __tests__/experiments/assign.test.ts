import { describe, it, expect } from 'vitest';
import { assignVariant, assignAll, hash01 } from '@/domain/experiments/assign';

const h1 = {
  name: 'h1-variante',
  variants: [
    { id: 'A', weight: 1 },
    { id: 'B', weight: 1 },
    { id: 'C', weight: 1 },
  ],
};

describe('Experiment-Zuteilung (§19.3)', () => {
  it('hash01 ist deterministisch und in [0,1)', () => {
    expect(hash01('x')).toBe(hash01('x'));
    expect(hash01('x')).toBeGreaterThanOrEqual(0);
    expect(hash01('x')).toBeLessThan(1);
  });

  it('gleicher Seed → gleiche Variante (hash-stabil)', () => {
    const v1 = assignVariant(h1, 'besucher-42');
    const v2 = assignVariant(h1, 'besucher-42');
    expect(v1).toBe(v2);
    expect(['A', 'B', 'C']).toContain(v1);
  });

  it('trafficAllocation < 1 schließt einen Teil aus (null)', () => {
    const exp = { ...h1, trafficAllocation: 0 };
    expect(assignVariant(exp, 'irgendwer')).toBeNull();
  });

  it('assignAll liefert eine Variante je laufendem Experiment', () => {
    const res = assignAll([h1], 'seed');
    expect(Object.keys(res)).toContain('h1-variante');
  });

  it('Gewichte verteilen über viele Seeds grob gleich (Sanity)', () => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0 };
    for (let i = 0; i < 600; i++) {
      const v = assignVariant(h1, `s${i}`)!;
      counts[v]++;
    }
    // Jede Variante kommt vor (keine tote Zuteilung)
    expect(counts.A).toBeGreaterThan(0);
    expect(counts.B).toBeGreaterThan(0);
    expect(counts.C).toBeGreaterThan(0);
  });
});
