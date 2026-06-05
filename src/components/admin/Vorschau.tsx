import { useState } from 'react';
import type { Config } from '@/domain/schema/config';
import { ROLLEN } from '@/domain/enums';
import type { Rolle } from '@/domain/enums';
import { routing } from '@/domain/engine/routing';
import { filterProbleme } from '@/domain/engine/filterProbleme';
import { findeRelevanteHebel } from '@/domain/engine/findeRelevanteHebel';

interface Props {
  config: Config;
}

const ROLLEN_LABELS: Record<Rolle, string> = {
  buyAndHold: 'Buy & Hold',
  bestandshaltung: 'Bestandshaltung',
  familyOffice: 'Family Office',
  assetManagementEigen: 'Asset Management (eigen)',
  hausverwaltung: 'Hausverwaltung',
  externerAssetManager: 'Externer Asset Manager',
  immobilienberatung: 'Immobilienberatung',
  steuerberater: 'Steuerberater',
  makler: 'Makler',
  projektentwicklung: 'Projektentwicklung',
  fixAndFlip: 'Fix & Flip',
};

const END_AUSGANG_LABELS: Record<string, string> = {
  gespraech: 'Volle Treppe (Gespräch)',
  partnerprogramm: 'Partnerprogramm',
  'nur-playbook': 'Nur Playbook (Selbermacher-Weg)',
};

/**
 * Vorschau (§13.3): zeigt die Suche für gewählte Rolle + Größe + Problem.
 * Nutzt die Engine (routing, filterProbleme, findeRelevanteHebel).
 */
export function Vorschau({ config }: Props) {
  const [gewaehlteRolle, setGewaehlteRolle] = useState<Rolle>('buyAndHold');
  const [einheiten, setEinheiten] = useState<number>(60);
  const [gewaehltesProblemId, setGewaehltesProblemId] = useState<string>('');

  const routingErgebnis = routing(
    [gewaehlteRolle],
    { A: einheiten, B: einheiten },
    config.globalConfig.schwellenwertStufe3,
  );

  const gefiltertProbleme = filterProbleme(config.probleme, {
    rollen: [gewaehlteRolle],
    relevanteEinheiten: einheiten,
  });

  const gewaehltProblem = config.probleme.find((p) => p.id === gewaehltesProblemId);
  const relevanteHebel = findeRelevanteHebel(
    gewaehltProblem ? [gewaehltProblem] : gefiltertProbleme,
    config.hebel,
  );

  return (
    <div>
      <h2>Vorschau</h2>
      <p style={{ fontSize: '0.85em', color: '#666' }}>
        Simuliert den Routing- und Such-Ablauf für eine gewählte Rolle, Größe und Problem-Auswahl.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <label>
          Rolle
          <select
            value={gewaehlteRolle}
            onChange={(e) => setGewaehlteRolle(e.target.value as Rolle)}
            style={{ display: 'block' }}
            data-testid="rolle-select"
            aria-label="Rolle auswählen"
          >
            {ROLLEN.map((r) => (
              <option key={r} value={r}>
                {ROLLEN_LABELS[r]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Anzahl Einheiten
          <input
            type="number"
            value={einheiten}
            min={0}
            step={1}
            onChange={(e) => setEinheiten(parseInt(e.target.value) || 0)}
            style={{ display: 'block', width: '100px' }}
            data-testid="groesse-input"
            aria-label="Anzahl Einheiten"
          />
        </label>

        <label>
          Problem (optional)
          <select
            value={gewaehltesProblemId}
            onChange={(e) => setGewaehltesProblemId(e.target.value)}
            style={{ display: 'block' }}
            aria-label="Problem auswählen"
          >
            <option value="">— alle passenden —</option>
            {gefiltertProbleme.map((p) => (
              <option key={p.id} value={p.id}>
                {p.text}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9f9f9', borderRadius: '4px' }}>
        <h3>Routing-Ergebnis</h3>
        <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '0.25rem 1rem' }}>
          <dt>End-Ausgang:</dt>
          <dd>
            <strong>{END_AUSGANG_LABELS[routingErgebnis.endAusgang] ?? routingErgebnis.endAusgang}</strong>
          </dd>
          <dt>Relevante Einheiten:</dt>
          <dd>{routingErgebnis.relevanteEinheiten}</dd>
          <dt>Begründung:</dt>
          <dd>{routingErgebnis.begruendung}</dd>
        </dl>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h3>Passende Probleme ({gefiltertProbleme.length})</h3>
        {gefiltertProbleme.length === 0 ? (
          <p>Keine passenden Probleme für diese Rolle und Größe.</p>
        ) : (
          <ul>
            {gefiltertProbleme.map((p) => (
              <li key={p.id} style={{ marginBottom: '0.25rem' }}>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() =>
                    setGewaehltesProblemId(gewaehltesProblemId === p.id ? '' : p.id)
                  }
                >
                  {p.text}
                </button>
                {!p.aktiv && ' (inaktiv)'}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h3>Relevante Hebel ({relevanteHebel.length})</h3>
        {relevanteHebel.length === 0 ? (
          <p>Keine Hebel für die aktuelle Auswahl.</p>
        ) : (
          <ul>
            {relevanteHebel.map((h) => (
              <li key={h.id} style={{ marginBottom: '0.5rem' }}>
                <strong>{h.name}</strong>
                {' '}
                <span style={{ color: '#666', fontSize: '0.85em' }}>
                  (Phase {h.lebenszyklusPhase} · {h.wertKategorie} · {h.rahmung})
                </span>
                <br />
                <span style={{ fontSize: '0.85em' }}>{h.kartenText}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
