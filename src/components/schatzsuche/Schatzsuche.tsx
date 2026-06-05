import { useEffect, useState } from 'react';
import { TaetigkeitSchritt } from './TaetigkeitSchritt';
import { GroesseSchritt } from './GroesseSchritt';
import { ProblemSchritt } from './ProblemSchritt';
import { DetailSchritt } from './DetailSchritt';
import { ErkenntnisListe } from './ErkenntnisListe';
import { Fortschrittsbalken } from './Fortschrittsbalken';
import { useSchatzsuche } from './useSchatzsuche';
import { routing } from '@/domain/engine/routing';
import {
  rollenAusProfilen,
  groessenBucketsAusProfilen,
  type ProfilId,
} from '@/content/taetigkeitsprofile';
import type { Taetigkeit, Rolle } from '@/domain/enums';
import type { Config } from '@/domain/schema/config';
import type { HebelLaufzeit, RoutingGroessen } from '@/domain/types';
import type { Spanne } from '@/domain/schema/spanne';

type Schritt = 'taetigkeit' | 'groesse' | 'probleme' | 'detail' | 'ergebnis';

/** Live-Ergebnis der Suche, das die LandingPage für Treppe/Opt-in (§10) konsumiert. */
export interface SchatzsucheErgebnis {
  rollen: Rolle[];
  groessen: RoutingGroessen;
  relevanteHebel: HebelLaufzeit[];
  aggregat: Spanne;
  /** true, sobald der Ergebnis-Bereich (Detail oder Partner-Ausgang) erreicht ist. */
  imErgebnis: boolean;
}

interface SchatzsucheProps {
  config: Config;
  /** Optionaler Callback: meldet das aktuelle Such-Ergebnis nach außen (für die Verdrahtung). */
  onErgebnis?: (ergebnis: SchatzsucheErgebnis) => void;
}

function hebelNamenAusConfig(config: Config): Record<string, string> {
  return Object.fromEntries(config.hebel.map((h) => [h.id, h.name]));
}

/**
 * Orchestrator der Schatzsuche — §8.1.
 * Reihenfolge: Tätigkeit (Profil) → Größe → Probleme → Detail.
 * Multiplikatoren (Steuerberater/Makler) werden nach der Größe direkt zum Partner-Ergebnis geführt (§10.2).
 * Kein fetch, kein Cookie, kein Storage, keine E-Mail (§8.5).
 */
export function Schatzsuche({ config, onErgebnis }: SchatzsucheProps) {
  const [schritt, setSchritt] = useState<Schritt>('taetigkeit');
  const [gewaehlteProfile, setGewaehlteProfile] = useState<ProfilId[]>([]);

  const {
    waehleRollen,
    setzeGroesse,
    waehleProbleme,
    setzeDetailAngabe,
    relevanteHebel,
    aggregat,
    fortschrittStatus,
    groessen,
    rollen,
    gewaehlteProbleme,
    detailAngaben,
  } = useSchatzsuche(config);

  // Größen-Buckets (A/B/C) der gewählten Profile — größenunabhängige Profile (Mandanten) liefern keinen.
  const groessenBuckets = groessenBucketsAusProfilen(gewaehlteProfile);

  const istErgebnis = schritt === 'detail' || schritt === 'ergebnis';

  // Stabiler Schlüssel: feuert onErgebnis nur bei echten Wert-Änderungen (kein Render-Loop).
  const ergebnisKey = JSON.stringify({
    rollen,
    groessen,
    hl: relevanteHebel.map((l) => [l.hebelId, l.zustand, l.spanne]),
    aggregat,
    schritt,
  });
  useEffect(() => {
    onErgebnis?.({
      rollen,
      groessen,
      relevanteHebel,
      aggregat,
      imErgebnis: istErgebnis,
    });
    // ergebnisKey kapselt die relevanten Werte; onErgebnis sollte vom Aufrufer memoisiert werden.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ergebnisKey]);

  function handleTaetigkeitWeiter(profile: ProfilId[]) {
    setGewaehlteProfile(profile);
    waehleRollen(rollenAusProfilen(profile));
    setSchritt('groesse');
  }

  function handleGroesseWeiter() {
    // Multiplikatoren (Partnerprogramm) brauchen keinen Schmerz-/Detail-Funnel (§10.2) → direkt zum Ergebnis.
    const ergebnis = routing(rollenAusProfilen(gewaehlteProfile), groessen);
    setSchritt(ergebnis.endAusgang === 'partnerprogramm' ? 'ergebnis' : 'probleme');
  }

  function handleGroesseAendern(taetigkeit: Taetigkeit, wert: number) {
    setzeGroesse(taetigkeit, wert);
  }

  function handleProblemWeiter(problemIds: string[]) {
    waehleProbleme(problemIds);
    setSchritt('detail');
  }

  // Relevante Einheiten (A+B summiert, §3.2)
  const einheiten = (groessen.A ?? 0) + (groessen.B ?? 0);

  // Hebel-Objekte für DetailSchritt
  const relevanteHebelObjekte = relevanteHebel
    .map((l) => config.hebel.find((h) => h.id === l.hebelId))
    .filter((h): h is NonNullable<typeof h> => h !== undefined);

  const hebelNamen = hebelNamenAusConfig(config);

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Erkenntnis-Liste — immer sichtbar (§8.2 / §8.4) */}
      {relevanteHebel.length > 0 && (
        <ErkenntnisListe laufzeiten={relevanteHebel} hebelNamen={hebelNamen} />
      )}

      {/* Fortschrittsbalken (§8.4) */}
      {fortschrittStatus.gesamt > 0 && (
        <Fortschrittsbalken
          analysiert={fortschrittStatus.analysiert}
          gesamt={fortschrittStatus.gesamt}
        />
      )}

      {/* Schritt-Inhalte */}
      {schritt === 'taetigkeit' && (
        <TaetigkeitSchritt gewaehlt={gewaehlteProfile} onWeiter={handleTaetigkeitWeiter} />
      )}

      {schritt === 'groesse' && (
        <GroesseSchritt
          taetigkeiten={groessenBuckets}
          groessen={groessen}
          onGroesseAendern={handleGroesseAendern}
          onWeiter={handleGroesseWeiter}
        />
      )}

      {schritt === 'probleme' && (
        <ProblemSchritt
          rollen={rollen}
          relevanteEinheiten={einheiten}
          schmerzBereiche={config.schmerzBereiche}
          probleme={config.probleme}
          gewaehlt={gewaehlteProbleme}
          onWeiter={handleProblemWeiter}
        />
      )}

      {schritt === 'detail' && (
        <DetailSchritt
          hebel={relevanteHebelObjekte}
          laufzeiten={relevanteHebel}
          detailAngaben={detailAngaben}
          onDetailAngabe={setzeDetailAngabe}
        />
      )}

      {schritt === 'ergebnis' && (
        <div data-testid="schritt-ergebnis">
          <h2>Ihr passender Weg</h2>
          <p>
            Als Multiplikator (Steuerberater / Makler) ist das Partnerprogramm Ihr direkter Weg —
            größenunabhängig. Ihr verdichtetes Ergebnis finden Sie direkt darunter.
          </p>
        </div>
      )}
    </div>
  );
}
