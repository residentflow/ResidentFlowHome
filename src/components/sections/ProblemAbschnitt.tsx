import { Section } from '@/components/ui/Section';

/**
 * Problem-Abschnitt (§9 #3):
 * - Konkreter Alltag der Zielgruppe
 * - Entlastung: nicht weil das Team schlecht arbeitet — sondern weil kein System es systematisch findet
 * - Merk-Zahl als Spanne (z.B. 25.000–90.000 €)
 * Kein Verkauf, keine Lösungsversprechen hier.
 */
export function ProblemAbschnitt() {
  return (
    <Section id="problem" ariaLabel="Das Problem">
      <div style={{ maxWidth: '680px' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
          Warum bleibt Ertrag liegen — auch bei professionell geführten Beständen?
        </h2>

        <p
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            color: 'var(--farbe-text-sekundaer)',
          }}
        >
          Mieterhöhungen werden übersehen. Indexklauseln laufen ab. Betriebskostenabrechnungen
          enthalten Fehler, die niemand findet — weil alle mit der nächsten Aufgabe beschäftigt
          sind.
        </p>

        <p
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.7,
            marginBottom: '2rem',
          }}
        >
          Das liegt nicht daran, dass Ihr Team schlecht arbeitet —{' '}
          <strong>sondern weil kein System es systematisch findet.</strong>
        </p>

        {/* Merk-Zahl als Spanne */}
        <div
          style={{
            background: 'var(--farbe-flaeche)',
            borderLeft: '3px solid var(--farbe-akzent)',
            padding: '1.5rem 2rem',
            marginBottom: '1.5rem',
          }}
        >
          <p
            style={{
              margin: '0 0 0.5rem',
              fontSize: '0.875rem',
              color: 'var(--farbe-text-sekundaer)',
            }}
          >
            Typisches ungenutztes Potenzial bei ~150 Einheiten
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--farbe-akzent)',
            }}
          >
            25.000–90.000 €
          </p>
          <p
            style={{
              margin: '0.5rem 0 0',
              fontSize: '0.875rem',
              color: 'var(--farbe-text-sekundaer)',
            }}
          >
            p.a. — als konservative Spanne, aus eigenem Bestand abgeleitet
          </p>
        </div>

        <p style={{ color: 'var(--farbe-text-sekundaer)', lineHeight: 1.6 }}>
          Die meisten Eigentümer und Verwalter wissen, dass Potenzial da ist. Sie haben nur kein
          System, das es verlässlich und vollständig ans Licht bringt.
        </p>
      </div>
    </Section>
  );
}
