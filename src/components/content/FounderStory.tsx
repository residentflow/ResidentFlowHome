import { FOUNDER_SCHLUSSSATZ } from '../../content/texte';
import { Section } from '../ui/Section';

/**
 * Founder-Story (lang, Verkaufselement) — §12 / §9 #9.
 * Eigener Bestandshalter, eigenes Geld, aus eigenem Bedarf gebaut,
 * zuerst am eigenen Bestand erprobt. Endet mit FOUNDER_SCHLUSSSATZ.
 */
export function FounderStory() {
  return (
    <Section titel="Warum dieses System existiert" ariaLabel="Gründer-Geschichte">
      <article style={{ maxWidth: '680px', lineHeight: 1.8 }}>
        <p>
          Ich bin selbst Bestandshalter. Nicht als Nebenbeschäftigung, sondern als Haupttätigkeit —
          mit eigenem Kapital, eigener Verantwortung, eigenem Risiko.
        </p>
        <p>
          Über Jahre habe ich erlebt, was viele kennen: Mieterhöhungen, die nicht konsequent gezogen
          wurden. Leerstände, die zu lange liefen. Dokumente, die über mehrere Gesellschaften
          verteilt waren. Externe Verwaltung, die routiniert arbeitete — aber niemanden hatte, der
          systematisch fragt: Wo liegt hier noch Ertrag?
        </p>
        <p>
          Ich habe dafür Werkzeuge gesucht. Was ich fand, waren entweder Verwaltungstools — sehr gut
          darin, den laufenden Betrieb abzubilden — oder generische Rechner, die mit pauschalen
          Annahmen arbeiten. Kein System hat aktiv nach Potenzial gesucht. Keines hat mir gesagt:
          Hier liegt noch Geld, das du nicht abholst.
        </p>
        <p>
          Also habe ich es gebaut. Nicht als Softwareprojekt, sondern weil ich es selbst brauchte.
          Zuerst für meinen eigenen Bestand — als internes Werkzeug, das ich täglich verwendet habe.
          Die ersten Erkenntnisse kamen aus meinen eigenen Zahlen. Die ersten Benchmarks stammen aus
          meinem eigenen Portfolio.
        </p>
        <p>
          Erst nachdem das System an meinem eigenen Bestand bewiesen hatte, dass es echte Potenziale
          findet — nicht als Theorie, sondern in Euro und Stunden — habe ich begonnen, es für andere
          zugänglich zu machen.
        </p>
        <p>
          Das bedeutet: Was Sie hier sehen, ist kein Produkt, das für einen hypothetischen Kunden
          gebaut wurde. Es wurde für einen realen Bestand gebaut — meinen — mit echtem Geld im Spiel
          und echten Konsequenzen, wenn die Zahlen nicht stimmen.
        </p>
        <p>
          Ich kenne die Frustration, wenn Fristen untergehen. Ich kenne das ungute Gefühl, nicht zu
          wissen, ob die Hausverwaltung alles herausholt. Ich kenne die Mühsal, Dokumente aus fünf
          Ordnern zusammenzusuchen, bevor man eine fundierte Entscheidung treffen kann.
        </p>
        <p style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '2rem' }}>
          {FOUNDER_SCHLUSSSATZ}
        </p>
      </article>
    </Section>
  );
}
