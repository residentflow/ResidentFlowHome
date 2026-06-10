import { useState } from 'react';
import type { ProblemCfg } from '@/config/checkConfig';
import { copy } from '@/config/checkConfig';
import { AssetRenderer } from '@/components/asset-renderer/AssetRenderer';
import { HighIntentCTA } from '@/components/cta/HighIntentCTA';
import { SegmentCTA } from '@/components/cta/SegmentCTA';
import type { CalComContext } from '@/domain/cta/engine';
import { berechneRange } from '@/domain/calc/fromConfig';
import { SkalierungsBlock } from './SkalierungsBlock';

const SEGMENT_AUSGAENGE = ['partnerprogramm', 'vermarktungsprozess', 'projektprozess'];

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
  /** Repräsentative Einheiten (Bucket-Mittelwert) für die €-Quantifizierung (§13). */
  units?: number | null;
  /** End-Ausgang der Rolle (§2.3/§14.5): steuert Partner-/Vermarktungs-/Projekt-CTA. */
  endAusgang?: string;
}

export function SolutionResult({
  problem,
  highIntent,
  showAnswerFirst,
  calContext,
  units,
  endAusgang,
}: SolutionResultProps) {
  // Mandats-Pfad (Gespräch + Skalierungs-Block) nur für B&H/HV im Gesprächs-Ausgang.
  // Makler erhalten NIE einen Mandats-CTA (§2.3) — auch bei HighIntent nicht.
  const mandatsPfad = endAusgang !== undefined ? endAusgang === 'gespraech' : highIntent;
  const zeigeSegmentCTA = !!endAusgang && SEGMENT_AUSGAENGE.includes(endAusgang);
  const [offen, setOffen] = useState<string | null>(problem.solutions[0]?.slug ?? null);
  const [rechenwegOffen, setRechenwegOffen] = useState(false);
  const range = units != null ? berechneRange(problem, units) : null;

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

      {/* 2. Relevanzblock — Zustandsmaschine (§11.2): quantifiziert (€-Spanne + Rechenweg)
          sobald Einheiten + nicht-Platzhalter-Benchmarks vorliegen, sonst qualitativ. */}
      <div data-testid="relevanzblock" style={{ marginTop: '0.75rem' }}>
        {range ? (
          <div data-testid="relevanz-quantifiziert">
            <p>
              Konservativ geschätztes Jahrespotenzial:{' '}
              <strong data-testid="euro-spanne">
                {range.spanne.min.toLocaleString('de-DE')}–
                {range.spanne.max.toLocaleString('de-DE')} €
              </strong>{' '}
              p. a.
            </p>
            <button
              type="button"
              data-testid="rechenweg-toggle"
              aria-expanded={rechenwegOffen}
              onClick={() => setRechenwegOffen(!rechenwegOffen)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Rechenweg anzeigen
            </button>
            {rechenwegOffen && (
              <p data-testid="rechenweg" style={{ color: '#555' }}>
                {range.rechenweg}
              </p>
            )}
          </div>
        ) : (
          <p data-testid="relevanz-qualitativ">
            Für Ihren Bestand ist das ein relevanter Ansatzpunkt. Eine konservative €-Einschätzung
            entsteht im Gespräch an Ihrer echten Liste — vor Ihren Augen.
          </p>
        )}
        {mandatsPfad && (
          <p data-testid="system-satz" style={{ fontWeight: 600 }}>
            {copy('copy.systemSatz')}
          </p>
        )}
      </div>

      {/* 4. HighIntentCTA kompakt — VOR den Lösungen (§11.1 Block 4) */}
      {mandatsPfad && (
        <HighIntentCTA
          calContext={{
            ...(calContext ?? { source: 'direct' }),
            problemSlug: problem.slug,
            top3Slugs: problem.solutions.slice(0, 3).map((s) => s.slug),
          }}
        />
      )}
      {/* End-Ausgangs-CTA für Partner-/Vermarktungs-/Projekt-Segmente (§14.5) */}
      {zeigeSegmentCTA && <SegmentCTA endAusgang={endAusgang!} />}

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
                  {mandatsPfad && (
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
      {mandatsPfad && <SkalierungsBlock />}

      {/* 8. Fallback-Zeile (Motor A: kein Mandats-Pfad, kein Segment-Ausgang) */}
      {!mandatsPfad && !zeigeSegmentCTA && (
        <p data-testid="fallback-zeile" style={{ marginTop: '1rem' }}>
          Ergebnis als PDF sichern · Weitere Lösungen prüfen
        </p>
      )}
    </section>
  );
}
