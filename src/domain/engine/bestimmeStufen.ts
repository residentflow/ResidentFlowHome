import type { RoutingErgebnis, StufenFreigabe } from '../types';

/**
 * Treppe-Stufen-Freigabe (§10.1). Stufe 1 + 2 immer; Stufe 3 nur ab Schwelle für
 * Bestandsverantwortliche (A + B-verwaltend) — nie für Steuerberater/Makler oder Entwicklung/Fix & Flip.
 * Diese Bedingung ist bereits in routing.vollerTreppe gekapselt.
 */
export function bestimmeStufen(routing: RoutingErgebnis): StufenFreigabe {
  return {
    stufe1: true,
    stufe2: true,
    stufe3: routing.vollerTreppe,
  };
}
