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
