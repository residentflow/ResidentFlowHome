import { DATENSCHUTZ_SIGNALE } from '@/content/texte';
import { Section } from '@/components/ui/Section';

/**
 * Datenschutz-Beweis (§9 #8):
 * - Signale: DATENSCHUTZ_SIGNALE
 * - Versprechen: Daten verlassen das Gerät nicht
 * - Läuft lokal, EU/self-hosted, nie US-Cloud
 * Steht nach der Suche — Bestätigung, nicht Behauptung.
 */
export function DatenschutzBeweis() {
  return (
    <Section id="datenschutz-beweis" flaeche ariaLabel="Datenschutz-Beweis">
      <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
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
          {DATENSCHUTZ_SIGNALE}
        </p>

        <h2 style={{ margin: '0 0 1.5rem', fontSize: 'clamp(1.35rem, 2.5vw, 2rem)' }}>
          Ihre Daten verlassen Ihr Gerät nicht.
        </h2>

        <p
          style={{
            lineHeight: 1.7,
            color: 'var(--farbe-text-sekundaer)',
            marginBottom: '1.5rem',
          }}
        >
          Die gesamte Analyse läuft lokal in Ihrem Browser — kein Server empfängt Ihre Eingaben,
          kein Cookie wird gesetzt, kein Tracking findet statt.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            textAlign: 'left',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              padding: '1.25rem',
              background: '#fff',
              border: 'var(--linie)',
              borderRadius: 'var(--radius)',
            }}
          >
            <p style={{ margin: '0 0 0.4rem', fontWeight: 700, fontSize: '0.9rem' }}>Lokal</p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--farbe-text-sekundaer)' }}>
              Berechnung im Browser, keine Datenübertragung
            </p>
          </div>
          <div
            style={{
              padding: '1.25rem',
              background: '#fff',
              border: 'var(--linie)',
              borderRadius: 'var(--radius)',
            }}
          >
            <p style={{ margin: '0 0 0.4rem', fontWeight: 700, fontSize: '0.9rem' }}>EU/self-hosted</p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--farbe-text-sekundaer)' }}>
              Hosting in Europa — nie US-Cloud
            </p>
          </div>
          <div
            style={{
              padding: '1.25rem',
              background: '#fff',
              border: 'var(--linie)',
              borderRadius: 'var(--radius)',
            }}
          >
            <p style={{ margin: '0 0 0.4rem', fontWeight: 700, fontSize: '0.9rem' }}>
              Daten bleiben bei Ihnen
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--farbe-text-sekundaer)' }}>
              Kontakt nur auf Ihren Wunsch
            </p>
          </div>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--farbe-text-sekundaer)' }}>
          EU/self-hosted bedeutet: kein US-amerikanischer Cloud-Anbieter hat Zugriff auf Ihre Daten.
        </p>
      </div>
    </Section>
  );
}
