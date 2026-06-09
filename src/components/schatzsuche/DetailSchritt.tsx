import type { Loesung } from '@/domain/schema/loesung';
import type { LoesungLaufzeit } from '@/domain/types';

interface DetailSchrittProps {
  loesung: Loesung[];
  laufzeiten: LoesungLaufzeit[];
  detailAngaben: Record<string, Record<string, number>>;
  onDetailAngabe: (loesungId: string, frageKey: string, wert: number) => void;
}

function formatierteSpanne(min: number, max: number): string {
  const fmt = (n: number) => n.toLocaleString('de-DE');
  return `${fmt(min)} – ${fmt(max)} €`;
}

const FRAGE_LABELS: Record<string, string> = {
  einheitenMitPotenzial: 'Wie viele Einheiten haben Mietpotenzial?',
  neuvermietungenProJahr: 'Wie viele Neuvermietungen pro Jahr?',
};

function frageLabel(key: string): string {
  return FRAGE_LABELS[key] ?? key;
}

/**
 * Schritt 4: Selbstauskunft je relevantem Loesung → Spanne via uebergang (§7 / §8.4).
 * Zeigt Euro-Spanne erst nach Eingabe der Detailfrage (Spannen-Zwang §7/§17).
 */
export function DetailSchritt({
  loesung,
  laufzeiten,
  detailAngaben,
  onDetailAngabe,
}: DetailSchrittProps) {
  const laufzeitMap = new Map(laufzeiten.map((l) => [l.loesungId, l]));

  return (
    <div data-testid="schritt-detail">
      <h2 style={{ marginBottom: '0.5rem' }}>Ihr Potenzial wird berechnet</h2>
      <p style={{ marginBottom: '1.5rem', color: 'var(--farbe-text-leise, #666)' }}>
        Eine Detailangabe pro Loesung genügt für Ihre persönliche Spanne.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loesung.map((h) => {
          const laufzeit = laufzeitMap.get(h.id);
          const angabenFuerLoesung = detailAngaben[h.id] ?? {};

          return (
            <article
              key={h.id}
              style={{
                padding: '1.25rem',
                border: '1px solid var(--farbe-linie, #e0e0e0)',
                borderRadius: 'var(--radius, 4px)',
                background: '#fff',
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>{h.name}</h3>
              <p
                style={{
                  margin: '0 0 1rem',
                  fontSize: '0.9rem',
                  color: 'var(--farbe-text-leise, #666)',
                }}
              >
                {h.kartenText}
              </p>

              {/* Euro-Spanne NUR nach Selbstauskunft (§7 Spannen-Zwang) */}
              {laufzeit?.spanne && (
                <p
                  style={{
                    margin: '0 0 1rem',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: 'var(--farbe-akzent, #b8860b)',
                  }}
                >
                  {formatierteSpanne(laufzeit.spanne.min, laufzeit.spanne.max)} p.a.
                </p>
              )}

              {/* Qualitativer Nutzen bei nicht-quantifizierbaren Loesungn */}
              {!laufzeit?.spanne && laufzeit?.nutzenAussage && (
                <p
                  style={{
                    margin: '0 0 1rem',
                    fontSize: '0.95rem',
                    color: 'var(--farbe-text-leise, #666)',
                  }}
                >
                  {laufzeit.nutzenAussage}
                </p>
              )}

              {/* Detailfragen für quantifizierbare Loesung */}
              {h.detailFragen.map((frageKey) => (
                <div key={frageKey} style={{ marginTop: '0.75rem' }}>
                  <label
                    htmlFor={`${h.id}-${frageKey}`}
                    style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500 }}
                  >
                    {frageLabel(frageKey)}
                  </label>
                  <input
                    id={`${h.id}-${frageKey}`}
                    type="number"
                    min={0}
                    step={1}
                    defaultValue={angabenFuerLoesung[frageKey] ?? ''}
                    onChange={(e) => {
                      const wert = parseInt(e.target.value, 10);
                      if (!isNaN(wert)) {
                        onDetailAngabe(h.id, frageKey, wert);
                      }
                    }}
                    style={{
                      font: 'inherit',
                      fontSize: '1rem',
                      padding: '0.4rem 0.75rem',
                      border: '1px solid var(--farbe-linie, #e0e0e0)',
                      borderRadius: 'var(--radius, 4px)',
                      width: '140px',
                    }}
                  />
                </div>
              ))}
            </article>
          );
        })}
      </div>
    </div>
  );
}
