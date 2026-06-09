import type { Rolle, Taetigkeit } from '../enums';

/**
 * Statische Rolle → Tätigkeit-Zuordnung und Rollen-Kategorien (§3.3).
 * Eine einzige Quelle für Routing, Stufen-Logik und CMS-SegmentEditor.
 */
export const ROLLE_ZU_TAETIGKEIT: Record<Rolle, Taetigkeit> = {
  buyAndHold: 'A',
  bestandshaltung: 'A',
  familyOffice: 'A',
  assetManagementEigen: 'A',
  hausverwaltung: 'B',
  externerAssetManager: 'B',
  immobilienberatung: 'B',
  steuerberater: 'B',
  makler: 'B',
  projektentwicklung: 'C',
  fixAndFlip: 'C',
};

/** Reine Multiplikatoren → immer Partnerprogramm, größenunabhängig (§3.3). */
export const PARTNER_ROLLEN: ReadonlySet<Rolle> = new Set(['steuerberater', 'makler']);

/** Bestandsverantwortliche (A eigen + B-verwaltend) — Schwellen-Logik greift (§3.3). */
export const BESTANDS_ROLLEN: ReadonlySet<Rolle> = new Set([
  'buyAndHold',
  'bestandshaltung',
  'familyOffice',
  'assetManagementEigen',
  'hausverwaltung',
  'externerAssetManager',
  'immobilienberatung',
]);

/** Entwicklung / Fix & Flip → Nebenstrang (§3.3). */
export const C_ROLLEN: ReadonlySet<Rolle> = new Set(['projektentwicklung', 'fixAndFlip']);
