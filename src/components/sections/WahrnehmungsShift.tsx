import React from 'react';
import { Section } from '@/components/ui/Section';

interface WahrnehmungsPaar {
  andereSehen: string;
  wirSehen: string;
}

const PAARE: WahrnehmungsPaar[] = [
  {
    andereSehen: 'Leerstände',
    wirSehen: 'Nicht gezogene Mieterhöhungen',
  },
  {
    andereSehen: 'Dokumente',
    wirSehen: 'Versteckte Ertragspotenziale',
  },
  {
    andereSehen: 'Verwaltungsaufwand',
    wirSehen: 'Optimierbarer Prozess',
  },
];

/**
 * Wahrnehmungs-Shift (§9 #2):
 * Kontrastiert „Was andere sehen" mit „Was wir sehen" — aus eigenem Bestand identifiziert.
 */
export function WahrnehmungsShift() {
  return (
    <Section id="wahrnehmung" flaeche ariaLabel="Was andere sehen — was wir sehen">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ margin: '0 0 0.75rem', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
          Derselbe Bestand. Ein anderer Blick.
        </h2>
        <p style={{ color: 'var(--farbe-text-sekundaer)', maxWidth: '560px', margin: '0 auto' }}>
          Aus unserem eigenen Portfolio identifiziert — nicht konstruiert.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          // minmax(0, …): Zellen dürfen unter ihre Inhaltsbreite schrumpfen — sonst
          // schiebt z. B. „Verwaltungsaufwand" das Raster auf Mobile über den Viewport.
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: '0',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* Spaltenköpfe */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            fontWeight: 700,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--farbe-text-sekundaer)',
            borderBottom: 'var(--linie)',
          }}
        >
          Was andere sehen
        </div>
        <div
          style={{
            padding: '0.75rem 1.5rem',
            fontWeight: 700,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--farbe-akzent)',
            borderBottom: 'var(--linie)',
            borderLeft: '2px solid var(--farbe-akzent)',
          }}
        >
          Was wir sehen
        </div>

        {/* Paare */}
        {PAARE.map((paar, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                padding: '1rem 1.5rem',
                color: 'var(--farbe-text-sekundaer)',
                borderBottom: i < PAARE.length - 1 ? 'var(--linie)' : 'none',
              }}
            >
              {paar.andereSehen}
            </div>
            <div
              style={{
                padding: '1rem 1.5rem',
                fontWeight: 600,
                borderBottom: i < PAARE.length - 1 ? 'var(--linie)' : 'none',
                borderLeft: '2px solid var(--farbe-akzent)',
              }}
            >
              {paar.wirSehen}
            </div>
          </React.Fragment>
        ))}
      </div>
    </Section>
  );
}
