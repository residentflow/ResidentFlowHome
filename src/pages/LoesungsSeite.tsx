import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { checkConfig, copy, problemBySlug, type RoleCfg } from '@/config/checkConfig';
import { istHighIntent, endAusgang as berechneEndAusgang } from '@/components/bestands-check/score';
import { InlineKontextChips } from '@/components/inline-context-chips/InlineKontextChips';
import { SolutionResult } from '@/components/solution-result/SolutionResult';
import { StickyBar } from '@/components/cta/StickyBar';

/**
 * Lösungsseite /loesungen/{slug} (PRD §7/§11) — direkter Einstieg aus LinkedIn/SEO/KI (J2–J4).
 * Answer-first voran (§11.4); InlineKontextChips schalten Rolle+Größe → HighIntent frei (§11.3).
 * Ohne Kontext bleibt die Seite voll nutzbar (Motor A). Kein Fetch/Storage.
 */
export function LoesungsSeite() {
  const { slug } = useParams<{ slug: string }>();
  const problem = slug ? problemBySlug(slug) : undefined;

  const [rolle, setRolle] = useState<RoleCfg | null>(null);
  const [bucketRank, setBucketRank] = useState<number | null>(null);
  const [units, setUnits] = useState<number | null>(null);

  if (!problem) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>Lösung nicht gefunden</h1>
        <p>
          Diese Lösung ist aktuell nicht verfügbar. <a href="/">Zur Startseite</a>
        </p>
      </main>
    );
  }

  const highIntent =
    rolle && bucketRank != null
      ? istHighIntent({ rolle, bucketRank }, checkConfig.settings.thresholdHigh)
      : false;
  const endAusgang =
    rolle && bucketRank != null
      ? berechneEndAusgang({ rolle, bucketRank }, checkConfig.settings.thresholdHigh)
      : undefined;

  return (
    <main
      style={{ maxWidth: 720, margin: '0 auto', padding: '1.5rem 1rem' }}
      data-testid="loesungs-seite"
    >
      <p data-testid="eyebrow" style={{ letterSpacing: '0.08em', fontSize: '0.85rem' }}>
        {copy('copy.eyebrow')}
      </p>
      {/* InlineKontextChips: zwei Klicks → quantifiziert/HighIntent (§11.3) */}
      <InlineKontextChips
        onContext={(r, rank, u) => {
          setRolle(r);
          setBucketRank(rank);
          setUnits(u);
        }}
      />
      <SolutionResult
        problem={problem}
        highIntent={highIntent}
        endAusgang={endAusgang}
        showAnswerFirst
        units={units}
        calContext={{ role: rolle?.slug, problemSlug: problem.slug, source: 'direct' }}
      />
      {highIntent && (
        <StickyBar
          key={problem.slug}
          calContext={{ role: rolle?.slug, problemSlug: problem.slug, source: 'direct' }}
        />
      )}
    </main>
  );
}

export default LoesungsSeite;
