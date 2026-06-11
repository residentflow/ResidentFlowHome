/**
 * Gemeinsame Schema-Gates (PRD §20/§25). Spiegeln die Zod-Gates des Frontends
 * (src/domain/schema) als Payload-Validierungen. Build/Speichern bricht bei Verstoß.
 */

/** Spanne min<max erzwingen (PRD §3, §20). Nie Punktwert. */
export function validateSpanne(min: unknown, max: unknown): true | string {
  if (typeof min !== 'number' || typeof max !== 'number') {
    return 'Spanne verlangt numerische min/max.';
  }
  if (!(min < max)) {
    return 'Ungültige Spanne: min muss strikt kleiner als max sein (nie Punktwert).';
  }
  return true;
}

/** Asset gilt als live/öffentlich, sobald es geprüft oder freigegeben ist. */
export const LIVE_QUALITY_STATUS = ['reviewed', 'approved'];

/**
 * Asset-Live-Gate (PRD §25): Ein Asset darf nur dann auf `reviewed`/`approved` gehoben
 * werden, wenn `riskLevel` gesetzt ist. Spiegelt den Export-Filter (export-config.ts)
 * direkt im CMS — der Kurator kann nichts versehentlich „live" schalten, dem die
 * Pflichtangabe fehlt. Wird als Feld-`validate` auf `qualityStatus` genutzt.
 */
export function validateAssetLiveGate(qualityStatus: unknown, riskLevel: unknown): true | string {
  const istLive = typeof qualityStatus === 'string' && LIVE_QUALITY_STATUS.includes(qualityStatus);
  if (istLive && !riskLevel) {
    return 'Live-Schaltung (reviewed/approved) verlangt ein gesetztes riskLevel (§25 Asset-Gate).';
  }
  return true;
}
