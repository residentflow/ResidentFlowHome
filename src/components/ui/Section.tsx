import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  titel?: string;
  /** Setzt die Section auf flächigen (weißen) Hintergrund statt Papier. */
  flaeche?: boolean;
  ariaLabel?: string;
  children: ReactNode;
}

/**
 * Wiederverwendbarer Abschnitts-Rahmen im Editorial-Stil (§15.5): großzügiger Weißraum,
 * zentrierter Inhaltsbereich, semantisches <section> mit optionaler Überschrift.
 */
export function Section({ id, titel, flaeche, ariaLabel, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel ?? titel}
      style={{
        background: flaeche ? 'var(--farbe-flaeche)' : 'transparent',
        borderTop: flaeche ? 'var(--linie)' : 'none',
        borderBottom: flaeche ? 'var(--linie)' : 'none',
        padding: 'var(--raum-6) var(--raum-3)',
      }}
    >
      <div style={{ maxWidth: 'var(--breite-inhalt)', margin: '0 auto' }}>
        {titel && <h2>{titel}</h2>}
        {children}
      </div>
    </section>
  );
}
