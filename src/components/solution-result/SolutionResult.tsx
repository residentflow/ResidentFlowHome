import type { ProblemCfg } from '@/config/checkConfig';
import { copy } from '@/config/checkConfig';

/**
 * SolutionResult-Renderer (PRD §11.1) — feste Blockreihenfolge, inline unter dem Check
 * und (ab AP3) auf /loesungen/{slug}. In L1 ist der Relevanzblock qualitativ (keine
 * €-Spanne ohne nicht-Platzhalter-Benchmark, §3.3). Vollständige Asset-Darstellung,
 * Rechenweg und der Skalierungsblock (mit Produktnennung) folgen in AP3.
 */
interface SolutionResultProps {
  problem: ProblemCfg;
  highIntent: boolean;
}

export function SolutionResult({ problem, highIntent }: SolutionResultProps) {
  return (
    <section data-testid="solution-result" style={{ marginTop: '1.5rem' }}>
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
        <div
          data-testid="highintent-cta"
          style={{
            marginTop: '1rem',
            padding: '1rem',
            border: '1px solid var(--farbe-linie, #ddd)',
          }}
        >
          <strong>{copy('cta.highIntent')}</strong>
          <p style={{ margin: '0.5rem 0 0' }}>{copy('cta.give.short')}</p>
        </div>
      )}

      {/* 5. Lösungs-Karten */}
      <ul data-testid="solution-cards" style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
        {problem.solutions.map((s) => (
          <li
            key={s.slug}
            data-testid={`solution-card-${s.slug}`}
            style={{ padding: '0.75rem 0', borderTop: '1px solid var(--farbe-linie, #eee)' }}
          >
            <strong>{s.title}</strong>
            <p style={{ margin: '0.25rem 0' }}>{s.shortDescription}</p>
            {highIntent && (
              <p
                data-testid={`scale-break-${s.slug}`}
                style={{ fontStyle: 'italic', color: '#666' }}
              >
                {s.scaleBreakNote}
              </p>
            )}
          </li>
        ))}
      </ul>

      {/* 8. Fallback-Zeile (nicht-highIntent) */}
      {!highIntent && (
        <p data-testid="fallback-zeile" style={{ marginTop: '1rem' }}>
          Ergebnis als PDF sichern · Weitere Lösungen prüfen
        </p>
      )}
    </section>
  );
}
