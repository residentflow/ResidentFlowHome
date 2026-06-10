import { useEffect, useState } from 'react';
import { checkConfig, copy } from '@/config/checkConfig';

/**
 * /termin (PRD §7/§14.2) — eigene Seite mit eingebettetem cal.com-Buchungswidget.
 * Reicht eingehende Query-Parameter (src, metadata[...]) an den Kalender weiter, damit
 * der Diagnosekontext erhalten bleibt (§17.2). Das Event „15min" bietet Telefon/Video an.
 */
export function TerminSeite() {
  const base = checkConfig.settings.calComUrl || 'https://cal.com/stefan-holhut/bestand-ansehen';
  const [src, setSrc] = useState(base);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const incoming = window.location.search.replace(/^\?/, '');
    const sep = base.includes('?') ? '&' : '?';
    setSrc(incoming ? `${base}${sep}${incoming}` : base);
  }, [base]);

  return (
    <main
      data-testid="termin-seite"
      style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem 1rem' }}
    >
      <h1 style={{ fontFamily: 'Georgia, serif' }}>{copy('cta.highIntent')}</h1>
      <p data-testid="termin-give">{copy('cta.give.short')}</p>
      <p data-testid="termin-telefon" style={{ color: '#555' }}>
        Das Gespräch findet per Telefon oder Video statt — Sie wählen bei der Buchung. Ihre Liste
        bleibt bei Ihnen; wir schauen sie nur gemeinsam an.
      </p>

      {/* cal.com-Embed (iframe, SSG-tauglich); Parameter werden weitergereicht */}
      <iframe
        data-testid="cal-embed"
        title="Termin bei ResidentFlow buchen"
        src={src}
        loading="lazy"
        style={{
          width: '100%',
          minHeight: '70vh',
          border: '1px solid var(--farbe-linie, #eee)',
          borderRadius: 8,
          marginTop: '1rem',
        }}
      />

      <p style={{ marginTop: '0.75rem' }}>
        <a data-testid="termin-extern" href={base} target="_blank" rel="noreferrer">
          Kalender in neuem Tab öffnen
        </a>
      </p>
    </main>
  );
}

export default TerminSeite;
