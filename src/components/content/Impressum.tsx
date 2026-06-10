import { IMPRESSUM } from '../../content/rechtstexte.config';
import { Section } from '../ui/Section';

/**
 * Impressum-Seite — rendert strukturierte Anbieterangaben aus rechtstexte.config (§12, §16).
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
        </address>

        <h3 style={{ marginTop: '1.5rem' }}>Handelsregister</h3>
        <p>
          Handelsregister: {IMPRESSUM.handelsregister}
          <br />
          Registergericht: {IMPRESSUM.registergericht}
        </p>

        <h3 style={{ marginTop: '1.5rem' }}>Vertreten durch</h3>
        <p>{IMPRESSUM.vertretenDurch}</p>

        <h3 style={{ marginTop: '1.5rem' }}>Kontakt</h3>
        <p>
          Telefon: {IMPRESSUM.telefon}
          <br />
          E-Mail: <a href={`mailto:${IMPRESSUM.email}`}>{IMPRESSUM.email}</a>
        </p>

        <h3 style={{ marginTop: '1.5rem' }}>Umsatzsteuer-ID</h3>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: {IMPRESSUM.ustIdNr}
        </p>

        <h3 style={{ marginTop: '1.5rem' }}>Verantwortlicher gemäß § 18 Abs. 2 MStV</h3>
        <p>{IMPRESSUM.verantwortlicher}</p>

        <h3 style={{ marginTop: '1.5rem' }}>EU-Streitschlichtung</h3>
        <p>{IMPRESSUM.euStreitschlichtung}</p>

        <h3 style={{ marginTop: '1.5rem' }}>
          Verbraucherstreitbeilegung / Universalschlichtungsstelle
        </h3>
        <p>{IMPRESSUM.verbraucherstreitbeilegung}</p>
      </article>
    </Section>
  );
}
