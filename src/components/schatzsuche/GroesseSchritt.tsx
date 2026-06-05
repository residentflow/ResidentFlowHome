import { Button } from '@/components/ui/Button';
import type { Taetigkeit } from '@/domain/enums';
import type { RoutingGroessen } from '@/domain/types';

interface GroesseSchrittProps {
  taetigkeiten: Taetigkeit[];
  groessen: RoutingGroessen;
  onGroesseAendern: (taetigkeit: Taetigkeit, wert: number) => void;
  onWeiter: () => void;
}

const GROESSEN_KONFIGURATION: Record<
  Taetigkeit,
  { label: string; beschreibung: string; einheit: string }
> = {
  A: {
    label: 'Anzahl Einheiten im eigenen Bestand',
    beschreibung: 'Wohnungen, Gewerbeeinheiten, Stellplätze etc. in eigenem Eigentum',
    einheit: 'eigene Einheiten',
  },
  B: {
    label: 'Anzahl betreuter Einheiten',
    beschreibung: 'Einheiten, die Sie für Dritte verwalten oder betreuen',
    einheit: 'betreute Einheiten',
  },
  C: {
    label: 'Vermarktungen / Verkäufe pro Jahr',
    beschreibung: 'Durchschnittliche Anzahl an Vermarktungen oder Verkäufen pro Jahr',
    einheit: 'Vermarktungen/Jahr',
  },
};

/**
 * Schritt 2: Adaptive Größenfrage je Tätigkeit — §3.3 / §8.1.
 * A → eigene Einheiten · B → betreute Einheiten · C → Vermarktungen/Jahr.
 */
export function GroesseSchritt({
  taetigkeiten,
  groessen,
  onGroesseAendern,
  onWeiter,
}: GroesseSchrittProps) {
  function alleGefuellt(): boolean {
    return taetigkeiten.every((t) => {
      const wert = groessen[t];
      return typeof wert === 'number' && wert >= 0;
    });
  }

  return (
    <div data-testid="schritt-groesse">
      <h2 style={{ marginBottom: '1.5rem' }}>Wie groß ist Ihr Bestand?</h2>

      {taetigkeiten.length === 0 && (
        <p style={{ marginBottom: '2rem', color: 'var(--farbe-text-leise, #666)' }}>
          Für Ihre Tätigkeit ist die Bestandsgröße nicht entscheidend — Sie können direkt
          fortfahren.
        </p>
      )}

      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}
      >
        {taetigkeiten.map((taetigkeit) => {
          const konfig = GROESSEN_KONFIGURATION[taetigkeit];
          return (
            <div key={taetigkeit}>
              <label
                htmlFor={`groesse-${taetigkeit}`}
                style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}
              >
                {konfig.label}
              </label>
              <p
                style={{
                  margin: '0 0 0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--farbe-text-leise, #666)',
                }}
              >
                {konfig.beschreibung}
              </p>
              <input
                id={`groesse-${taetigkeit}`}
                type="number"
                min={0}
                step={1}
                value={groessen[taetigkeit] ?? ''}
                onChange={(e) => {
                  const wert = parseInt(e.target.value, 10);
                  if (!isNaN(wert)) {
                    onGroesseAendern(taetigkeit, wert);
                  }
                }}
                placeholder={`Anzahl ${konfig.einheit}`}
                style={{
                  font: 'inherit',
                  fontSize: '1.1rem',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--farbe-linie, #e0e0e0)',
                  borderRadius: 'var(--radius, 4px)',
                  width: '180px',
                }}
              />
            </div>
          );
        })}
      </div>

      <Button onClick={onWeiter} disabled={!alleGefuellt()}>
        Weiter
      </Button>
    </div>
  );
}
