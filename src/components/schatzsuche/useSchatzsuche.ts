import { useState, useCallback, useMemo } from 'react';
import { findeRelevanteLoesung } from '@/domain/engine/findeRelevanteLoesung';
import { filterProbleme } from '@/domain/engine/filterProbleme';
import { relevanteEinheiten } from '@/domain/engine/routing';
import { initialerZustand, uebergang } from '@/domain/engine/zustandsmaschine';
import { aggregiere } from '@/domain/engine/aggregiere';
import { fortschritt } from '@/domain/engine/fortschritt';
import type { Rolle, Taetigkeit } from '@/domain/enums';
import type { Config } from '@/domain/schema/config';
import type { LoesungLaufzeit, Fortschritt, RoutingGroessen } from '@/domain/types';
import type { Spanne } from '@/domain/schema/spanne';

export interface SchatzSucheZustand {
  /** Gewählte Rollen (aus Tätigkeiten abgeleitet + direkt gewählt). */
  rollen: Rolle[];
  /** Adaptive Größen je Tätigkeit. */
  groessen: RoutingGroessen;
  /** IDs der gewählten Probleme (Stufe B). */
  gewaehlteProbleme: string[];
  /** Detailangaben: loesungId → { frageKey → wert }. */
  detailAngaben: Record<string, Record<string, number>>;
}

export interface SchatzSucheApi {
  /** Gewählte Rollen setzen (aus Tätigkeit oder direkt). */
  waehleRollen: (rollen: Rolle[]) => void;
  /** Größe für eine Tätigkeit setzen. */
  setzeGroesse: (taetigkeit: Taetigkeit, wert: number) => void;
  /** Problem-IDs (Stufe B) setzen. */
  waehleProbleme: (problemIds: string[]) => void;
  /** Detailangabe für einen Loesung setzen (löst Zustandsübergang aus). */
  setzeDetailAngabe: (loesungId: string, frageKey: string, wert: number) => void;
  /** Aktuelle Laufzeit-Zustände der relevanten Loesung. */
  relevanteLoesung: LoesungLaufzeit[];
  /** Aggregiertes Gesamtpotenzial (Spanne). */
  aggregat: Spanne;
  /** Fortschritt (analysiert/gesamt). */
  fortschrittStatus: Fortschritt;
  /** Aktuelle Groessen. */
  groessen: RoutingGroessen;
  /** Gewählte Rollen. */
  rollen: Rolle[];
  /** Gewählte Problem-IDs. */
  gewaehlteProbleme: string[];
  /** Detailangaben. */
  detailAngaben: Record<string, Record<string, number>>;
}

/**
 * Hook: kapselt die Engine, hält Zustand (rollen/groessen/probleme/detailAngaben),
 * liefert relevante LoesungLaufzeit-Liste, Aggregat, Fortschritt.
 * KEIN fetch/Storage/Cookie — rein clientseitig über die Engine (§8.5).
 */
export function useSchatzsuche(config: Config): SchatzSucheApi {
  const [rollen, setRollen] = useState<Rolle[]>([]);
  const [groessen, setGroessen] = useState<RoutingGroessen>({});
  const [gewaehlteProbleme, setGewaehlteProbleme] = useState<string[]>([]);
  const [detailAngaben, setDetailAngaben] = useState<Record<string, Record<string, number>>>({});

  const waehleRollen = useCallback((neueRollen: Rolle[]) => {
    setRollen(neueRollen);
  }, []);

  const setzeGroesse = useCallback((taetigkeit: Taetigkeit, wert: number) => {
    setGroessen((prev) => ({ ...prev, [taetigkeit]: wert }));
  }, []);

  const waehleProbleme = useCallback((problemIds: string[]) => {
    setGewaehlteProbleme(problemIds);
  }, []);

  const setzeDetailAngabe = useCallback((loesungId: string, frageKey: string, wert: number) => {
    setDetailAngaben((prev) => ({
      ...prev,
      [loesungId]: { ...(prev[loesungId] ?? {}), [frageKey]: wert },
    }));
  }, []);

  // Relevante Einheiten aus Größen (§3.2)
  const einheiten = useMemo(() => relevanteEinheiten(groessen), [groessen]);

  // Gefilterte Probleme nach Rolle+Größe
  const gefilterteProblemObjekte = useMemo(() => {
    if (rollen.length === 0) return [];
    return filterProbleme(config.probleme, { rollen, relevanteEinheiten: einheiten });
  }, [config.probleme, rollen, einheiten]);

  // Gewählte Problem-Objekte (nur aktive, die auch gefiltert sind)
  const gewaehlteProblemobjekte = useMemo(() => {
    const erlaubteIds = new Set(gefilterteProblemObjekte.map((p) => p.id));
    return config.probleme.filter((p) => gewaehlteProbleme.includes(p.id) && erlaubteIds.has(p.id));
  }, [config.probleme, gewaehlteProbleme, gefilterteProblemObjekte]);

  // Relevante Loesung aus gewählten Problemen
  const relevanteLoesungObjekte = useMemo(() => {
    return findeRelevanteLoesung(gewaehlteProblemobjekte, config.loesung);
  }, [gewaehlteProblemobjekte, config.loesung]);

  // Laufzeit-Zustände mit aktuellen Detailangaben
  const relevanteLoesung = useMemo<LoesungLaufzeit[]>(() => {
    return relevanteLoesungObjekte.map((loesung) => {
      const angaben = detailAngaben[loesung.id] ?? {};
      const init = initialerZustand(loesung);
      if (Object.keys(angaben).length === 0) return init;
      return uebergang(init, loesung, angaben);
    });
  }, [relevanteLoesungObjekte, detailAngaben]);

  const aggregat = useMemo(() => aggregiere(relevanteLoesung), [relevanteLoesung]);
  const fortschrittStatus = useMemo(() => fortschritt(relevanteLoesung), [relevanteLoesung]);

  return {
    waehleRollen,
    setzeGroesse,
    waehleProbleme,
    setzeDetailAngabe,
    relevanteLoesung,
    aggregat,
    fortschrittStatus,
    groessen,
    rollen,
    gewaehlteProbleme,
    detailAngaben,
  };
}
