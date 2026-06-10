import { useState } from 'react';
import type { Config } from '@/domain/schema/config';
import type { Problem } from '@/domain/schema/problem';

interface Props {
  config: Config;
  onAendern: (neu: Config) => void;
}

/**
 * Problem↔Loesung n:m-Mapping-Editor (§13.2).
 * Lokaler Zustand synchronisiert Mapping-Änderungen ohne Re-Render vom Elternteil.
 */
export function MappingEditor({ config, onAendern }: Props) {
  // Lokale Kopie der Probleme — damit Mapping-Änderungen sofort im UI sichtbar sind
  const [lokalProbleme, setLokalProbleme] = useState<Problem[]>(() =>
    JSON.parse(JSON.stringify(config.probleme)),
  );
  const [gewaehlteProblemId, setGewaehlteProblemId] = useState<string>(
    config.probleme[0]?.id ?? '',
  );

  const gewaehltProblem = lokalProbleme.find((p) => p.id === gewaehlteProblemId);

  function handleProblemWechsel(id: string) {
    setGewaehlteProblemId(id);
  }

  function handleLoesungToggle(loesungId: string) {
    if (!gewaehltProblem) return;

    const aktuelleLoesung = gewaehltProblem.verknuepfteLoesung;
    const istVerknuepft = aktuelleLoesung.includes(loesungId);

    let neueLoesung: string[];
    if (istVerknuepft) {
      // Nur entfernen wenn noch mindestens einer übrigbleibt (Schema-Gate: min 1)
      if (aktuelleLoesung.length <= 1) return;
      neueLoesung = aktuelleLoesung.filter((id) => id !== loesungId);
    } else {
      neueLoesung = [...aktuelleLoesung, loesungId];
    }

    const neueLokalProbleme = lokalProbleme.map((p) =>
      p.id === gewaehlteProblemId ? { ...p, verknuepfteLoesung: neueLoesung } : p,
    );
    setLokalProbleme(neueLokalProbleme);

    const neueConfigProbleme = config.probleme.map((p) =>
      p.id === gewaehlteProblemId ? { ...p, verknuepfteLoesung: neueLoesung } : p,
    );
    onAendern({ ...config, probleme: neueConfigProbleme });
  }

  return (
    <div>
      <h2>Problem↔Loesung Mapping</h2>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
        <div style={{ minWidth: '200px' }}>
          <h3>Probleme</h3>
          <select
            data-testid="problem-select"
            size={Math.min(lokalProbleme.length, 10)}
            value={gewaehlteProblemId}
            onChange={(e) => handleProblemWechsel(e.target.value)}
            style={{ width: '100%', display: 'block' }}
            aria-label="Problem auswählen"
          >
            {lokalProbleme.map((p) => (
              <option key={p.id} value={p.id}>
                {p.text || p.id} {!p.aktiv ? '(inaktiv)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }}>
          {gewaehltProblem ? (
            <>
              <h3>Loesung für: {gewaehltProblem.text || gewaehltProblem.id}</h3>
              <p style={{ fontSize: '0.85em', color: '#666' }}>
                Mindestens ein Loesung muss verknüpft bleiben (Schema-Gate §5.3).
              </p>
              {config.loesung.map((h) => {
                const istVerknuepft = gewaehltProblem.verknuepfteLoesung.includes(h.id);
                const istEinzig = istVerknuepft && gewaehltProblem.verknuepfteLoesung.length === 1;
                return (
                  <label
                    key={h.id}
                    style={{
                      display: 'block',
                      marginBottom: '0.25rem',
                      opacity: istEinzig ? 0.5 : 1,
                    }}
                    title={istEinzig ? 'Letzte Lösung — kann nicht entfernt werden' : undefined}
                  >
                    <input
                      type="checkbox"
                      data-testid={`loesung-${h.id}`}
                      checked={istVerknuepft}
                      disabled={istEinzig}
                      onChange={() => handleLoesungToggle(h.id)}
                    />{' '}
                    {h.name}{' '}
                    <span style={{ color: '#999', fontSize: '0.8em' }}>
                      (Phase {h.lebenszyklusPhase} · {h.wertKategorie})
                    </span>
                  </label>
                );
              })}
            </>
          ) : (
            <p>Kein Problem ausgewählt.</p>
          )}
        </div>
      </div>
    </div>
  );
}
