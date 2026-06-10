import { useState } from 'react';
import { checkConfig, copy } from '@/config/checkConfig';
import { buildCalComUrl, type CalComContext } from '@/domain/cta/engine';
import { track, EVENTS } from '@/analytics/plausible';

/**
 * HighIntentCTA (PRD §14.2): „Ihren Bestand gemeinsam ansehen" + give.short (immer),
 * give.long ausklappbar („Wie läuft das ab?"), Scarcity NUR wenn Settings.scarcityTrue (§14.2).
 * Termin-Link mit cal.com-Prefill (§17.2).
 */
export function HighIntentCTA({ calContext }: { calContext: CalComContext }) {
  const [offen, setOffen] = useState(false);
  const s = checkConfig.settings;
  const href = s.calComUrl ? buildCalComUrl(s.calComUrl, calContext) : '/termin';

  return (
    <div
      data-testid="highintent-cta"
      style={{
        marginTop: '1rem',
        padding: '1rem',
        border: '1px solid var(--farbe-akzent, #b8860b)',
        borderRadius: 8,
      }}
    >
      <a
        data-testid="cta-termin"
        href={href}
        onClick={() => {
          track(EVENTS.cta_clicked, { source: calContext.source });
          track(EVENTS.calendar_clicked, { source: calContext.source });
        }}
        style={{ fontWeight: 700, fontSize: '1.05rem' }}
      >
        {copy('cta.highIntent')}
      </a>
      <p data-testid="cta-give-short" style={{ margin: '0.5rem 0 0' }}>
        {copy('cta.give.short')}
      </p>
      <button
        type="button"
        data-testid="cta-give-toggle"
        aria-expanded={offen}
        onClick={() => setOffen(!offen)}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        Wie läuft das ab?
      </button>
      {offen && (
        <p data-testid="cta-give-long" style={{ color: '#555' }}>
          {copy('cta.give.long')}
        </p>
      )}
      {/* Scarcity-Zeile NUR mit echtem Flag (Test-Gate §14.2) */}
      {s.scarcityTrue && (
        <p data-testid="cta-scarcity" style={{ fontSize: '0.85rem', color: '#a15c00' }}>
          {copy('cta.scarcity').replace('{n}', String(s.monthlySlots))}
        </p>
      )}
    </div>
  );
}
