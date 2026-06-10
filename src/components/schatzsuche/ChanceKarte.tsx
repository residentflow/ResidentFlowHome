import type { Spanne } from '@/domain/schema/spanne';

interface ChanceKarteProps {
  titel: string;
  spanne: Spanne;
  typischeUrsache: string;
  playbookHinweis: string;
  playbookLink: string;
}

function formatierteSpanne(spanne: Spanne): string {
  const fmt = (n: number) => n.toLocaleString('de-DE');
  return `${fmt(spanne.min)} – ${fmt(spanne.max)} €`;
}

/**
 * Ertrags-/Effizienz-Karte (CHANCE) — §8.3.
 * Zeigt: Titel + Spanne + „Typische Ursache" + „Im Playbook erfahren Sie: …".
 * Verwendet das Label „Loesung" (§8.3 / §17).
 */
export function ChanceKarte({
  titel,
  spanne,
  typischeUrsache,
  playbookHinweis,
  playbookLink,
}: ChanceKarteProps) {
  return (
    <article
      style={{
        border: '1px solid var(--farbe-linie, #e0e0e0)',
        borderRadius: 'var(--radius, 4px)',
        padding: '1.25rem',
        marginBottom: '1rem',
        background: '#fff',
      }}
    >
      <header style={{ marginBottom: '0.75rem' }}>
        <p
          style={{
            margin: '0 0 0.25rem',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--farbe-akzent, #b8860b)',
          }}
        >
          Lösung erkannt
        </p>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{titel}</h3>
      </header>

      <p style={{ margin: '0 0 1rem', fontSize: '1.4rem', fontWeight: 700 }}>
        {formatierteSpanne(spanne)} p.a.
      </p>

      <section style={{ marginBottom: '0.75rem' }}>
        <p
          style={{
            margin: '0 0 0.25rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--farbe-text-leise, #666)',
          }}
        >
          Typische Ursache
        </p>
        <p style={{ margin: 0 }}>{typischeUrsache}</p>
      </section>

      <section>
        <p style={{ margin: '0 0 0.25rem' }}>
          <strong>Im Playbook erfahren Sie:</strong> {playbookHinweis}
        </p>
        <a
          href={playbookLink}
          style={{ color: 'var(--farbe-akzent, #b8860b)', fontSize: '0.9rem' }}
        >
          Zum Playbook →
        </a>
      </section>
    </article>
  );
}
