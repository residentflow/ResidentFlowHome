import { HERO_TOPLINE, HERO_SUBLINE, HERO_VERSPRECHEN, CTA_ANALYSE } from '@/content/texte';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

/**
 * Hero-Abschnitt (§9 #1):
 * - Topline: HERO_TOPLINE
 * - Breite Subline (nicht ausschließend)
 * - Versprechen-Satz
 * - CTA „Bestand analysieren"
 * Kein Produktname, kein Softwarebegriff in dieser Komponente.
 */
export function Hero() {
  return (
    <Section id="hero" ariaLabel="Einstieg">
      <div
        style={{
          maxWidth: '760px',
          padding: 'var(--raum-6) 0',
        }}
      >
        {/* Topline */}
        <p
          style={{
            margin: '0 0 1.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--farbe-akzent)',
          }}
        >
          {HERO_TOPLINE}
        </p>

        {/* Subline — breit, niemanden ausschließend */}
        <h1
          style={{
            margin: '0 0 1.5rem',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: 1.1,
            fontWeight: 700,
          }}
        >
          {HERO_SUBLINE}
        </h1>

        {/* Versprechen */}
        <p
          style={{
            margin: '0 0 2.5rem',
            fontSize: '1.125rem',
            lineHeight: 1.6,
            color: 'var(--farbe-text-sekundaer)',
            maxWidth: '560px',
          }}
        >
          {HERO_VERSPRECHEN}
        </p>

        {/* CTA */}
        <Button
          variante="primär"
          style={{ fontSize: '1.05rem', padding: '0.875rem 2rem' }}
          onClick={() => {
            const el = document.getElementById('schatzsuche');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {CTA_ANALYSE}
        </Button>
      </div>
    </Section>
  );
}
