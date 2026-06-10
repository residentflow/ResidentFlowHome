import { FAQ_EINTRAEGE } from '../../content/faq.config';
import { Section } from '../ui/Section';
import { copy } from '@/config/checkConfig';

/**
 * FAQ-Komponente — rendert genau die 5 Vertrauensfragen aus faq.config (§12).
 * Datenfrage (prominent: true) steht immer an erster Stelle.
 */
export function FAQ() {
  // Prominente Frage zuerst, dann Rest in Originalreihenfolge
  const sortiert = [...FAQ_EINTRAEGE].sort((a, b) => {
    if (a.prominent && !b.prominent) return -1;
    if (!a.prominent && b.prominent) return 1;
    return 0;
  });

  return (
    <Section titel="Häufige Fragen" ariaLabel="Häufige Fragen">
      <dl>
        {sortiert.map((eintrag) => (
          <div key={eintrag.frage} style={{ marginBottom: '2rem' }}>
            <dt
              style={{
                fontWeight: 700,
                fontSize: eintrag.prominent ? '1.15rem' : '1rem',
                marginBottom: '0.5rem',
              }}
            >
              {eintrag.frage}
            </dt>
            <dd style={{ margin: 0, lineHeight: 1.7 }}>{eintrag.antwort}</dd>
          </div>
        ))}
      </dl>
      {/* System-Satz-Platzierung (§21) */}
      <p data-testid="system-satz" style={{ fontWeight: 600, marginTop: '1rem' }}>
        {copy('copy.systemSatz')}
      </p>
    </Section>
  );
}
