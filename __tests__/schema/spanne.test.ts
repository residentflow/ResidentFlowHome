import { describe, it, expect } from 'vitest';
import { SpanneSchema } from '@/domain/schema/spanne';

describe('SpanneSchema (Spannen-Zwang §7/§14/§17)', () => {
  it('akzeptiert eine Spanne mit min < max', () => {
    expect(SpanneSchema.safeParse({ min: 100, max: 200 }).success).toBe(true);
  });

  it('lehnt einen Punktwert ab (min === max)', () => {
    expect(SpanneSchema.safeParse({ min: 150, max: 150 }).success).toBe(false);
  });

  it('lehnt min > max ab', () => {
    expect(SpanneSchema.safeParse({ min: 200, max: 100 }).success).toBe(false);
  });

  it('lehnt negative Werte ab (konservativ, keine negativen Potenziale)', () => {
    expect(SpanneSchema.safeParse({ min: -10, max: 100 }).success).toBe(false);
  });

  it('lehnt fehlende Felder ab', () => {
    expect(SpanneSchema.safeParse({ min: 100 }).success).toBe(false);
  });
});
