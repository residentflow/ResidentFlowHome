/**
 * Score & Motor-A/B-Umschaltung (PRD §10.3) — framework-frei, rein, testbar.
 * sizeScore = Rang des gewählten Buckets (0..5).
 * highIntent = sizeScore ≥ thresholdHigh(role). Steuerberater (sizeIndependent)
 * läuft immer in den Partnerprogramm-Ausgang, nie HighIntent über Größe.
 */
import type { RoleCfg } from '@/config/checkConfig';

export interface CheckAuswahl {
  rolle: RoleCfg;
  bucketRank: number | null;
  problemValueCategory?: string[];
}

export function sizeScore(bucketRank: number | null): number {
  return bucketRank ?? 0;
}

export function thresholdHigh(rolle: RoleCfg, thresholds: Record<string, number>): number {
  return thresholds[rolle.slug] ?? Number.POSITIVE_INFINITY;
}

export function valueScore(valueCategory?: string[]): number {
  if (!valueCategory) return 0.5;
  return valueCategory.some((v) => v === 'ertrag' || v === 'effizienz') ? 1 : 0.5;
}

export function istHighIntent(auswahl: CheckAuswahl, thresholds: Record<string, number>): boolean {
  if (auswahl.rolle.sizeIndependent) return false; // Steuerberater → Partnerprogramm
  if (auswahl.bucketRank == null) return false;
  return sizeScore(auswahl.bucketRank) >= thresholdHigh(auswahl.rolle, thresholds);
}

export function relevance(
  auswahl: CheckAuswahl,
  weights: { w1Size?: number; w2Value?: number; w3RoleFit?: number },
): number {
  const w1 = weights.w1Size ?? 1;
  const w2 = weights.w2Value ?? 1;
  const w3 = weights.w3RoleFit ?? 1;
  return (
    sizeScore(auswahl.bucketRank) * w1 + valueScore(auswahl.problemValueCategory) * w2 + 1 * w3
  );
}

/** End-Ausgang der Rolle (§2.3): Steuerberater immer Partnerprogramm; sonst rollenspezifisch. */
export function endAusgang(auswahl: CheckAuswahl, thresholds: Record<string, number>): string {
  if (auswahl.rolle.sizeIndependent) return 'partnerprogramm';
  if (istHighIntent(auswahl, thresholds)) return auswahl.rolle.endAusgang;
  return 'nur-loesungen';
}
