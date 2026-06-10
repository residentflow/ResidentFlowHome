import type { Spanne } from './schema/spanne';
import type { Rahmung, EndAusgang, SegmentTyp, LoesungZustand, Taetigkeit } from './enums';

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

/** Laufzeit-Zustand eines Loesungs in der Berechnungs-Zustandsmaschine (§7). */
export interface LoesungLaufzeit {
  loesungId: string;
  zustand: LoesungZustand;
  rahmung: Rahmung;
  /** Nur ab Zustand 'quantifiziert' gesetzt — nie vor Selbstauskunft (§7). */
  spanne?: Spanne;
  /** Bei qualitativen Loesungn statt Euro. */
  nutzenAussage?: string;
  /** Sichtbarer Rechenweg (§7), nur bei quantifizierten Loesungn. */
  rechenweg?: string;
  /** Wahrscheinlichkeits-/Risiko-Hinweis bei Risiko-Loesungn im Zustand 'relevant'. */
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
