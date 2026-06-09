import type { Problem } from '../schema/problem';
import type { Loesung } from '../schema/loesung';

/**
 * Findet die zu den gewählten Problemen passenden Loesung — phasenübergreifend über das
 * Problem↔Loesung-Mapping, NICHT über die Phase (§4/§6). Dedupliziert; zum Problem passende
 * Loesung rücken nach oben (§8.4 Neusortierung). Reihenfolge folgt der Problem-Reihenfolge.
 */
export function findeRelevanteLoesung(
  gewaehlteProbleme: Problem[],
  alleLoesung: Loesung[],
): Loesung[] {
  const loesungById = new Map(alleLoesung.map((h) => [h.id, h]));
  const gesehen = new Set<string>();
  const ergebnis: Loesung[] = [];

  for (const problem of gewaehlteProbleme) {
    for (const loesungId of problem.verknuepfteLoesung) {
      if (gesehen.has(loesungId)) continue;
      const loesung = loesungById.get(loesungId);
      if (!loesung) continue;
      gesehen.add(loesungId);
      ergebnis.push(loesung);
    }
  }

  return ergebnis;
}
