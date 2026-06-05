import type { Hebel } from '../schema/hebel';
import type { HebelLaufzeit } from '../types';
import { berechneSpanne, rechenweg } from './berechneSpanne';

/** Anteil, um den eine Spanne bei Präzisierung um ihren Mittelwert verengt wird. */
const PRAEZISIERUNGS_FAKTOR = 0.6;

/** Initialzustand: immer 'relevant', nie eine Euro-Zahl (§7). */
export function initialerZustand(hebel: Hebel): HebelLaufzeit {
  const basis: HebelLaufzeit = {
    hebelId: hebel.id,
    zustand: 'relevant',
    rahmung: hebel.rahmung,
  };
  if (!hebel.quantifizierbar && hebel.nutzenAussage) {
    basis.nutzenAussage = hebel.nutzenAussage;
  }
  if (hebel.wertKategorie === 'risiko') {
    basis.risikoHinweis = hebel.nutzenAussage ?? 'Mögliches Risiko — Wahrscheinlichkeit prüfen.';
  }
  return basis;
}

function alleDetailfragenBeantwortet(hebel: Hebel, angaben: Record<string, number>): boolean {
  if (hebel.detailFragen.length === 0) return false;
  return hebel.detailFragen.every((f) => typeof angaben[f] === 'number');
}

function hatZusatzangaben(hebel: Hebel, angaben: Record<string, number>): boolean {
  return Object.keys(angaben).some((k) => !hebel.detailFragen.includes(k));
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
 * - Qualitativer Hebel bleibt 'relevant' mit nutzenAussage (nie Euro).
 * - Quantifizierbarer Hebel ohne vollständige Detailangaben bleibt 'relevant' (keine Euro-Zahl).
 * - Mit vollständigen Detailangaben → 'quantifiziert' inkl. Spanne + Rechenweg.
 * - Mit zusätzlichen Angaben → 'praezisiert' (verengte Spanne).
 */
export function uebergang(
  _laufzeit: HebelLaufzeit,
  hebel: Hebel,
  detailAngaben: Record<string, number>,
): HebelLaufzeit {
  if (!hebel.quantifizierbar || !hebel.berechnung) {
    return initialerZustand(hebel);
  }

  if (!alleDetailfragenBeantwortet(hebel, detailAngaben)) {
    return initialerZustand(hebel);
  }

  const spanne = berechneSpanne(detailAngaben, hebel.berechnung);
  const praezisiert = hatZusatzangaben(hebel, detailAngaben);
  const finaleSpanne = praezisiert ? verenge(spanne.min, spanne.max) : spanne;

  return {
    hebelId: hebel.id,
    zustand: praezisiert ? 'praezisiert' : 'quantifiziert',
    rahmung: hebel.rahmung,
    spanne: finaleSpanne,
    rechenweg: rechenweg(detailAngaben, hebel.berechnung),
  };
}
