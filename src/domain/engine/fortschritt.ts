import type { HebelLaufzeit, Fortschritt } from '../types';

/**
 * Fortschritt „x von y relevanten Bereichen analysiert" (§8.4, Zeigarnik-Effekt).
 * Analysiert = quantifiziert oder präzisiert — oder qualitativ (nutzenAussage statt Euro):
 * qualitative Hebel haben keine Detailfrage und sind mit ihrer Auswahl abgeschlossen,
 * sonst bliebe der Fortschritt dauerhaft unter 100 %. Leere Liste → Anteil 0 (kein NaN).
 */
export function fortschritt(laufzeiten: HebelLaufzeit[]): Fortschritt {
  const gesamt = laufzeiten.length;
  const analysiert = laufzeiten.filter(
    (l) =>
      l.zustand === 'quantifiziert' ||
      l.zustand === 'praezisiert' ||
      (l.zustand === 'relevant' && l.nutzenAussage !== undefined),
  ).length;
  return {
    analysiert,
    gesamt,
    anteil: gesamt === 0 ? 0 : analysiert / gesamt,
  };
}
