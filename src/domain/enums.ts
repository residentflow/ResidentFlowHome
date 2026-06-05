/**
 * Zentrale String-Literal-Enums der Domäne (§3.2, §3.3, §6.1, §14).
 * Eine einzige Quelle für Schema, Engine, UI, Brevo-Attribute und CMS.
 * Framework-frei (kein React-Import).
 */

/** Tätigkeits-Schwerpunkt / Bucket (§3.2). */
export const TAETIGKEITEN = ['A', 'B', 'C'] as const;
export type Taetigkeit = (typeof TAETIGKEITEN)[number];

/** Vollständiger Rollen-Katalog (§3.3). */
export const ROLLEN = [
  'buyAndHold',
  'bestandshaltung',
  'familyOffice',
  'assetManagementEigen',
  'hausverwaltung',
  'externerAssetManager',
  'immobilienberatung',
  'steuerberater',
  'makler',
  'projektentwicklung',
  'fixAndFlip',
] as const;
export type Rolle = (typeof ROLLEN)[number];

/** Wert-Kategorie je Hebel — bestimmt Rahmung und Euro-Logik (§6.1). */
export const WERT_KATEGORIEN = ['ertrag', 'effizienz', 'risiko'] as const;
export type WertKategorie = (typeof WERT_KATEGORIEN)[number];

/** Rahmung eines Fundes (§6.1). Verlust nur bei Risiko-Hebeln. */
export const RAHMUNGEN = ['chance', 'verlust'] as const;
export type Rahmung = (typeof RAHMUNGEN)[number];

/** Segment-Typ (§14). */
export const SEGMENT_TYPEN = ['kern', 'multiplikator', 'nebenstrang'] as const;
export type SegmentTyp = (typeof SEGMENT_TYPEN)[number];

/** End-Ausgang eines Segments (§3.3, §14). */
export const END_AUSGAENGE = ['gespraech', 'partnerprogramm', 'nur-playbook'] as const;
export type EndAusgang = (typeof END_AUSGAENGE)[number];

/** Zustand eines Hebels in der Berechnungs-Zustandsmaschine (§7). */
export const HEBEL_ZUSTAENDE = ['relevant', 'quantifiziert', 'praezisiert'] as const;
export type HebelZustand = (typeof HEBEL_ZUSTAENDE)[number];

/** Adaptives Größenmaß je Tätigkeit (§3.3). */
export const GROESSEN_MASSE = [
  'eigeneEinheiten',
  'betreuteEinheiten',
  'vermarktungenProJahr',
] as const;
export type GroessenMass = (typeof GROESSEN_MASSE)[number];
