import React from 'react';
import { Section } from '@/components/ui/Section';

interface WahrnehmungsPaar {
  andereSehen: string;
  wirSehen: string;
}

const PAARE: WahrnehmungsPaar[] = [
  { andereSehen: 'Leerstände', wirSehen: 'Nicht gezogene Mieterhöhungen' },
  { andereSehen: 'Dokumente', wirSehen: 'Versteckte Ertragspotenziale' },
  { andereSehen: 'Verwaltungsaufwand', wirSehen: 'Optimierbarer Prozess' },
];

const kopf: React.CSSProperties = {
  padding: '1.25rem 1.75rem',
  fontWeight: 600,
  fontSize: '0.74rem',
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  borderBottom: 'var(--linie)',
};

/**
 * Wahrnehmungs-Shift (§9 #2) — Richtung A „Editorial Report":
 * Zwei Spalten in einer umrandeten Karte; rechts (weiß, Serife) hebt „Was wir sehen" hervor.
 */
export function WahrnehmungsShift() {
  return (
    <Section id="wahrnehmung" ariaLabel="Was andere sehen — was wir sehen">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p className="rf-eyebrow">Derselbe Bestand. Ein anderer Blick.</p>
        <h2 style={{ margin: '0 auto', maxWidth: '22ch' }}>
          Aus unserem eigenen Portfolio identifiziert — nicht konstruiert.
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: '820px',
          margin: '0 auto',
          border: 'var(--linie)',
          borderRadius: 'var(--radius-gross)',
          overflow: 'hidden',
          background: 'var(--farbe-papier-2)',
        }}
      >
        <div style={{ ...kopf, color: 'var(--farbe-tinte-weich)' }}>Was andere sehen</div>
        <div
          style={{
            ...kopf,
            color: 'var(--farbe-akzent)',
            background: 'var(--farbe-flaeche)',
            borderLeft: 'var(--linie)',
          }}
        >
          Was wir sehen
        </div>

        {PAARE.map((paar, i) => {
          const letzte = i === PAARE.length - 1;
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  padding: '1.15rem 1.75rem',
                  color: 'var(--farbe-tinte-weich)',
                  fontSize: '1.05rem',
                  borderBottom: letzte ? 'none' : 'var(--linie-zart)',
                }}
              >
                {paar.andereSehen}
              </div>
              <div
                style={{
                  padding: '1.15rem 1.75rem',
                  fontFamily: 'var(--serif)',
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  background: 'var(--farbe-flaeche)',
                  borderLeft: 'var(--linie)',
                  borderBottom: letzte ? 'none' : 'var(--linie-zart)',
                }}
              >
                {paar.wirSehen}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </Section>
  );
}
