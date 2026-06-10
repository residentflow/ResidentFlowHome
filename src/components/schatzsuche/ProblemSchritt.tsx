import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { filterProbleme } from '@/domain/engine/filterProbleme';
import type { Rolle } from '@/domain/enums';
import type { Problem } from '@/domain/schema/problem';
import type { SchmerzBereich } from '@/domain/schema/schmerzBereich';

interface ProblemSchrittProps {
  rollen: Rolle[];
  relevanteEinheiten: number;
  schmerzBereiche: SchmerzBereich[];
  probleme: Problem[];
  gewaehlt: string[];
  onWeiter: (problemIds: string[]) => void;
}

/**
 * Schritt 3: Zweistufige Problem-Auswahl — §5.1 / §8.1.
 * Stufe A: grobe Schmerz-Bereiche.
 * Stufe B: konkrete Probleme nach Rolle+Größe gefiltert, Mehrfachauswahl.
 */
export function ProblemSchritt({
  rollen,
  relevanteEinheiten,
  schmerzBereiche,
  probleme,
  gewaehlt,
  onWeiter,
}: ProblemSchrittProps) {
  const [gewaehlterBereich, setGewaehlterBereich] = useState<string | null>(null);
  const [gewaehlteProbleme, setGewaehlteProbleme] = useState<string[]>(gewaehlt);

  const sortierteSchmerzBereiche = [...schmerzBereiche].sort(
    (a, b) => a.reihenfolge - b.reihenfolge,
  );

  const gefilterteProblemeStufeB = gewaehlterBereich
    ? filterProbleme(probleme, {
        rollen,
        relevanteEinheiten,
        schmerzBereichId: gewaehlterBereich,
      })
    : [];

  function toggleProblem(id: string) {
    setGewaehlteProbleme((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  function handleWeiter() {
    onWeiter(gewaehlteProbleme);
  }

  // Stufe A: Schmerz-Bereiche
  if (!gewaehlterBereich) {
    return (
      <div data-testid="schritt-probleme">
        <h2 style={{ marginBottom: '1.5rem' }}>Wo drückt der Schuh am stärksten?</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--farbe-text-leise, #666)' }}>
          Wählen Sie einen Bereich, der Sie beschäftigt.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '0.75rem',
            marginBottom: '2rem',
          }}
        >
          {sortierteSchmerzBereiche.map((bereich) => (
            <button
              key={bereich.id}
              onClick={() => setGewaehlterBereich(bereich.id)}
              style={{
                font: 'inherit',
                cursor: 'pointer',
                padding: '1rem',
                border: '1px solid var(--farbe-linie, #e0e0e0)',
                borderRadius: 'var(--radius, 4px)',
                background: '#fff',
                textAlign: 'left',
                fontWeight: 500,
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              {bereich.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Stufe B: Konkrete Probleme
  const aktuellerBereich = schmerzBereiche.find((b) => b.id === gewaehlterBereich);

  return (
    <div data-testid="schritt-probleme">
      <button
        onClick={() => setGewaehlterBereich(null)}
        style={{
          font: 'inherit',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          color: 'var(--farbe-akzent, #b8860b)',
          padding: '0 0 1rem',
          fontSize: '0.9rem',
        }}
      >
        ← Zurück zu den Bereichen
      </button>

      <h2 style={{ marginBottom: '0.5rem' }}>{aktuellerBereich?.name ?? 'Konkrete Probleme'}</h2>
      <p style={{ marginBottom: '1rem', color: 'var(--farbe-text-leise, #666)' }}>
        Was beschreibt Ihre Situation am besten? (Mehrfachauswahl)
      </p>

      {gefilterteProblemeStufeB.length === 0 ? (
        <p style={{ color: 'var(--farbe-text-leise, #666)' }}>
          Keine passenden Probleme für Ihre Rolle gefunden.
        </p>
      ) : (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}
        >
          {gefilterteProblemeStufeB.map((problem) => {
            const istGewaehlt = gewaehlteProbleme.includes(problem.id);
            return (
              <label
                key={problem.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  border: `1px solid ${istGewaehlt ? 'var(--farbe-akzent, #b8860b)' : 'var(--farbe-linie, #e0e0e0)'}`,
                  borderRadius: 'var(--radius, 4px)',
                  cursor: 'pointer',
                  background: istGewaehlt ? 'var(--farbe-flaeche, #fafaf5)' : '#fff',
                }}
              >
                <input
                  type="checkbox"
                  checked={istGewaehlt}
                  onChange={() => toggleProblem(problem.id)}
                  style={{ flexShrink: 0 }}
                />
                <span>{problem.text}</span>
              </label>
            );
          })}
        </div>
      )}

      <Button onClick={handleWeiter}>Weiter</Button>
    </div>
  );
}
