import type { Rolle, Taetigkeit } from '@/domain/enums';

/**
 * Tätigkeitsprofile (Schritt 1 der Schatzsuche, §3.2/§3.3/§8.1).
 *
 * Vier klar getrennte Profile statt der reinen A/B/C-Buckets — damit der reine Multiplikator-Pfad
 * (Steuerberater/Makler → Partnerprogramm, §3.3 „immer Partnerprogramm") über die UI erreichbar wird:
 *   1. Eigener Bestand                       → A (eigene Einheiten)
 *   2. Fremder Bestand (Verwaltung)          → B (betreute Einheiten)
 *   3. Betreuung von Mandanten mit Portfolio → Steuerberater/Makler, größenunabhängig → Partnerprogramm
 *   4. Projektentwicklung / Fix & Flip       → C (Vermarktungen/Jahr)
 *
 * `groessenMass = null` ⇒ größenunabhängig (Profil 3) → fließt NICHT in die relevanteEinheiten-Summe ein.
 */
export type ProfilId = 'eigenerBestand' | 'fremderBestand' | 'mandantenbetreuung' | 'entwicklung';

export interface TaetigkeitProfil {
  id: ProfilId;
  label: string;
  beschreibung: string;
  rollen: Rolle[];
  groessenMass: Taetigkeit | null;
}

export const TAETIGKEITSPROFILE: TaetigkeitProfil[] = [
  {
    id: 'eigenerBestand',
    label: 'Eigener Bestand',
    beschreibung:
      'Sie halten und verwalten eigene Immobilien (Buy & Hold, Bestandshaltung, Family Office).',
    rollen: ['buyAndHold', 'bestandshaltung', 'familyOffice', 'assetManagementEigen'],
    groessenMass: 'A',
  },
  {
    id: 'fremderBestand',
    label: 'Fremder Bestand (Verwaltung)',
    beschreibung:
      'Sie verwalten oder betreuen Bestände Dritter (Hausverwaltung, externer Asset Manager, Immobilienberatung).',
    rollen: ['hausverwaltung', 'externerAssetManager', 'immobilienberatung'],
    groessenMass: 'B',
  },
  {
    id: 'mandantenbetreuung',
    label: 'Betreuung von Mandanten mit Immobilienportfolio',
    beschreibung:
      'Sie beraten oder betreuen Kunden/Mandanten mit Immobilien (Steuerberater, Makler).',
    rollen: ['steuerberater', 'makler'],
    groessenMass: null,
  },
  {
    id: 'entwicklung',
    label: 'Projektentwicklung / Fix & Flip',
    beschreibung: 'Sie entwickeln oder handeln Immobilien (Projektentwicklung, Fix & Flip).',
    rollen: ['projektentwicklung', 'fixAndFlip'],
    groessenMass: 'C',
  },
];

/** Vereinigt die Rollen der gewählten Profile (dedupliziert). */
export function rollenAusProfilen(profilIds: ProfilId[]): Rolle[] {
  const rollen: Rolle[] = [];
  for (const id of profilIds) {
    const profil = TAETIGKEITSPROFILE.find((p) => p.id === id);
    if (!profil) continue;
    for (const r of profil.rollen) {
      if (!rollen.includes(r)) rollen.push(r);
    }
  }
  return rollen;
}

/** Größen-Buckets (A/B/C) der gewählten Profile (ohne größenunabhängige Profile), dedupliziert. */
export function groessenBucketsAusProfilen(profilIds: ProfilId[]): Taetigkeit[] {
  const buckets: Taetigkeit[] = [];
  for (const id of profilIds) {
    const profil = TAETIGKEITSPROFILE.find((p) => p.id === id);
    if (!profil || profil.groessenMass === null) continue;
    if (!buckets.includes(profil.groessenMass)) buckets.push(profil.groessenMass);
  }
  return buckets;
}
