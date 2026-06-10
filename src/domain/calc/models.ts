/**
 * CalculationModels M1–M4 (PRD §13) — framework-frei, rein, testbar.
 * Outputs sind Spannen {min,max} in €, auf 100 € gerundet, konservativ. min<max erzwungen.
 * Risiko (M4) liefert NIE eine €-Rechnung. Eingaben sind Benchmark-Spannen (nicht-Platzhalter)
 * plus Selbstauskunft; ohne quantifizierende Benchmarks bleibt das Ergebnis qualitativ (null).
 */

export interface Spanne {
  min: number;
  max: number;
}

export function roundTo100(n: number): number {
  return Math.round(n / 100) * 100;
}

/** Spanne auf 100 € runden und min<max sicherstellen (sonst um 100 € spreizen). */
export function spanne(min: number, max: number): Spanne {
  let lo = roundTo100(Math.min(min, max));
  let hi = roundTo100(Math.max(min, max));
  if (lo === hi) hi = lo + 100;
  return { min: lo, max: hi };
}

export interface M1Inputs {
  units: number;
  shareUnreviewed: Spanne; // shareContractsUnreviewed24m
  upliftPerContract: Spanne; // avgUpliftPerAffectedContract (€/Monat)
}

/** M1 Index-/Staffelmieten (Ertrag, Leitlösung). affected×uplift×12. */
export function berechneM1(i: M1Inputs): Spanne {
  const affectedMin = i.units * i.shareUnreviewed.min;
  const affectedMax = i.units * i.shareUnreviewed.max;
  const min = affectedMin * i.upliftPerContract.min * 12;
  const max = affectedMax * i.upliftPerContract.max * 12;
  return spanne(min, max);
}

export interface M2Inputs {
  units: number;
  adminMinutesPerUnitMonth: Spanne;
  stundensatz?: Spanne; // optional → sekundär € (Zeit zuerst)
}
export interface M2Ergebnis {
  stundenProMonat: Spanne;
  euroProJahr?: Spanne;
}

/** M2 Verwaltungsaufwand (Effizienz). Primär Std./Monat, sekundär €/Jahr. */
export function berechneM2(i: M2Inputs): M2Ergebnis {
  const hMin = (i.units * i.adminMinutesPerUnitMonth.min) / 60;
  const hMax = (i.units * i.adminMinutesPerUnitMonth.max) / 60;
  const stundenProMonat = {
    min: Math.round(hMin),
    max: Math.max(Math.round(hMax), Math.round(hMin) + 1),
  };
  if (!i.stundensatz) return { stundenProMonat };
  const euroProJahr = spanne(hMin * i.stundensatz.min * 12, hMax * i.stundensatz.max * 12);
  return { stundenProMonat, euroProJahr };
}

export interface M3Inputs {
  relettingsPerYear?: number;
  avgMonthlyRent: Spanne;
  verkuerzungMonate?: Spanne; // 0,5–1,0 Monat
}

/** M3 Leerstand (Ertrag). Ohne relettings qualitativ (null). */
export function berechneM3(i: M3Inputs): Spanne | null {
  if (!i.relettingsPerYear) return null;
  const v = i.verkuerzungMonate ?? { min: 0.5, max: 1.0 };
  return spanne(
    i.relettingsPerYear * i.avgMonthlyRent.min * v.min,
    i.relettingsPerYear * i.avgMonthlyRent.max * v.max,
  );
}

/** M4 Fristen-Risiko (Risiko) — keine €-Rechnung, nur Wahrscheinlichkeits-Aussage (§13). */
export function berechneM4(units: number): { min: number; max: number; qualitativ: true } {
  // Statistische Anpassungsfenster pro Jahr (konservative, einheitenproportionale Spanne)
  return {
    min: Math.max(1, Math.round(units / 50)),
    max: Math.max(2, Math.round(units / 20)),
    qualitativ: true,
  };
}
