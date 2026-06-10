import { checkConfig } from '@/config/checkConfig';
import { track, EVENTS } from '@/analytics/plausible';

/**
 * SegmentCTA (PRD §14.5) — End-Ausgänge jenseits des Diagnose-Gesprächs:
 * Steuerberater → Partneransatz (immer, größenunabhängig); Makler hohes Volumen →
 * Vermarktungsprozess; Projektentwickler hohes Volumen → Projektprozess.
 * Makler erhält NIE einen Mandats-CTA (§2.3) — daher hier eigener Pfad.
 */
const TEXTE: Record<string, { label: string; subline: string; src: string }> = {
  partnerprogramm: {
    label: 'Partneransatz besprechen',
    subline: 'Für Steuerberater: gemeinsame Mandantenpotenziale strukturiert heben.',
    src: 'partner',
  },
  vermarktungsprozess: {
    label: 'Vermarktungsprozess besprechen',
    subline: 'Bei hohem Volumen lohnt der wiederholbare Prozess statt Einzelfall.',
    src: 'makler',
  },
  projektprozess: {
    label: 'Projektprozess gemeinsam strukturieren',
    subline: 'Unterlagen, Aufbereitung und Exit als wiederholbarer Ablauf.',
    src: 'projekt',
  },
};

export function SegmentCTA({ endAusgang }: { endAusgang: string }) {
  const t = TEXTE[endAusgang];
  if (!t) return null;

  // Partnerprogramm-Link aus Settings, sonst auf die Termin-Seite mit Quelle.
  const href =
    endAusgang === 'partnerprogramm' && checkConfig.settings.partnerprogrammLink
      ? checkConfig.settings.partnerprogrammLink
      : `/termin?src=${t.src}`;

  return (
    <div
      data-testid="segment-cta"
      data-endausgang={endAusgang}
      style={{
        marginTop: '1rem',
        padding: '1rem',
        border: '1px solid var(--farbe-akzent, #b8860b)',
        borderRadius: 8,
      }}
    >
      <a
        data-testid="segment-cta-link"
        href={href}
        onClick={() => track(EVENTS.cta_clicked, { source: t.src })}
        style={{ fontWeight: 700 }}
      >
        {t.label}
      </a>
      <p style={{ margin: '0.4rem 0 0', color: '#555' }}>{t.subline}</p>
    </div>
  );
}
