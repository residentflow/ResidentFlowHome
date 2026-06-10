/**
 * Experiment-Zuteilung (PRD §19.3) — clientseitig hash-stabil, framework-frei, rein.
 * Gleicher Seed (Besucher) → gleiche Variante. Definitionen kommen aus dem Bundle
 * (check.config.json), damit Varianten ohne Deploy testbar sind. Erfolgsmetrik: booking_confirmed.
 */
export interface ExperimentVariant {
  id: string;
  weight: number;
}
export interface ExperimentDef {
  name: string;
  variants: ExperimentVariant[];
  trafficAllocation?: number;
}

/** Deterministischer 32-bit-Hash (FNV-1a) → [0,1). */
export function hash01(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // auf [0,1) normalisieren
  return ((h >>> 0) % 100000) / 100000;
}

/** Variante hash-stabil nach Gewichten wählen. null, wenn außerhalb trafficAllocation. */
export function assignVariant(exp: ExperimentDef, seed: string): string | null {
  const r = hash01(`${exp.name}:${seed}`);
  const alloc = exp.trafficAllocation ?? 1;
  if (r >= alloc) return null; // nicht im Experiment
  const scaled = r / alloc; // [0,1) innerhalb der Allocation
  const total = exp.variants.reduce((a, v) => a + (v.weight || 0), 0) || 1;
  let acc = 0;
  for (const v of exp.variants) {
    acc += (v.weight || 0) / total;
    if (scaled < acc) return v.id;
  }
  return exp.variants[exp.variants.length - 1]?.id ?? null;
}

/** Alle laufenden Experimente für einen Besucher zuteilen → {expName: variantId}. */
export function assignAll(experiments: ExperimentDef[], seed: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const e of experiments) {
    const v = assignVariant(e, seed);
    if (v) out[e.name] = v;
  }
  return out;
}
