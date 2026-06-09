import type { Rolle } from '../enums';
import type { Problem } from '../schema/problem';

export interface ProblemFilterEingabe {
  rollen: Rolle[];
  relevanteEinheiten: number;
  schmerzBereichId?: string;
}

function groessePasst(problem: Problem, einheiten: number): boolean {
  const b = problem.groessenBedingung;
  if (!b) return true;
  if (b.minEinheiten !== undefined && einheiten < b.minEinheiten) return false;
  if (b.maxEinheiten !== undefined && einheiten > b.maxEinheiten) return false;
  return true;
}

/**
 * Stufe-B-Probleme nach Rolle + Größe gefiltert, nur aktive, optional nach Schmerz-Bereich (§5.1/§5.3).
 */
export function filterProbleme(probleme: Problem[], eingabe: ProblemFilterEingabe): Problem[] {
  return probleme.filter((p) => {
    if (!p.aktiv) return false;
    if (!p.rollenFilter.some((r) => eingabe.rollen.includes(r))) return false;
    if (!groessePasst(p, eingabe.relevanteEinheiten)) return false;
    if (eingabe.schmerzBereichId && p.schmerzBereich !== eingabe.schmerzBereichId) return false;
    return true;
  });
}

/**
 * „weiß ich nicht genau" → die Loesung der zur Rolle passenden aktiven Probleme (§5.1).
 * Dedupliziert, Reihenfolge stabil.
 */
export function haeufigsteLoesungDerRolle(probleme: Problem[], rollen: Rolle[]): string[] {
  const passend = filterProbleme(probleme, { rollen, relevanteEinheiten: Number.MAX_SAFE_INTEGER });
  const ids: string[] = [];
  for (const p of passend) {
    for (const h of p.verknuepfteLoesung) {
      if (!ids.includes(h)) ids.push(h);
    }
  }
  return ids;
}
