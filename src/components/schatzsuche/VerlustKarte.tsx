interface VerlustKarteProps {
  titel: string;
  wahrscheinlichkeitOderGrund: string;
  wasDroht: string;
  playbookLink: string;
}

/**
 * Risiko-Karte (VERLUST) — §8.3.
 * Zeigt: ⚠️ + Titel + Wahrscheinlichkeit/Grund + „Was droht: …".
 * Verlust-Rahmung ausschließlich bei Risiko-Hebeln (§6.1 / §17).
 * Verwendet das Label „Hebel" (§8.3 / §17).
 */
export function VerlustKarte({
  titel,
  wahrscheinlichkeitOderGrund,
  wasDroht,
  playbookLink,
}: VerlustKarteProps) {
  return (
    <article
      style={{
        border: '1px solid var(--farbe-risiko, #d97706)',
        borderRadius: 'var(--radius, 4px)',
        padding: '1.25rem',
        marginBottom: '1rem',
        background: '#fffbf0',
      }}
    >
      <header style={{ marginBottom: '0.75rem' }}>
        <p
          style={{
            margin: '0 0 0.25rem',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--farbe-risiko, #d97706)',
          }}
        >
          ⚠️ Hebel entdeckt
        </p>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{titel}</h3>
      </header>

      <section style={{ marginBottom: '0.75rem' }}>
        <p style={{ margin: 0 }}>{wahrscheinlichkeitOderGrund}</p>
      </section>

      <section>
        <p style={{ margin: '0 0 0.25rem', fontWeight: 600 }}>Was droht:</p>
        <p style={{ margin: '0 0 0.75rem' }}>{wasDroht}</p>
        <a href={playbookLink} style={{ color: 'var(--farbe-risiko, #d97706)', fontSize: '0.9rem' }}>
          Im Playbook erfahren →
        </a>
      </section>
    </article>
  );
}
