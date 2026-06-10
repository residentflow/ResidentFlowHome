import { useState } from 'react';
import type { ProblemCfg } from '@/config/checkConfig';
import { copy } from '@/config/checkConfig';
import { AssetRenderer } from '@/components/asset-renderer/AssetRenderer';
import { HighIntentCTA } from '@/components/cta/HighIntentCTA';
import type { CalComContext } from '@/domain/cta/engine';
import { SkalierungsBlock } from './SkalierungsBlock';

/**
 * SolutionResult-Renderer (PRD §11.1) — feste Blockreihenfolge, inline unter dem Check
 * und als /loesungen/{slug}. In L1 ist der Relevanzblock qualitativ (keine €-Spanne ohne
 * nicht-Platzhalter-Benchmark, §3.3). Lösungs-Karten öffnen als Accordion → AssetRenderer →
 * ScaleBreak → (HighIntent) Skalierungs-Block (einzige Stelle mit Produktnennung).
 */
interface SolutionResultProps {
  problem: ProblemCfg;
  highIntent: boolean;
  /** Answer-first-Block voranstellen (nur direkte SEO-/KI-Lösungsseiten, §11.4). */
  showAnswerFirst?: boolean;
  /** cal.com-Prefill-Kontext (§17.2) für die Termin-CTAs. */
  calContext?: CalComContext;
}

export function SolutionResult({
  problem,
  highIntent,
  showAnswerFirst,
  calContext,
}: SolutionResultProps) {
  const [offen, setOffen] = useState<string | null>(problem.solutions[0]?.slug ?? null);

  return (
    <section data-testid="solution-result" style={{ marginTop: '1.5rem' }}>
      {/* 0. Answer-first (nur direkte SEO-/KI-Seiten, §11.4) */}
      {showAnswerFirst && problem.answerFirst && (
        <div data-testid="answer-first" style={{ marginBottom: '1rem', fontSize: '1.05rem' }}>
          {problem.answerFirst}
        </div>
      )}

      {/* 1. Problem-Header */}
      <header data-testid="problem-header">
        <h3 style={{ marginBottom: '0.25rem' }}>{problem.title}</h3>
        <p style={{ color: 'var(--farbe-tinte-weich, #555)' }}>{problem.userFacingDescription}</p>
      </header>

      {/* 2. Relevanzblock (L1: qualitativ, keine €-Zahl) */}
      <div data-testid="relevanzblock" style={{ marginTop: '0.75rem' }}>
        <p>
          Für Ihren Bestand ist das ein relevanter Ansatzpunkt. Eine konservative €-Einschätzung
          entsteht im Gespräch an Ihrer echten Liste — vor Ihren Augen.
        </p>
        {highIntent && (
          <p data-testid="system-satz" style={{ fontWeight: 600 }}>
            {copy('copy.systemSatz')}
          </p>
        )}
      </div>

      {/* 4. HighIntentCTA kompakt — VOR den Lösungen (§11.1 Block 4) */}
      {highIntent && (
        <HighIntentCTA
          calContext={{
            ...(calContext ?? { source: 'direct' }),
            problemSlug: problem.slug,
            top3Slugs: problem.solutions.slice(0, 3).map((s) => s.slug),
          }}
        />
      )}

      {/* 5./6. Lösungs-Karten (Accordion) → AssetRenderer → ScaleBreak */}
      <ul data-testid="solution-cards" style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
        {problem.solutions.map((s) => {
          const istOffen = offen === s.slug;
          return (
            <li
              key={s.slug}
              data-testid={`solution-card-${s.slug}`}
              style={{ padding: '0.75rem 0', borderTop: '1px solid var(--farbe-linie, #eee)' }}
            >
              <button
                type="button"
                data-testid={`solution-toggle-${s.slug}`}
                aria-expanded={istOffen}
                onClick={() => setOffen(istOffen ? null : s.slug)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  textAlign: 'left',
                  font: 'inherit',
                }}
              >
                <strong>{s.title}</strong>
              </button>
              <p style={{ margin: '0.25rem 0' }}>{s.shortDescription}</p>

              {istOffen && (
                <div data-testid={`solution-body-${s.slug}`}>
                  {/* Primär-Asset zuerst, dann übrige */}
                  {[...s.assets]
                    .sort((a, b) =>
                      a.slug === String(s.primaryAsset)
                        ? -1
                        : b.slug === String(s.primaryAsset)
                          ? 1
                          : 0,
                    )
                    .map((a) => (
                      <AssetRenderer key={a.slug} asset={a} />
                    ))}

                  {/* ScaleBreak nur bei HighIntent (§11.2: nie bei Low-Score) */}
                  {highIntent && (
                    <p
                      data-testid={`scale-break-${s.slug}`}
                      style={{ fontStyle: 'italic', color: '#666', marginTop: '0.6rem' }}
                    >
                      {s.scaleBreakNote}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* 7. Skalierungs-Block — nur HighIntent (einzige Stelle mit Produktnennung) */}
      {highIntent && <SkalierungsBlock />}

      {/* 8. Fallback-Zeile (nicht-highIntent) */}
      {!highIntent && (
        <p data-testid="fallback-zeile" style={{ marginTop: '1rem' }}>
          Ergebnis als PDF sichern · Weitere Lösungen prüfen
        </p>
      )}
    </section>
  );
}
