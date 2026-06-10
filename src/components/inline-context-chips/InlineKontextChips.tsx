import { useState } from 'react';
import { checkConfig, copy, type RoleCfg } from '@/config/checkConfig';

/**
 * InlineKontextChips (PRD §11.3) — für direkte /loesungen/*-Besucher ohne Rolle/Größe (J2–J4).
 * Zwei Chip-Reihen: „Was beschreibt Sie?" (5 Rollen) → „Wie groß ungefähr?" (Buckets der Rolle).
 * Zwei Klicks setzen denselben Score wie der Homepage-Check (quantifiziert/HighIntent).
 * Ohne Auswahl bleibt die Seite voll nutzbar (Motor A).
 */
interface Props {
  onContext: (rolle: RoleCfg | null, bucketRank: number | null) => void;
}

export function InlineKontextChips({ onContext }: Props) {
  const [rolle, setRolle] = useState<RoleCfg | null>(null);
  const [bucketIndex, setBucketIndex] = useState<number | null>(null);

  function waehleRolle(r: RoleCfg) {
    setRolle(r);
    setBucketIndex(null);
    onContext(r, null);
  }
  function waehleBucket(i: number) {
    setBucketIndex(i);
    const rank = rolle?.sizeMetric?.buckets[i]?.rank ?? null;
    onContext(rolle, rank);
  }

  return (
    <div data-testid="inline-context-chips" style={{ margin: '0.5rem 0 1rem' }}>
      <p style={{ fontSize: '0.85rem', color: '#666' }}>{copy('copy.chipsMicro')}</p>

      <div data-testid="chip-roles" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {checkConfig.roles.map((r) => (
          <button
            key={r.slug}
            type="button"
            data-testid={`chip-role-${r.slug}`}
            aria-pressed={rolle?.slug === r.slug}
            onClick={() => waehleRolle(r)}
            style={chipStyle(rolle?.slug === r.slug)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {rolle?.sizeMetric && (
        <div
          data-testid="chip-buckets"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}
        >
          {rolle.sizeMetric.buckets.map((b, i) => (
            <button
              key={b.label}
              type="button"
              data-testid={`chip-bucket-${i}`}
              aria-pressed={bucketIndex === i}
              onClick={() => waehleBucket(i)}
              style={chipStyle(bucketIndex === i)}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function chipStyle(aktiv: boolean): React.CSSProperties {
  return {
    border: `1px solid ${aktiv ? 'var(--farbe-akzent, #b8860b)' : 'var(--farbe-linie, #ccc)'}`,
    background: aktiv ? 'var(--farbe-akzent-weich, #f5ecd6)' : 'transparent',
    borderRadius: '999px',
    padding: '0.3rem 0.8rem',
    cursor: 'pointer',
  };
}
