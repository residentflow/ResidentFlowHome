import { useRef, useState, useEffect } from 'react';
import {
  checkConfig,
  copy,
  problemeFuerRolle,
  type ProblemCfg,
  type RoleCfg,
} from '@/config/checkConfig';
import { istHighIntent, endAusgang as berechneEndAusgang } from './score';
import { SolutionResult } from '@/components/solution-result/SolutionResult';
import { StickyBar } from '@/components/cta/StickyBar';
import { track, EVENTS } from '@/analytics/plausible';

/**
 * BestandsCheck (PRD §10) — Zustandsmaschine S0→S3, above the fold (§9.1).
 * S0 Rolle → S1 Größe (adaptiv) → S2 Problemkarten (gefiltert, max 7) → S3 SolutionResult inline.
 * Frühere Auswahlen bleiben als änderbare Chips (Änderung re-rendert Folgeebenen, kein Reset).
 * Kein „Weiter"-Button. HARTES GATE: kein fetch, kein Cookie, kein local/sessionStorage.
 */
function scrollNuanced(el: HTMLElement | null) {
  try {
    el?.scrollIntoView({ block: 'nearest' });
  } catch {
    /* jsdom/Server: scrollIntoView nicht implementiert — bewusst ignoriert */
  }
}

interface ChipProps {
  label: string;
  onClick: () => void;
}
function Chip({ label, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="chip"
      style={{
        border: '1px solid var(--farbe-akzent, #b8860b)',
        borderRadius: '999px',
        padding: '0.3rem 0.8rem',
        background: 'transparent',
        cursor: 'pointer',
        marginRight: '0.5rem',
      }}
    >
      {label} · ändern
    </button>
  );
}

export function BestandsCheck() {
  const [rolle, setRolle] = useState<RoleCfg | null>(null);
  const [bucketIndex, setBucketIndex] = useState<number | null>(null);
  const [problem, setProblem] = useState<ProblemCfg | null>(null);

  const sizeRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (problem) scrollNuanced(resultRef.current);
    else if (bucketIndex != null) scrollNuanced(problemRef.current);
    else if (rolle) scrollNuanced(sizeRef.current);
  }, [rolle, bucketIndex, problem]);

  function waehleRolle(r: RoleCfg) {
    setRolle(r);
    setBucketIndex(null); // Folgeebenen zurücksetzen (kein voller Reset der UI)
    setProblem(null);
    track(EVENTS.role_selected, { role: r.slug });
  }
  function waehleBucket(i: number) {
    setBucketIndex(i);
    setProblem(null);
    const label = rolle?.sizeMetric?.buckets[i]?.label;
    if (label) track(EVENTS.size_selected, { bucket: label });
  }
  // Chip-Klick = zur jeweiligen Ebene zurück (frühere Auswahl ändern, kein Reset darüber)
  function rolleAendern() {
    setRolle(null);
    setBucketIndex(null);
    setProblem(null);
  }
  function groesseAendern() {
    setBucketIndex(null);
    setProblem(null);
  }

  const bucketRank =
    rolle && bucketIndex != null ? (rolle.sizeMetric?.buckets[bucketIndex]?.rank ?? null) : null;
  const highIntent =
    rolle && bucketRank != null
      ? istHighIntent({ rolle, bucketRank }, checkConfig.settings.thresholdHigh)
      : false;
  const endAusgang =
    rolle && bucketRank != null
      ? berechneEndAusgang({ rolle, bucketRank }, checkConfig.settings.thresholdHigh)
      : undefined;

  const probleme = rolle ? problemeFuerRolle(rolle.slug) : [];

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1rem' }}>
      {/* Microcopy direkt über den Rollen-Chips (§9.1) */}
      <p data-testid="check-intro" style={{ color: 'var(--farbe-tinte-weich, #555)' }}>
        {copy('copy.checkIntro')}
      </p>

      {/* Aktive, änderbare Chips früherer Auswahlen */}
      {(rolle || bucketIndex != null) && (
        <div data-testid="aktive-chips" style={{ margin: '0.5rem 0 1rem' }}>
          {rolle && <Chip label={rolle.label} onClick={rolleAendern} />}
          {rolle && bucketIndex != null && rolle.sizeMetric && (
            <Chip label={rolle.sizeMetric.buckets[bucketIndex].label} onClick={groesseAendern} />
          )}
        </div>
      )}

      {/* S0 — Rollen-Frage (above the fold, alle Optionen) */}
      {!rolle && (
        <fieldset style={{ border: 'none', padding: 0 }}>
          <legend style={{ fontWeight: 600, fontSize: '1.15rem' }}>
            Was beschreibt Sie am besten?
          </legend>
          <div
            data-testid="role-options"
            role="radiogroup"
            aria-label="Rolle"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}
          >
            {checkConfig.roles.map((r) => (
              <button
                key={r.slug}
                type="button"
                data-testid={`role-${r.slug}`}
                onClick={() => waehleRolle(r)}
                style={optionStyle}
              >
                {r.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* S1 — Größenfrage (adaptiv) */}
      {rolle && bucketIndex == null && rolle.sizeMetric && (
        <div ref={sizeRef}>
          <p style={{ fontWeight: 600 }}>{rolle.sizeMetric.frageWortlaut}</p>
          <div
            data-testid="size-options"
            role="radiogroup"
            aria-label="Größe"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}
          >
            {rolle.sizeMetric.buckets.map((b, i) => (
              <button
                key={b.label}
                type="button"
                data-testid={`size-${i}`}
                onClick={() => waehleBucket(i)}
                style={optionStyle}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* S2 — Problemkarten (gefiltert, max 7) */}
      {rolle && bucketIndex != null && !problem && (
        <div ref={problemRef}>
          <p style={{ fontWeight: 600 }}>Was bremst Ihren Bestand aktuell am meisten?</p>
          {probleme.length === 0 ? (
            <p data-testid="keine-probleme" style={{ color: 'var(--farbe-tinte-weich, #777)' }}>
              Für Ihre Rolle besprechen wir die passenden Ansätze direkt im Gespräch.
            </p>
          ) : (
            <div
              data-testid="problem-options"
              style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              {probleme.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  data-testid={`problem-${p.slug}`}
                  onClick={() => {
                    setProblem(p);
                    track(EVENTS.problem_selected, { slug: p.slug });
                    track(EVENTS.solution_result_rendered, { slug: p.slug });
                  }}
                  style={{ ...optionStyle, textAlign: 'left' }}
                >
                  {p.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* S3 — SolutionResult inline */}
      {rolle && bucketIndex != null && problem && (
        <div ref={resultRef}>
          <SolutionResult
            problem={problem}
            highIntent={highIntent}
            endAusgang={endAusgang}
            units={rolle.sizeMetric?.buckets[bucketIndex]?.unitsMid ?? null}
            calContext={{
              role: rolle.slug,
              sizeBucket: rolle.sizeMetric?.buckets[bucketIndex]?.label,
              source: 'direct',
            }}
          />
          {/* StickyBar ab HighIntent (§9.2), Key bindet an Lösung → Wiedereinblendung bei Wechsel */}
          {highIntent && (
            <StickyBar
              key={problem.slug}
              calContext={{ role: rolle.slug, problemSlug: problem.slug, source: 'direct' }}
            />
          )}
        </div>
      )}
    </div>
  );
}

const optionStyle: React.CSSProperties = {
  border: '1px solid var(--farbe-linie, #ccc)',
  borderRadius: '8px',
  padding: '0.6rem 0.9rem',
  background: 'var(--farbe-flaeche, #fff)',
  cursor: 'pointer',
  fontSize: '1rem',
};
