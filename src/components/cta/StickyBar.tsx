import { useState } from 'react';
import { checkConfig, copy } from '@/config/checkConfig';
import { buildCalComUrl, type CalComContext } from '@/domain/cta/engine';

/**
 * HighIntentStickyBar (PRD §9.2): erscheint ab highIntent==true (unten, dismissbar).
 * cta.highIntent + cta.give.short. Wiedereinblendung nur nach Lösungswechsel (Key-Reset).
 */
export function StickyBar({ calContext }: { calContext: CalComContext }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const s = checkConfig.settings;
  const href = s.calComUrl ? buildCalComUrl(s.calComUrl, calContext) : '/termin';

  return (
    <div
      data-testid="sticky-bar"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '0.5rem 1rem',
        background: 'var(--farbe-flaeche, #fff)',
        borderTop: '1px solid var(--farbe-akzent, #b8860b)',
      }}
    >
      <span style={{ fontSize: '0.85rem' }}>{copy('cta.give.short')}</span>
      <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <a data-testid="sticky-cta" href={href} style={{ fontWeight: 700 }}>
          {copy('cta.highIntent')}
        </a>
        <button
          type="button"
          data-testid="sticky-dismiss"
          aria-label="Schließen"
          onClick={() => setDismissed(true)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          schließen
        </button>
      </span>
    </div>
  );
}
