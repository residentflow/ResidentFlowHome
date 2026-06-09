import type { HebelLaufzeit } from '../types';
import type { Spanne } from '../schema/spanne';

/**
 * Gesamtpotenzial als Spanne: Summe der min, Summe der max über quantifizierte/präzisierte
 * Hebel (§10.2). Qualitative Hebel zählen nie als Euro. Liefert {0,0}, wenn nichts quantifiziert ist.
 */
export function aggregiere(laufzeiten: HebelLaufzeit[]): Spanne {
  return laufzeiten.reduce<Spanne>(
    (acc, l) => {
      if (!l.spanne) return acc;
      return { min: acc.min + l.spanne.min, max: acc.max + l.spanne.max };
    },
    { min: 0, max: 0 },
  );
}

/** Zählt qualitative Hebel (ohne Euro-Spanne) separat (§8.2). */
export function zaehleQualitative(laufzeiten: HebelLaufzeit[]): number {
  return laufzeiten.filter((l) => !l.spanne).length;
}
