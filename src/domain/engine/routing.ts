import type { Rolle, Taetigkeit } from '../enums';
import type { RoutingErgebnis, RoutingGroessen } from '../types';
import { ROLLE_ZU_TAETIGKEIT, PARTNER_ROLLEN, BESTANDS_ROLLEN, C_ROLLEN } from './segmente';

export const STANDARD_SCHWELLE = 50;

export function rolleZuTaetigkeit(rolle: Rolle): Taetigkeit {
  return ROLLE_ZU_TAETIGKEIT[rolle];
}

/**
 * relevanteEinheiten = eigene (A) + verwaltete (B) Einheiten (§3.2).
 * C (Vermarktungen/Jahr) zählt nicht in die Einheiten-Summe.
 */
export function relevanteEinheiten(groessen: RoutingGroessen): number {
  return (groessen.A ?? 0) + (groessen.B ?? 0);
}

/**
 * Routing (§3.3). „Flow gilt für alle" — gleicher Ablauf, nur der End-Ausgang variiert.
 * Höchstwertiger Weg gewinnt:
 *  1. Bestandsverantwortlicher mit Summe ≥ Schwelle → Gespräch / volle Treppe.
 *  2. sonst Multiplikator (Steuerberater/Makler) → Partnerprogramm.
 *  3. sonst Bestandsverantwortlicher unter Schwelle → Selbermacher (nur-playbook).
 *  4. sonst Entwicklung/Fix & Flip → Nebenstrang (nur-playbook).
 */
export function routing(
  rollen: Rolle[],
  groessen: RoutingGroessen,
  schwelle: number = STANDARD_SCHWELLE,
): RoutingErgebnis {
  const einheiten = relevanteEinheiten(groessen);
  const hatBestand = rollen.some((r) => BESTANDS_ROLLEN.has(r));
  const hatPartner = rollen.some((r) => PARTNER_ROLLEN.has(r));
  const hatC = rollen.some((r) => C_ROLLEN.has(r));

  if (hatBestand && einheiten >= schwelle) {
    return {
      endAusgang: 'gespraech',
      segmentTyp: 'kern',
      vollerTreppe: true,
      relevanteEinheiten: einheiten,
      begruendung: `Bestandsverantwortlich mit ${einheiten} ≥ ${schwelle} Einheiten → volle Treppe.`,
    };
  }

  if (hatPartner) {
    return {
      endAusgang: 'partnerprogramm',
      segmentTyp: 'multiplikator',
      vollerTreppe: false,
      relevanteEinheiten: einheiten,
      begruendung: 'Multiplikator (Steuerberater/Makler) → Partnerprogramm (immer).',
    };
  }

  if (hatBestand) {
    return {
      endAusgang: 'nur-playbook',
      segmentTyp: 'kern',
      vollerTreppe: false,
      relevanteEinheiten: einheiten,
      begruendung: `Bestandsverantwortlich mit ${einheiten} < ${schwelle} Einheiten → Selbermacher-Weg.`,
    };
  }

  if (hatC) {
    return {
      endAusgang: 'nur-playbook',
      segmentTyp: 'nebenstrang',
      vollerTreppe: false,
      relevanteEinheiten: einheiten,
      begruendung: 'Entwicklung / Fix & Flip → Nebenstrang (kürzerer Weg).',
    };
  }

  return {
    endAusgang: 'nur-playbook',
    segmentTyp: 'nebenstrang',
    vollerTreppe: false,
    relevanteEinheiten: einheiten,
    begruendung: 'Keine eindeutige Rolle → Playbook-Weg.',
  };
}
