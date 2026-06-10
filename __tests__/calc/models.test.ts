import { describe, it, expect } from 'vitest';
import { berechneM1, berechneM2, berechneM3, berechneM4, spanne } from '@/domain/calc/models';

describe('CalculationModels M1–M4 (§13)', () => {
  it('spanne(): rundet auf 100 € und erzwingt min<max', () => {
    expect(spanne(1234, 5678)).toEqual({ min: 1200, max: 5700 });
    const s = spanne(500, 540); // beide runden auf 500 → spreizen
    expect(s.min).toBeLessThan(s.max);
  });

  it('M1 Indexmieten: affected × uplift × 12, als gerundete Spanne min<max', () => {
    const r = berechneM1({
      units: 150,
      shareUnreviewed: { min: 0.2, max: 0.4 },
      upliftPerContract: { min: 40, max: 90 },
    });
    // min = 150*0.2*40*12 = 14400 ; max = 150*0.4*90*12 = 64800
    expect(r).toEqual({ min: 14400, max: 64800 });
    expect(r.min).toBeLessThan(r.max);
  });

  it('M2 Verwaltungsaufwand: Stunden/Monat zuerst, € nur mit Stundensatz', () => {
    const ohne = berechneM2({ units: 150, adminMinutesPerUnitMonth: { min: 10, max: 20 } });
    expect(ohne.stundenProMonat.min).toBe(25); // 150*10/60
    expect(ohne.euroProJahr).toBeUndefined();
    const mit = berechneM2({
      units: 150,
      adminMinutesPerUnitMonth: { min: 10, max: 20 },
      stundensatz: { min: 60, max: 90 },
    });
    expect(mit.euroProJahr).toBeDefined();
    expect(mit.euroProJahr!.min).toBeLessThan(mit.euroProJahr!.max);
  });

  it('M3 Leerstand: ohne relettings qualitativ (null), mit relettings Spanne', () => {
    expect(berechneM3({ avgMonthlyRent: { min: 600, max: 900 } })).toBeNull();
    const r = berechneM3({ relettingsPerYear: 10, avgMonthlyRent: { min: 600, max: 900 } });
    expect(r).not.toBeNull();
    expect(r!.min).toBeLessThan(r!.max);
  });

  it('M4 Fristen-Risiko: keine €-Rechnung, einheitenproportionale Fenster-Spanne', () => {
    const r = berechneM4(150);
    expect(r.qualitativ).toBe(true);
    expect(r.min).toBeLessThanOrEqual(r.max);
  });
});
