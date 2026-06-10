import { DATENSCHUTZ } from '../../content/rechtstexte.config';
import { Section } from '../ui/Section';

/**
 * Datenschutzerklärung — rendert strukturierte Abschnitte aus rechtstexte.config (§12, §16).
 * Deckt: Suche überträgt nichts; Opt-in-Kanal (E-Mail + Rolle + Einheiten + Einwilligung + Abmeldung);
 * Plausible cookieless; Brevo als Auftragsverarbeiter/AVV; verantwortliche Stelle; Betroffenenrechte.
 */
export function Datenschutz() {
  return (
    <Section titel={DATENSCHUTZ.ueberschrift} ariaLabel="Datenschutzerklärung">
      <article style={{ maxWidth: '680px', lineHeight: 1.8 }}>
        {DATENSCHUTZ.abschnitte.map((abschnitt) => (
          <section key={abschnitt.titel} style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{abschnitt.titel}</h3>
            <p style={{ margin: 0 }}>{abschnitt.inhalt}</p>
          </section>
        ))}
      </article>
    </Section>
  );
}
