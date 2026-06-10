import exampleData from '@/content/example-analysis.json';
import { useState } from 'react';
import { copy } from '@/config/checkConfig';

/**
 * BeispielAnalyse — Beweis zum Anfassen, Stufe 0 (PRD §12). Ersetzt jeden Upload.
 * Harte Komplexitäts-Grenze: exakt 3 Metric-Cards, 3 Funde-Klassen (1 Tabelle, max 4 Zeilen),
 * 1 Fußzeile. Keine Tabs/Filter/Charts. Kein Upload-Feld.
 * Build-Gate (§3.4): Platzhalter/nicht-freigegebene Daten werden öffentlich NICHT als echt gezeigt.
 */
interface Fund {
  klasse: string;
  titel: string;
  kurz: string;
  rechenweg: string;
}
interface ExampleData {
  isPlaceholder: boolean;
  publicApproved: boolean;
  einheiten: number;
  metrics: Array<{ label: string; value: string }>;
  funde: Fund[];
  statusZeile: string;
}

export function BeispielAnalyse({ data = exampleData as ExampleData }: { data?: ExampleData }) {
  const [offen, setOffen] = useState<number | null>(null);

  // §3.4/§12: Platzhalter oder nicht freigegeben → niemals als echte Analyse zeigen.
  if (data.isPlaceholder || !data.publicApproved) {
    return (
      <section data-testid="beispiel-analyse-platzhalter" style={{ padding: '1.5rem 1rem' }}>
        <p style={{ color: 'var(--farbe-tinte-weich, #777)' }}>
          Die BeispielAnalyse an unserem eigenen, anonymisierten Bestand wird hier sichtbar, sobald
          die Findings freigegeben sind.
        </p>
      </section>
    );
  }

  return (
    <section
      data-testid="beispiel-analyse"
      style={{ maxWidth: 760, margin: '0 auto', padding: '1.5rem 1rem' }}
    >
      <h2>So sieht eine echte Analyse aus — an unserem eigenen Bestand</h2>
      <p data-testid="example-badge" style={{ color: '#666' }}>
        Unsere eigene Mieterliste · {data.einheiten} Einheiten · anonymisiert · echt
      </p>

      {/* 3 Metric-Cards */}
      <div
        data-testid="metric-cards"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}
      >
        {data.metrics.slice(0, 3).map((m) => (
          <div
            key={m.label}
            style={{
              border: '1px solid var(--farbe-linie,#eee)',
              borderRadius: 8,
              padding: '0.75rem',
            }}
          >
            <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{m.value}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Funde-Tabelle: exakt 3 Klassen, max 4 Zeilen, je Zeile expandierbar */}
      <table
        data-testid="funde-tabelle"
        style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}
      >
        <tbody>
          {data.funde.slice(0, 4).map((f, i) => (
            <tr
              key={f.klasse}
              data-testid={`fund-${f.klasse}`}
              style={{ borderTop: '1px solid #eee' }}
            >
              <td style={{ padding: '0.6rem 0' }}>
                <button
                  type="button"
                  data-testid={`fund-toggle-${i}`}
                  onClick={() => setOffen(offen === i ? null : i)}
                  aria-expanded={offen === i}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    font: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <strong>{f.titel}</strong> — {f.kurz}
                </button>
                {offen === i && (
                  <p
                    data-testid={`fund-rechenweg-${i}`}
                    style={{ margin: '0.4rem 0 0', color: '#555' }}
                  >
                    {f.rechenweg}
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Fußzeile: System-Satz + Status + Brücke + Prüfpaket-Sekundärlink */}
      <footer style={{ marginTop: '1rem' }}>
        <p data-testid="system-satz" style={{ fontWeight: 600 }}>
          {copy('copy.systemSatz')}
        </p>
        <p style={{ color: '#555' }}>{data.statusZeile}</p>
        <a data-testid="example-bridge" href="#termin">
          {copy('cta.exampleBridge')}
        </a>
        <p style={{ marginTop: '0.5rem' }}>
          <a data-testid="pruefpaket-link" href="/mietanpassungs-pruefpaket">
            Sie arbeiten bereits mit Claude, ChatGPT oder einem anderen KI-Assistenten? Holen Sie
            sich das Mietanpassungs-Prüfpaket.
          </a>
        </p>
      </footer>
    </section>
  );
}
