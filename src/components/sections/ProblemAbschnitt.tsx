/**
 * Problem-Abschnitt (§9 #3) — Richtung A „Editorial Report":
 * Vollflächiges Tannengrün-Band, links der Problemtext mit Entlastung, rechts die Merk-Zahl
 * als Spanne in einer gold-akzentuierten Kennzahl-Box. Kein Verkauf, keine Lösungsversprechen.
 */
export function ProblemAbschnitt() {
  return (
    <section
      id="problem"
      aria-label="Das Problem"
      style={{ background: 'var(--farbe-akzent)', color: 'var(--farbe-auf-dunkel)' }}
    >
      <div
        style={{
          maxWidth: 'var(--breite-inhalt)',
          margin: '0 auto',
          padding: 'var(--raum-6) var(--raum-3)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: 'var(--raum-5)',
          alignItems: 'center',
        }}
        className="rf-problem-grid"
      >
        <div>
          <p className="rf-eyebrow" style={{ color: 'var(--farbe-gold)' }}>
            Das eigentliche Problem
          </p>
          <h2
            style={{
              color: '#fff',
              fontSize: 'clamp(1.8rem, 3.4vw, 2.7rem)',
              marginBottom: '1.25rem',
            }}
          >
            Warum bleibt Ertrag liegen — auch bei professionell geführten Beständen?
          </h2>

          <p
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#cdd6cb',
              marginBottom: '1.25rem',
            }}
          >
            Mieterhöhungen werden übersehen. Indexklauseln laufen ab. Betriebskostenabrechnungen
            enthalten Fehler, die niemand findet — weil alle mit der nächsten Aufgabe beschäftigt
            sind.
          </p>

          <p style={{ fontSize: '1.15rem', lineHeight: 1.6, color: '#fff' }}>
            Das liegt nicht daran, dass Ihr Team schlecht arbeitet —{' '}
            <strong>sondern weil kein System es systematisch findet.</strong>
          </p>
        </div>

        {/* Merk-Zahl als Spanne — gold akzentuiert */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderLeft: '3px solid var(--farbe-gold)',
            borderRadius: 'var(--radius-gross)',
            padding: 'var(--raum-4)',
          }}
        >
          <p
            style={{
              margin: '0 0 0.75rem',
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#cdd6cb',
            }}
          >
            Typisches ungenutztes Potenzial bei ~150 Einheiten
          </p>
          <p
            style={{
              margin: '0 0 0.6rem',
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(2.2rem, 4vw, 3rem)',
              fontWeight: 500,
              lineHeight: 1,
              color: '#fff',
            }}
          >
            25.000–90.000 €
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#b9c3b6' }}>
            p.a. — als konservative Spanne, aus eigenem Bestand abgeleitet
          </p>
        </div>
      </div>
    </section>
  );
}
