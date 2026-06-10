import { Section } from '@/components/ui/Section';

/**
 * Beweis-Abschnitt (§9 #4):
 * - Echte Findings in € „aus unserem eigenen Portfolio"
 * - Founder-Micro-Zitat mit Foto-Platzhalter und Name (Stefan)
 * Keine erfundenen Zahlen; Findings sind konservativ und klar als Spanne gerahmt.
 */
export function Beweis() {
  return (
    <Section id="beweis" flaeche ariaLabel="Beweis aus eigenem Portfolio">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--farbe-akzent)',
            margin: '0 0 0.75rem',
          }}
        >
          aus unserem eigenen Portfolio
        </p>
        <h2 style={{ margin: 0, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
          Was wir in unserem Bestand gefunden haben
        </h2>
      </div>

      {/* Findings */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            border: 'var(--linie)',
            borderRadius: 'var(--radius)',
            background: '#fff',
          }}
        >
          <p
            style={{
              margin: '0 0 0.5rem',
              fontSize: '0.8rem',
              color: 'var(--farbe-text-sekundaer)',
            }}
          >
            Mietpotenzial (nicht gezogene Indexmieten)
          </p>
          <p
            style={{
              margin: '0 0 0.75rem',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--farbe-akzent)',
            }}
          >
            18.000 – 42.000 €
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--farbe-text-sekundaer)' }}>
            p.a. · bei ~80 Einheiten
          </p>
        </div>

        <div
          style={{
            padding: '1.5rem',
            border: 'var(--linie)',
            borderRadius: 'var(--radius)',
            background: '#fff',
          }}
        >
          <p
            style={{
              margin: '0 0 0.5rem',
              fontSize: '0.8rem',
              color: 'var(--farbe-text-sekundaer)',
            }}
          >
            Betriebskosten-Korrekturen
          </p>
          <p
            style={{
              margin: '0 0 0.75rem',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--farbe-akzent)',
            }}
          >
            4.500 – 12.000 €
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--farbe-text-sekundaer)' }}>
            p.a. · erkannte Abrechnungsfehler
          </p>
        </div>

        <div
          style={{
            padding: '1.5rem',
            border: 'var(--linie)',
            borderRadius: 'var(--radius)',
            background: '#fff',
          }}
        >
          <p
            style={{
              margin: '0 0 0.5rem',
              fontSize: '0.8rem',
              color: 'var(--farbe-text-sekundaer)',
            }}
          >
            Leerstandsoptimierung
          </p>
          <p
            style={{
              margin: '0 0 0.75rem',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--farbe-akzent)',
            }}
          >
            6.000 – 19.000 €
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--farbe-text-sekundaer)' }}>
            p.a. · verkürzte Leerstandsdauer
          </p>
        </div>
      </div>

      {/* Founder-Micro-Zitat */}
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'flex-start',
          maxWidth: '640px',
          margin: '0 auto',
          padding: '2rem',
          background: '#fff',
          border: 'var(--linie)',
          borderRadius: 'var(--radius)',
        }}
      >
        {/* Foto-Platzhalter */}
        <div
          aria-label="Foto Stefan"
          style={{
            flexShrink: 0,
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--farbe-flaeche)',
            border: 'var(--linie)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
          }}
        ></div>

        <div>
          <blockquote
            style={{
              margin: '0 0 0.75rem',
              fontStyle: 'italic',
              lineHeight: 1.6,
              fontSize: '1rem',
            }}
          >
            „Ich habe diese Funde zuerst in meinem eigenen Bestand gemacht — mit eigenem Geld. Erst
            dann habe ich daraus ein System gebaut."
          </blockquote>
          <footer style={{ fontSize: '0.875rem', color: 'var(--farbe-text-sekundaer)' }}>
            <strong>Stefan</strong> · Gründer &amp; Bestandshalter
          </footer>
        </div>
      </div>
    </Section>
  );
}
