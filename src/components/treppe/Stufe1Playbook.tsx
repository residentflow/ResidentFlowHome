import { PLAYBOOK_CTA } from '@/content/texte';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { schatzsucheConfig } from '@/content/schatzsuche.config';

/**
 * Stufe 1 — Playbook ansehen (§10.1). Für ALLE sichtbar.
 * Zeigt die Methodenbibliothek als sechs ergebnisorientierte Schwerpunkte (aus der Config,
 * sortiert nach reihenfolge) mit Titel + Beschreibung.
 * Der Produktname darf hier NICHT erscheinen (§17).
 */
export function Stufe1Playbook({ href = '#playbook' }: { href?: string }) {
  const schwerpunkte = [...schatzsucheConfig.phasen].sort((a, b) => a.reihenfolge - b.reihenfolge);

  return (
    <Section titel="Stufe 1 — Methodik">
      <p>
        Im Playbook finden Sie die vollständige Methodenbibliothek — gebündelt in sechs
        Schwerpunkten entlang Ihres Immobilien-Lebenszyklus, mit allen Loesungn, Benchmarks und
        Rechenwegen.
      </p>

      <ul
        data-testid="playbook-schwerpunkte"
        style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', display: 'grid', gap: '1rem' }}
      >
        {schwerpunkte.map((s) => (
          <li
            key={s.id}
            style={{
              border: '1px solid var(--farbe-linie, #e0e0e0)',
              borderRadius: 'var(--radius, 4px)',
              padding: '1rem 1.25rem',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>{s.name}</h3>
            {s.beschreibung && (
              <p style={{ margin: 0, color: 'var(--farbe-tinte-weich, #555)' }}>{s.beschreibung}</p>
            )}
          </li>
        ))}
      </ul>

      <a href={href} style={{ textDecoration: 'none' }}>
        <Button variante="sekundär">{PLAYBOOK_CTA}</Button>
      </a>
    </Section>
  );
}
