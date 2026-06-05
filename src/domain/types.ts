import type { Spanne } from './schema/spanne';
import type { Rahmung, EndAusgang, SegmentTyp, HebelZustand, Taetigkeit } from './enums';

/** Ergebnis des Routings (§3.3). begruendung macht die gewinnende Regel testbar/transparent. */
export interface RoutingErgebnis {
  endAusgang: EndAusgang;
  segmentTyp: SegmentTyp;
  vollerTreppe: boolean;
  relevanteEinheiten: number;
  begruendung: string;
}

/** Freigeschaltete Treppen-Stufen (§10.1). */
export interface StufenFreigabe {
  stufe1: true;
  stufe2: true;
  stufe3: boolean;
}

/** Laufzeit-Zustand eines Hebels in der Berechnungs-Zustandsmaschine (§7). */
export interface HebelLaufzeit {
  hebelId: string;
  zustand: HebelZustand;
  rahmung: Rahmung;
  /** Nur ab Zustand 'quantifiziert' gesetzt — nie vor Selbstauskunft (§7). */
  spanne?: Spanne;
  /** Bei qualitativen Hebeln statt Euro. */
  nutzenAussage?: string;
  /** Sichtbarer Rechenweg (§7), nur bei quantifizierten Hebeln. */
  rechenweg?: string;
  /** Wahrscheinlichkeits-/Risiko-Hinweis bei Risiko-Hebeln im Zustand 'relevant'. */
  risikoHinweis?: string;
}

/** Fortschritt der Schatzsuche (§8.4). */
export interface Fortschritt {
  analysiert: number;
  gesamt: number;
  anteil: number;
}

/** Eingabe für das Routing: Mehrfachauswahl Rollen + adaptive Größen je Tätigkeit. */
export interface RoutingGroessen {
  A?: number;
  B?: number;
  C?: number;
}

export type { Taetigkeit };
