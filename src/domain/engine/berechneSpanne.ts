import type { Formel } from '../schema/formel';
import type { Spanne } from '../schema/spanne';

function eingabeProdukt(inputs: Record<string, number>, formel: Formel): number {
  return formel.inputs.reduce((acc, key) => acc * (inputs[key] ?? 1), 1);
}

/**
 * Berechnet die Potenzial-Spanne: Eingaben × Benchmark-Spannen → {min, max} (§7).
 * Konservativ: min nutzt die unteren Faktor-Grenzen, max die oberen.
 * Erzwingt den Spannen-Zwang: ein kollabiertes Ergebnis (min ≥ max) wird abgelehnt.
 */
export function berechneSpanne(inputs: Record<string, number>, formel: Formel): Spanne {
  const produkt = eingabeProdukt(inputs, formel);
  const faktoren = Object.values(formel.faktoren);
  const minFaktor = faktoren.reduce((acc, f) => acc * f.min, 1);
  const maxFaktor = faktoren.reduce((acc, f) => acc * f.max, 1);

  const min = produkt * minFaktor;
  const max = produkt * maxFaktor;

  if (!(min < max)) {
    throw new Error(
      `Berechnung ergäbe einen Punktwert (min=${min}, max=${max}) — verletzt den Spannen-Zwang (§7).`,
    );
  }

  return { min, max };
}

/** Sichtbarer, nachvollziehbarer Rechenweg mit den konkreten Faktorwerten (§7). */
export function rechenweg(inputs: Record<string, number>, formel: Formel): string {
  const eingabeTeile = formel.inputs.map((key) => `${key}=${inputs[key] ?? '?'}`).join(' × ');
  const faktorTeile = Object.entries(formel.faktoren)
    .map(([name, f]) => `${name} (${f.min}–${f.max})`)
    .join(' × ');
  return `${eingabeTeile} × ${faktorTeile} → ${formel.rechenwegText}`;
}
