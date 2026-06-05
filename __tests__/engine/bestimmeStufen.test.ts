import { describe, it, expect } from 'vitest';
import { bestimmeStufen } from '@/domain/engine/bestimmeStufen';
import { routing } from '@/domain/engine/routing';

describe('bestimmeStufen (§10.1)', () => {
  it('schaltet Stufe 1 und 2 immer frei', () => {
    const s = bestimmeStufen(routing(['buyAndHold'], { A: 10 }));
    expect(s.stufe1).toBe(true);
    expect(s.stufe2).toBe(true);
  });

  it('schaltet Stufe 3 ab Schwelle für Bestandshalter (A) frei', () => {
    expect(bestimmeStufen(routing(['buyAndHold'], { A: 50 })).stufe3).toBe(true);
  });

  it('schaltet Stufe 3 ab Schwelle für B-verwaltend frei', () => {
    expect(bestimmeStufen(routing(['hausverwaltung'], { B: 80 })).stufe3).toBe(true);
  });

  it('schaltet Stufe 3 NICHT unter Schwelle frei', () => {
    expect(bestimmeStufen(routing(['buyAndHold'], { A: 49 })).stufe3).toBe(false);
  });

  it('schaltet Stufe 3 NICHT für Steuerberater frei', () => {
    expect(bestimmeStufen(routing(['steuerberater'], { B: 500 })).stufe3).toBe(false);
  });

  it('schaltet Stufe 3 NICHT für Makler frei', () => {
    expect(bestimmeStufen(routing(['makler'], { B: 500 })).stufe3).toBe(false);
  });

  it('schaltet Stufe 3 NICHT für Projektentwicklung/Fix & Flip frei', () => {
    expect(bestimmeStufen(routing(['projektentwicklung'], { C: 100 })).stufe3).toBe(false);
    expect(bestimmeStufen(routing(['fixAndFlip'], { C: 100 })).stufe3).toBe(false);
  });
});
