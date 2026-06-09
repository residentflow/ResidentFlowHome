import type { Problem } from '../schema/problem';
import type { Hebel } from '../schema/hebel';

/**
 * Findet die zu den gewählten Problemen passenden Hebel — phasenübergreifend über das
 * Problem↔Hebel-Mapping, NICHT über die Phase (§4/§6). Dedupliziert; zum Problem passende
 * Hebel rücken nach oben (§8.4 Neusortierung). Reihenfolge folgt der Problem-Reihenfolge.
 */
export function findeRelevanteHebel(gewaehlteProbleme: Problem[], alleHebel: Hebel[]): Hebel[] {
  const hebelById = new Map(alleHebel.map((h) => [h.id, h]));
  const gesehen = new Set<string>();
  const ergebnis: Hebel[] = [];

  for (const problem of gewaehlteProbleme) {
    for (const hebelId of problem.verknuepfteHebel) {
      if (gesehen.has(hebelId)) continue;
      const hebel = hebelById.get(hebelId);
      if (!hebel) continue;
      gesehen.add(hebelId);
      ergebnis.push(hebel);
    }
  }

  return ergebnis;
}
