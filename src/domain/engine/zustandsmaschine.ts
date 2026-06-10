import type { Loesung } from '../schema/loesung';
import type { LoesungLaufzeit } from '../types';
import { berechneSpanne, rechenweg } from './berechneSpanne';

/** Anteil, um den eine Spanne bei Präzisierung um ihren Mittelwert verengt wird. */
const PRAEZISIERUNGS_FAKTOR = 0.6;

/** Initialzustand: immer 'relevant', nie eine Euro-Zahl (§7). */
export function initialerZustand(loesung: Loesung): LoesungLaufzeit {
  const basis: LoesungLaufzeit = {
    loesungId: loesung.id,
    zustand: 'relevant',
    rahmung: loesung.rahmung,
  };
  if (!loesung.quantifizierbar && loesung.nutzenAussage) {
    basis.nutzenAussage = loesung.nutzenAussage;
  }
  if (loesung.wertKategorie === 'risiko') {
    basis.risikoHinweis = loesung.nutzenAussage ?? 'Mögliches Risiko — Wahrscheinlichkeit prüfen.';
  }
  return basis;
}

function alleDetailfragenBeantwortet(loesung: Loesung, angaben: Record<string, number>): boolean {
  if (loesung.detailFragen.length === 0) return false;
  return loesung.detailFragen.every((f) => typeof angaben[f] === 'number');
}

function hatZusatzangaben(loesung: Loesung, angaben: Record<string, number>): boolean {
  return Object.keys(angaben).some((k) => !loesung.detailFragen.includes(k));
}

function verenge(min: number, max: number): { min: number; max: number } {
  const mitte = (min + max) / 2;
  return {
    min: mitte - (mitte - min) * PRAEZISIERUNGS_FAKTOR,
    max: mitte + (max - mitte) * PRAEZISIERUNGS_FAKTOR,
  };
}

/**
 * Zustandsübergang relevant → quantifiziert → präzisiert (§7).
 * - Qualitativer Loesung bleibt 'relevant' mit nutzenAussage (nie Euro).
 * - Quantifizierbarer Loesung ohne vollständige Detailangaben bleibt 'relevant' (keine Euro-Zahl).
 * - Mit vollständigen Detailangaben → 'quantifiziert' inkl. Spanne + Rechenweg.
 * - Mit zusätzlichen Angaben → 'praezisiert' (verengte Spanne).
 */
export function uebergang(
  _laufzeit: LoesungLaufzeit,
  loesung: Loesung,
  detailAngaben: Record<string, number>,
): LoesungLaufzeit {
  if (!loesung.quantifizierbar || !loesung.berechnung) {
    return initialerZustand(loesung);
  }

  if (!alleDetailfragenBeantwortet(loesung, detailAngaben)) {
    return initialerZustand(loesung);
  }

  const spanne = berechneSpanne(detailAngaben, loesung.berechnung);
  const praezisiert = hatZusatzangaben(loesung, detailAngaben);
  const finaleSpanne = praezisiert ? verenge(spanne.min, spanne.max) : spanne;

  return {
    loesungId: loesung.id,
    zustand: praezisiert ? 'praezisiert' : 'quantifiziert',
    rahmung: loesung.rahmung,
    spanne: finaleSpanne,
    rechenweg: rechenweg(detailAngaben, loesung.berechnung),
  };
}
