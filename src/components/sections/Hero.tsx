import { HERO_TOPLINE, HERO_SUBLINE, HERO_VERSPRECHEN, CTA_ANALYSE } from '@/content/texte';
import { CTA_ANALYSE_SUBTEXT } from '@/content/texte';

/**
 * Hero-Abschnitt (§9 #1) — Richtung A „Editorial Report":
 * Eyebrow (Topline) · große Serif-Headline · breite Subline · ruhige Primär-CTA mit Microcopy.
 * Kein Produktname, kein Softwarebegriff in dieser Komponente.
 */
export function Hero() {
  function zurSuche() {
    document.getElementById('schatzsuche')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section id="hero" aria-label="Einstieg">
      <div
        style={{
          maxWidth: 'var(--breite-inhalt)',
          margin: '0 auto',
          padding: 'var(--raum-6) var(--raum-3)',
        }}
      >
        <p className="rf-eyebrow">{HERO_TOPLINE}</p>

        <h1 style={{ maxWidth: '16ch', margin: '0 0 var(--raum-3)' }}>{HERO_SUBLINE}</h1>

        <p
          style={{
            margin: '0 0 var(--raum-4)',
            fontSize: '1.2rem',
            lineHeight: 1.6,
            color: 'var(--farbe-tinte-weich)',
            maxWidth: '46ch',
          }}
        >
          {HERO_VERSPRECHEN} Keine Registrierung, keine Dokumente, keine E-Mail.
        </p>

        <div
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--raum-3)', flexWrap: 'wrap' }}
        >
          <button type="button" className="rf-btn" onClick={zurSuche}>
            {CTA_ANALYSE}
          </button>
          <span style={{ fontSize: '0.85rem', color: 'var(--farbe-tinte-weich)' }}>
            {CTA_ANALYSE_SUBTEXT}
          </span>
        </div>
      </div>
      <div className="rf-hairline" />
    </section>
  );
}
