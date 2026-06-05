import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Taetigkeit } from '@/domain/enums';

interface TaetigkeitSchrittProps {
  gewaehlt: Taetigkeit[];
  onWeiter: (taetigkeiten: Taetigkeit[]) => void;
}

const TAETIGKEIT_OPTIONEN: Array<{ taetigkeit: Taetigkeit; label: string; beschreibung: string }> = [
  {
    taetigkeit: 'A',
    label: 'Verwaltung eigener Immobilien',
    beschreibung: 'Buy & Hold, Bestandshaltung, Family Office',
  },
  {
    taetigkeit: 'B',
    label: 'Betreuung fremder Bestände',
    beschreibung: 'Hausverwaltung, Asset Management, Immobilienberatung, Makler, Steuerberater',
  },
  {
    taetigkeit: 'C',
    label: 'Entwicklung / Fix & Flip',
    beschreibung: 'Projektentwicklung, Fix & Flip',
  },
];

/**
 * Schritt 1: Tätigkeit (Mehrfachauswahl A/B/C) — §8.1 / §3.2.
 */
export function TaetigkeitSchritt({ gewaehlt, onWeiter }: TaetigkeitSchrittProps) {
  const [ausgewaehlt, setAusgewaehlt] = useState<Taetigkeit[]>(gewaehlt);

  function toggle(taetigkeit: Taetigkeit) {
    setAusgewaehlt((prev) =>
      prev.includes(taetigkeit) ? prev.filter((t) => t !== taetigkeit) : [...prev, taetigkeit],
    );
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {TAETIGKEIT_OPTIONEN.map(({ taetigkeit, label, beschreibung }) => {
          const istGewaehlt = ausgewaehlt.includes(taetigkeit);
          return (
            <label
              key={taetigkeit}
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
                onChange={() => toggle(taetigkeit)}
                aria-label={label}
                style={{ marginTop: '2px', flexShrink: 0 }}
              />
              <div>
                <span style={{ fontWeight: 600 }}>{label}</span>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--farbe-text-leise, #666)' }}>
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
