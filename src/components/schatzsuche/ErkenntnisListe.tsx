import { ERKENNTNIS_HEADER } from '@/content/texte';
import type { HebelLaufzeit } from '@/domain/types';

interface ErkenntnisListeProps {
  laufzeiten: HebelLaufzeit[];
  hebelNamen: Record<string, string>;
}

function formatierteSpanne(min: number, max: number): string {
  const fmt = (n: number) => n.toLocaleString('de-DE');
  return `${fmt(min)} – ${fmt(max)} €`;
}

/**
 * Mitlaufende Erkenntnis-Liste (§8.2).
 * Header: „Bereits identifizierte Hebel: N"
 * Je Zeile: Hebel-Name + Euro-Spanne ODER qualitativer Nutzen — gleichrangig.
 */
export function ErkenntnisListe({ laufzeiten, hebelNamen }: ErkenntnisListeProps) {
  return (
    <div
      style={{
        padding: '1rem',
        background: 'var(--farbe-flaeche, #f9f9f9)',
        borderRadius: 'var(--radius, 4px)',
        marginBottom: '1.5rem',
      }}
    >
      <p
        style={{
          margin: '0 0 0.75rem',
          fontWeight: 700,
          fontSize: '1rem',
        }}
      >
        {ERKENNTNIS_HEADER} {laufzeiten.length}
      </p>

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {laufzeiten.map((laufzeit) => {
          const name = hebelNamen[laufzeit.hebelId] ?? laufzeit.hebelId;
          const wertAnzeige = laufzeit.spanne
            ? `${formatierteSpanne(laufzeit.spanne.min, laufzeit.spanne.max)} p.a.`
            : laufzeit.nutzenAussage ?? '(Potenzial wird berechnet …)';
          return (
            <li
              key={laufzeit.hebelId}
              style={{
                fontSize: '0.95rem',
                padding: '0.35rem 0',
              }}
            >
              ✅ {name} — {wertAnzeige}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
