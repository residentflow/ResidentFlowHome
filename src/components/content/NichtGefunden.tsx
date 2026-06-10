import { Section } from '../ui/Section';

/**
 * 404-Seite — fängt unbekannte Pfade ab, statt den React-Router-Entwicklerfehler zu zeigen.
 */
export function NichtGefunden() {
  return (
    <Section titel="Seite nicht gefunden" ariaLabel="Seite nicht gefunden">
      <p>Diese Seite existiert nicht (mehr). Vermutlich ist der Link veraltet oder vertippt.</p>
      <p>
        <a href="/">Zur Startseite — und direkt den eigenen Bestand analysieren.</a>
      </p>
    </Section>
  );
}
