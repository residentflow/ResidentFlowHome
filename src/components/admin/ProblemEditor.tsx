import { useState } from 'react';
import type { Config } from '@/domain/schema/config';
import type { Problem } from '@/domain/schema/problem';
import { ROLLEN } from '@/domain/enums';

interface Props {
  config: Config;
  onAendern: (neu: Config) => void;
}

function leeresProblem(): Problem {
  return {
    id: `problem-${Date.now()}`,
    schmerzBereich: '',
    text: '',
    rollenFilter: ['buyAndHold'],
    verknuepfteLoesung: [''],
    aktiv: true,
  };
}

/**
 * CRUD-Editor für Probleme (§13.2).
 * Deaktivieren ohne Löschen via aktiv-Flag (§13.3).
 */
export function ProblemEditor({ config, onAendern }: Props) {
  const [editiertesId, setEditiertesId] = useState<string | null>(null);
  const [entwurf, setEntwurf] = useState<Problem | null>(null);
  const [fehler, setFehler] = useState('');

  function handleNeu() {
    const neu = leeresProblem();
    setEntwurf(neu);
    setEditiertesId(neu.id);
    setFehler('');
    onAendern({ ...config, probleme: [...config.probleme, neu] });
  }

  function handleBearbeiten(problem: Problem) {
    setEntwurf({ ...problem });
    setEditiertesId(problem.id);
    setFehler('');
  }

  function handleFeldAendern(feld: keyof Problem, wert: unknown) {
    if (!entwurf) return;
    setEntwurf({ ...entwurf, [feld]: wert } as Problem);
  }

  function handleSpeichern() {
    if (!entwurf) return;

    if (!entwurf.text.trim()) {
      setFehler('Text ist Pflicht.');
      return;
    }
    if (!entwurf.schmerzBereich.trim()) {
      setFehler('Schmerzbereich ist Pflicht.');
      return;
    }
    const loesung = entwurf.verknuepfteLoesung.filter((h) => h.trim() !== '');
    if (loesung.length === 0) {
      setFehler('Mindestens eine verknüpfte Lösung ist Pflicht.');
      return;
    }

    const gespeichert: Problem = { ...entwurf, verknuepfteLoesung: loesung };
    const neuProbleme = config.probleme.map((p) => (p.id === gespeichert.id ? gespeichert : p));
    onAendern({ ...config, probleme: neuProbleme });
    setEditiertesId(null);
    setEntwurf(null);
    setFehler('');
  }

  function handleAbbrechen() {
    setEditiertesId(null);
    setEntwurf(null);
    setFehler('');
  }

  function handleDeaktivieren(id: string) {
    const neuProbleme = config.probleme.map((p) => (p.id === id ? { ...p, aktiv: false } : p));
    onAendern({ ...config, probleme: neuProbleme });
  }

  function handleAktivieren(id: string) {
    const neuProbleme = config.probleme.map((p) => (p.id === id ? { ...p, aktiv: true } : p));
    onAendern({ ...config, probleme: neuProbleme });
  }

  function handleLoeschen(id: string) {
    const neuProbleme = config.probleme.filter((p) => p.id !== id);
    onAendern({ ...config, probleme: neuProbleme });
    if (editiertesId === id) {
      setEditiertesId(null);
      setEntwurf(null);
    }
  }

  return (
    <div>
      <h2>Probleme</h2>
      <button onClick={handleNeu} aria-label="Neu anlegen">
        Neu anlegen
      </button>

      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Text</th>
            <th style={{ textAlign: 'left' }}>Bereich</th>
            <th style={{ textAlign: 'left' }}>Aktiv</th>
            <th style={{ textAlign: 'left' }}>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {config.probleme.map((problem) => (
            <tr key={problem.id} style={{ opacity: problem.aktiv ? 1 : 0.5 }}>
              <td>{problem.text || <em>(leer)</em>}</td>
              <td>{problem.schmerzBereich}</td>
              <td>{problem.aktiv ? 'Ja' : 'Nein'}</td>
              <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => handleBearbeiten(problem)}>Bearbeiten</button>
                {problem.aktiv ? (
                  <button
                    onClick={() => handleDeaktivieren(problem.id)}
                    aria-label={`aktiv (${problem.id})`}
                  >
                    Deaktivieren
                  </button>
                ) : (
                  <button
                    onClick={() => handleAktivieren(problem.id)}
                    aria-label={`inaktiv (${problem.id})`}
                  >
                    Aktivieren
                  </button>
                )}
                <button onClick={() => handleLoeschen(problem.id)}>Löschen</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editiertesId && entwurf && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h3>{entwurf.id.startsWith('problem-') ? 'Neues Problem' : 'Problem bearbeiten'}</h3>

          {fehler && (
            <p role="alert" style={{ color: 'red' }}>
              {fehler}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label>
              ID
              <input
                type="text"
                value={entwurf.id}
                onChange={(e) => handleFeldAendern('id', e.target.value)}
                style={{ display: 'block', width: '100%' }}
              />
            </label>

            <label>
              Text (Nutzersprache)
              <input
                type="text"
                value={entwurf.text}
                placeholder="z.B. Mieterhöhungen werden nicht konsequent gezogen"
                onChange={(e) => handleFeldAendern('text', e.target.value)}
                style={{ display: 'block', width: '100%' }}
              />
            </label>

            <label>
              Schmerzbereich
              <input
                type="text"
                value={entwurf.schmerzBereich}
                placeholder="z.B. ertrag"
                onChange={(e) => handleFeldAendern('schmerzBereich', e.target.value)}
                style={{ display: 'block', width: '100%' }}
              />
            </label>

            <fieldset>
              <legend>Rollen-Filter</legend>
              {ROLLEN.map((rolle) => (
                <label key={rolle} style={{ display: 'block' }}>
                  <input
                    type="checkbox"
                    checked={entwurf.rollenFilter.includes(rolle)}
                    onChange={(e) => {
                      const aktuelle = entwurf.rollenFilter;
                      const neu = e.target.checked
                        ? ([...aktuelle, rolle] as (typeof ROLLEN)[number][])
                        : aktuelle.filter((r) => r !== rolle);
                      handleFeldAendern('rollenFilter', neu);
                    }}
                  />{' '}
                  {rolle}
                </label>
              ))}
            </fieldset>

            <label>
              Verknüpfte Loesung (kommagetrennte IDs)
              <input
                type="text"
                value={entwurf.verknuepfteLoesung.join(', ')}
                placeholder="z.B. mietpotenzial, virtuelles-staging"
                onChange={(e) =>
                  handleFeldAendern(
                    'verknuepfteLoesung',
                    e.target.value.split(',').map((s) => s.trim()),
                  )
                }
                style={{ display: 'block', width: '100%' }}
              />
            </label>

            <label>
              <input
                type="checkbox"
                checked={entwurf.aktiv}
                onChange={(e) => handleFeldAendern('aktiv', e.target.checked)}
              />{' '}
              Aktiv
            </label>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleSpeichern}>Speichern</button>
            <button onClick={handleAbbrechen}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
}
