import { describe, it, expect } from 'vitest';
import {
  sizeScore,
  valueScore,
  istHighIntent,
  endAusgang,
} from '@/components/bestands-check/score';
import type { RoleCfg } from '@/config/checkConfig';

const buyAndHold: RoleCfg = {
  slug: 'buyAndHold',
  label: 'Buy & Hold',
  sizeMetric: { slug: 'eigene', frageWortlaut: 'x', buckets: [] },
  endAusgang: 'gespraech',
  allowMandatsCTA: true,
  sizeIndependent: false,
};
const steuerberater: RoleCfg = { ...buyAndHold, slug: 'steuerberater', sizeIndependent: true };
const thresholds = { buyAndHold: 3 };

describe('Score & Motor-Umschaltung (§10.3)', () => {
  it('sizeScore entspricht dem Bucket-Rang', () => {
    expect(sizeScore(3)).toBe(3);
    expect(sizeScore(null)).toBe(0);
  });

  it('valueScore: ertrag/effizienz=1, sonst 0.5', () => {
    expect(valueScore(['ertrag'])).toBe(1);
    expect(valueScore(['risiko'])).toBe(0.5);
    expect(valueScore(undefined)).toBe(0.5);
  });

  it('highIntent ab Schwelle: rank>=3 -> true, darunter -> false', () => {
    expect(istHighIntent({ rolle: buyAndHold, bucketRank: 3 }, thresholds)).toBe(true);
    expect(istHighIntent({ rolle: buyAndHold, bucketRank: 2 }, thresholds)).toBe(false);
  });

  it('Steuerberater (sizeIndependent) ist nie HighIntent über Größe und immer Partnerprogramm', () => {
    expect(istHighIntent({ rolle: steuerberater, bucketRank: 5 }, thresholds)).toBe(false);
    expect(endAusgang({ rolle: steuerberater, bucketRank: 5 }, thresholds)).toBe('partnerprogramm');
  });

  it('endAusgang: ab Schwelle Rollen-Ausgang, darunter nur-loesungen', () => {
    expect(endAusgang({ rolle: buyAndHold, bucketRank: 3 }, thresholds)).toBe('gespraech');
    expect(endAusgang({ rolle: buyAndHold, bucketRank: 1 }, thresholds)).toBe('nur-loesungen');
  });
});
