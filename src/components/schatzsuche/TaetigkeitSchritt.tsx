import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TAETIGKEITSPROFILE, type ProfilId } from '@/content/taetigkeitsprofile';

interface TaetigkeitSchrittProps {
  gewaehlt: ProfilId[];
  onWeiter: (profile: ProfilId[]) => void;
}

/**
 * Schritt 1: Tätigkeitsprofil (Mehrfachauswahl) — §3.2/§3.3/§8.1.
 * Vier getrennte Profile, damit der Multiplikator-Pfad (Steuerberater/Makler → Partnerprogramm)
 * von der reinen Bestandsverwaltung unterscheidbar ist.
 */
export function TaetigkeitSchritt({ gewaehlt, onWeiter }: TaetigkeitSchrittProps) {
  const [ausgewaehlt, setAusgewaehlt] = useState<ProfilId[]>(gewaehlt);

  function toggle(id: ProfilId) {
    setAusgewaehlt((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function handleWeiter() {
    if (ausgewaehlt.length === 0) return;
    onWeiter(ausgewaehlt);
  }

  return (
    <div data-testid="schritt-taetigkeit">
      <h2 style={{ marginBottom: '1.5rem' }}>Was beschreibt Ihre Tätigkeit am besten?</h2>
      <p style={{ marginBottom: '1rem', color: 'var(--farbe-text-leise, #666)' }}>
        Mehrfachauswahl möglich.
      </p>

      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}
      >
        {TAETIGKEITSPROFILE.map(({ id, label, beschreibung }) => {
          const istGewaehlt = ausgewaehlt.includes(id);
          return (
            <label
              key={id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '1rem',
                border: `1px solid ${istGewaehlt ? 'var(--farbe-akzent, #b8860b)' : 'var(--farbe-linie, #e0e0e0)'}`,
                borderRadius: 'var(--radius, 4px)',
                cursor: 'pointer',
                background: istGewaehlt ? 'var(--farbe-flaeche, #fafaf5)' : '#fff',
              }}
            >
              <input
                type="checkbox"
                checked={istGewaehlt}
                onChange={() => toggle(id)}
                aria-label={label}
                style={{ marginTop: '2px', flexShrink: 0 }}
              />
              <div>
                <span style={{ fontWeight: 600 }}>{label}</span>
                <p
                  style={{
                    margin: '0.25rem 0 0',
                    fontSize: '0.85rem',
                    color: 'var(--farbe-text-leise, #666)',
                  }}
                >
                  {beschreibung}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      <Button onClick={handleWeiter} disabled={ausgewaehlt.length === 0}>
        Weiter
      </Button>
    </div>
  );
}
