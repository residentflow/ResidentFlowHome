import { useState } from 'react';
import { TaetigkeitSchritt } from './TaetigkeitSchritt';
import { GroesseSchritt } from './GroesseSchritt';
import { ProblemSchritt } from './ProblemSchritt';
import { DetailSchritt } from './DetailSchritt';
import { ErkenntnisListe } from './ErkenntnisListe';
import { Fortschrittsbalken } from './Fortschrittsbalken';
import { useSchatzsuche } from './useSchatzsuche';
import type { Taetigkeit, Rolle } from '@/domain/enums';
import type { Config } from '@/domain/schema/config';
import type { RoutingGroessen } from '@/domain/types';

type Schritt = 'taetigkeit' | 'groesse' | 'probleme' | 'detail';

interface SchatzsucheProps {
  config: Config;
}

/** Alle Rollen, die primär einer Tätigkeit zugehören (für Problemfilter). */
const ROLLEN_JE_TAETIGKEIT: Record<Taetigkeit, Rolle[]> = {
  A: ['buyAndHold', 'bestandshaltung', 'familyOffice', 'assetManagementEigen'],
  B: ['hausverwaltung', 'externerAssetManager', 'immobilienberatung', 'steuerberater', 'makler'],
  C: ['projektentwicklung', 'fixAndFlip'],
};

function rollenAusTaetigkeiten(taetigkeiten: Taetigkeit[]): Rolle[] {
  const rollen: Rolle[] = [];
  for (const t of taetigkeiten) {
    for (const r of ROLLEN_JE_TAETIGKEIT[t]) {
      if (!rollen.includes(r)) rollen.push(r);
    }
  }
  return rollen;
}

function hebelNamenAusConfig(config: Config): Record<string, string> {
  return Object.fromEntries(config.hebel.map((h) => [h.id, h.name]));
}

/**
 * Orchestrator der Schatzsuche — §8.1.
 * Reihenfolge: Tätigkeit → Größe → Probleme → Detail.
 * Kein fetch, kein Cookie, kein Storage, keine E-Mail (§8.5).
 */
export function Schatzsuche({ config }: SchatzsucheProps) {
  const [schritt, setSchritt] = useState<Schritt>('taetigkeit');
  const [gewaehlteTaetigkeiten, setGewaehlteTaetigkeiten] = useState<Taetigkeit[]>([]);

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

  function handleTaetigkeitWeiter(taetigkeiten: Taetigkeit[]) {
    setGewaehlteTaetigkeiten(taetigkeiten);
    waehleRollen(rollenAusTaetigkeiten(taetigkeiten));
    setSchritt('groesse');
  }

  function handleGroesseWeiter() {
    setSchritt('probleme');
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
        <TaetigkeitSchritt gewaehlt={gewaehlteTaetigkeiten} onWeiter={handleTaetigkeitWeiter} />
      )}

      {schritt === 'groesse' && (
        <GroesseSchritt
          taetigkeiten={gewaehlteTaetigkeiten}
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
    </div>
  );
}
