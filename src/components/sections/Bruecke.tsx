import {
  ENTLASTUNGEN,
  CTA_ANALYSE,
  CTA_ANALYSE_SUBTEXT,
} from '@/content/texte';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

const NUTZEN_HAEKCHEN: string[] = [
  'Ihr Potenzial in Minuten sehen — ohne Wartezeit',
  'Keine Dokumente hochladen, keine Daten übertragen',
  'Sofortige, konkrete Erkenntnisse für Ihren Bestand',
  'Jederzeit abbrechen — kein Commitment, kein Druck',
];

/**
 * Brücke (§9 #5):
 * - Drei Entlastungen (ENTLASTUNGEN)
 * - Vier Nutzen-Häkchen
 * - CTA = CTA_ANALYSE mit Subtext = CTA_ANALYSE_SUBTEXT
 */
export function Bruecke() {
  return (
    <Section id="bruecke" ariaLabel="Was Sie in 3 Minuten herausfinden">
      <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
          Was Sie in 3 Minuten herausfinden
        </h2>
        <p
          style={{
            margin: '0 0 2.5rem',
            color: 'var(--farbe-text-sekundaer)',
            lineHeight: 1.6,
            fontSize: '1.05rem',
          }}
        >
          Bestandspotenziale erleben — bevor Sie irgendetwas geben.
        </p>

        {/* Drei Entlastungen */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
          }}
        >
          {ENTLASTUNGEN.map((entlastung) => (
            <span
              key={entlastung}
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--farbe-akzent)',
                padding: '0.4rem 0.9rem',
                border: '1px solid var(--farbe-akzent)',
                borderRadius: '999px',
              }}
            >
              {entlastung}
            </span>
          ))}
        </div>

        {/* Vier Nutzen-Häkchen */}
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 2.5rem',
            textAlign: 'left',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {NUTZEN_HAEKCHEN.map((nutzen) => (
            <li
              key={nutzen}
              className="haekchen"
              data-haekchen="true"
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                padding: '0.6rem 0',
                borderBottom: 'var(--linie)',
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: 'var(--farbe-akzent)', fontWeight: 700, flexShrink: 0 }}>
                ✓
              </span>
              <span>{nutzen}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          variante="primär"
          style={{ fontSize: '1.05rem', padding: '0.875rem 2rem', marginBottom: '0.75rem' }}
          onClick={() => {
            const el = document.getElementById('schatzsuche');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {CTA_ANALYSE}
        </Button>
        <p
          style={{
            margin: '0.75rem 0 0',
            fontSize: '0.875rem',
            color: 'var(--farbe-text-sekundaer)',
          }}
        >
          {CTA_ANALYSE_SUBTEXT}
        </p>
      </div>
    </Section>
  );
}
