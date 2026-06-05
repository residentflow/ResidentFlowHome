import { describe, it, expect } from 'vitest';
import { SegmentSchema } from '@/domain/schema/segment';

const basis = { taetigkeit: 'A', typ: 'kern', endAusgang: 'gespraech' };

describe('SegmentSchema (§3.3/§13.4/§14)', () => {
  it('akzeptiert ein Segment mit gültigem End-Ausgang', () => {
    expect(SegmentSchema.safeParse(basis).success).toBe(true);
  });

  it('lehnt ein Segment ohne endAusgang ab', () => {
    const { endAusgang: _e, ...ohne } = basis;
    void _e;
    expect(SegmentSchema.safeParse(ohne).success).toBe(false);
  });

  it('lehnt einen unbekannten endAusgang ab', () => {
    expect(SegmentSchema.safeParse({ ...basis, endAusgang: 'demo-buchen' }).success).toBe(false);
  });

  it('akzeptiert die End-Ausgänge gespraech, partnerprogramm und nur-playbook', () => {
    for (const e of ['gespraech', 'partnerprogramm', 'nur-playbook']) {
      expect(SegmentSchema.safeParse({ ...basis, endAusgang: e }).success).toBe(true);
    }
  });
});
