import { IMPRESSUM } from '../../content/rechtstexte.config';
import { Section } from '../ui/Section';

/**
 * Impressum-Seite — rendert strukturierte Anbieterangaben aus rechtstexte.config (§12, §16).
 * Alle Felder sind als PLATZHALTER markiert und müssen vor Liveschaltung ersetzt werden.
 */
export function Impressum() {
  return (
    <Section titel={IMPRESSUM.ueberschrift} ariaLabel="Impressum">
      <article style={{ maxWidth: '680px', lineHeight: 1.8 }}>
        <h3 style={{ marginTop: '1.5rem' }}>{IMPRESSUM.anbieter}</h3>
        <address style={{ fontStyle: 'normal', lineHeight: 2 }}>
          <p>{IMPRESSUM.name}</p>
          <p>{IMPRESSUM.strasse}</p>
          <p>{IMPRESSUM.plzOrt}</p>
          <p>{IMPRESSUM.land}</p>
          <p>
            E-Mail: <a href={`mailto:${IMPRESSUM.email}`}>{IMPRESSUM.email}</a>
          </p>
        </address>

        <h3 style={{ marginTop: '1.5rem' }}>Umsatzsteuer-Identifikationsnummer</h3>
        <p>{IMPRESSUM.ustIdNr}</p>

        <h3 style={{ marginTop: '1.5rem' }}>Verantwortlicher gemäß § 18 Abs. 2 MStV</h3>
        <p>{IMPRESSUM.verantwortlicher}</p>

        <p
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#fff8e1',
            borderLeft: '3px solid #f59e0b',
            fontSize: '0.9rem',
          }}
        >
          {IMPRESSUM.hinweis}
        </p>
      </article>
    </Section>
  );
}
