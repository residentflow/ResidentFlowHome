/**
 * CTARule-Engine (PRD §14.3) — deklarativ, framework-frei, testbar.
 * SHOW WHEN role ∈ roleFilters AND sizeScore ≥ minSizeScore
 *   AND (problem.valueCategory ∈ {ertrag,effizienz} OR allowRisiko)
 *   AND firstValueShown == true. Sortiert nach priority (desc).
 * CTA-Rendering ohne CTARule ist verboten (§20) — nur Treffer dieser Engine werden gerendert.
 */
export interface CTARuleCfg {
  name: string;
  roleFilters: string[];
  minSizeScore: number | null;
  maxSizeScore: number | null;
  minRelevanceScore: number | null;
  allowRisiko: boolean;
  primaryLabel: string;
  sublineKey: string | null;
  secondaryLabel: string | null;
  destination: string;
  priority: number;
}

export interface CTAContext {
  roleSlug: string;
  sizeScore: number;
  relevance?: number;
  valueCategory: string[];
  firstValueShown: boolean;
}

export function waehleCTAs(ctx: CTAContext, rules: CTARuleCfg[]): CTARuleCfg[] {
  if (!ctx.firstValueShown) return [];
  return rules
    .filter((r) => r.roleFilters.length === 0 || r.roleFilters.includes(ctx.roleSlug))
    .filter((r) => r.minSizeScore == null || ctx.sizeScore >= r.minSizeScore)
    .filter((r) => r.maxSizeScore == null || ctx.sizeScore <= r.maxSizeScore)
    .filter((r) => r.minRelevanceScore == null || (ctx.relevance ?? 0) >= r.minRelevanceScore)
    .filter((r) => {
      const istChanceOderEffizienz = ctx.valueCategory.some(
        (v) => v === 'ertrag' || v === 'effizienz',
      );
      return istChanceOderEffizienz || r.allowRisiko;
    })
    .sort((a, b) => b.priority - a.priority);
}

export interface CalComContext {
  role?: string;
  sizeBucket?: string;
  problemSlug?: string;
  top3Slugs?: string[];
  range?: { min: number; max: number } | null;
  source: string;
}

/** cal.com-Prefill (§17.2). Header-Direct nutzt source=header-direct ohne Diagnosekontext. */
export function buildCalComUrl(calComUrl: string, ctx: CalComContext): string {
  const p = new URLSearchParams();
  if (ctx.role) p.set('metadata[role]', ctx.role);
  if (ctx.sizeBucket) p.set('metadata[size]', ctx.sizeBucket);
  if (ctx.problemSlug) p.set('metadata[problem]', ctx.problemSlug);
  if (ctx.top3Slugs?.length) p.set('metadata[solutions]', ctx.top3Slugs.slice(0, 3).join(','));
  if (ctx.range) p.set('metadata[range]', `${ctx.range.min}-${ctx.range.max}`);
  p.set('metadata[source]', ctx.source);
  const sep = calComUrl.includes('?') ? '&' : '?';
  return `${calComUrl}${sep}${p.toString()}`;
}
