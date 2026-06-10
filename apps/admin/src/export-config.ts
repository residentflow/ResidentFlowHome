/**
 * Build-Export (PRD §10/§19/§25): Payload (Postgres) → src/generated/check.config.json.
 * Nur öffentlich freigegebene Felder. Drei Gate-Mechaniken:
 *   1. isPlaceholder-Gate: bricht bei aktivem Platzhalter-Benchmark im P1-Pfad.
 *   2. Objekt-Gate-Filter: Probleme mit <2 aktiven Lösungen werden ausgeschlossen
 *      (degradiert per Ausschluss). CI WARNT; bricht nur, wenn ein P1-Problem betroffen ist.
 *   3. Experiment-Bundle: Experiment-Definitionen werden mitgebündelt (ohne Deploy testbar).
 *
 * Lauf: `tsx scripts/export-config.ts` (Repo-Root) oder `npm run export-config` (apps/admin).
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { getPayload } from 'payload';
import config from '../payload.config';

const dirname = path.dirname(fileURLToPath(import.meta.url)); // apps/admin/src
const OUT = path.resolve(dirname, '../../../src/generated/check.config.json');

async function main() {
  const payload = await getPayload({ config });

  const all = async (slug: string, depth = 0) =>
    (await payload.find({ collection: slug as never, limit: 1000, depth })).docs as any[];

  const [
    roles,
    sizeMetrics,
    problemsRaw,
    solutions,
    assets,
    calcModels,
    benchmarks,
    ctaRules,
    copyKeys,
    experiments,
    designVariants,
    proofFindings,
    settingsList,
  ] = await Promise.all([
    all('roles', 1),
    all('size-metrics'),
    all('problems', 1),
    all('solutions'),
    all('assets'),
    all('calculation-models', 1),
    all('benchmarks'),
    all('cta-rules'),
    all('copy-keys'),
    all('experiments'),
    all('design-variants'),
    all('proof-findings'),
    all('settings'),
  ]);

  const settings = settingsList[0] || {};
  const solutionById = new Map(solutions.map((s) => [s.id, s]));
  const benchmarkById = new Map(benchmarks.map((b) => [b.id, b]));
  const assetById = new Map(assets.map((a) => [a.id, a]));
  const roleSlugById = new Map(roles.map((r) => [r.id, r.slug]));
  const calcModelIdById = new Map(calcModels.map((m) => [m.id, m.modelId]));
  const idOf = (rel: any) => (rel && typeof rel === 'object' ? rel.id : rel);
  const slugOfRole = (rel: any) => roleSlugById.get(idOf(rel)) || idOf(rel);

  // Strictness: 'L1' (lauffähig, Platzhalter nur Warnung) | 'L2' (strikt, Platzhalter bricht).
  const level = (process.env.EXPORT_LEVEL || 'L1').toUpperCase();
  const strikt = level === 'L2';

  const warnungen: string[] = [];
  const fehler: string[] = [];

  // — Objekt-Gate-Filter: Probleme mit <2 aktiven, live-fähigen Lösungen ausschließen —
  const aktiveProbleme = problemsRaw.filter((p) => p.active);
  const eingeschlossen: any[] = [];
  for (const p of aktiveProbleme) {
    const solIds = (p.solutions || []).map(idOf);
    const aktiveSols = solIds
      .map((id: number) => solutionById.get(id))
      .filter((s: any) => s && s.active);
    if (aktiveSols.length < 2) {
      const msg = `Problem "${p.slug}" (${p.priority}) ausgeschlossen: nur ${aktiveSols.length} aktive Lösung(en) (<2, §25 Objekt-Gate).`;
      if (p.priority === 'P1') {
        fehler.push(msg); // P1 betroffen → Build bricht (G3)
      } else {
        warnungen.push(msg); // P2/P3 → nur Ausschluss + Warnung
      }
      continue;
    }
    eingeschlossen.push(p);
  }

  // — isPlaceholder-Gate: P1-Pfad darf keine Platzhalter-Benchmarks nutzen (G2) —
  const p1Probleme = eingeschlossen.filter((p) => p.priority === 'P1');
  for (const p of p1Probleme) {
    const modelle = [idOf(p.calculationModel)]
      .filter(Boolean)
      .map((id) => calcModels.find((m) => m.id === id))
      .filter(Boolean);
    for (const m of modelle) {
      for (const bRel of m.benchmarkFactors || []) {
        const b = benchmarkById.get(idOf(bRel));
        if (b && b.isPlaceholder) {
          const msg = `isPlaceholder-Gate (G2): P1-Problem "${p.slug}" nutzt Platzhalter-Benchmark "${b.key}".`;
          if (strikt) fehler.push(msg + ' L2 gesperrt.');
          else warnungen.push(msg + ' L1: €-Quantifizierung ausgeschlossen, qualitativ.');
        }
      }
    }
  }

  // — G1: ProofStrip nur mit ≥3 publicApproved Findings, davon ≥1 umsetzung-gestartet —
  const approved = proofFindings.filter((f) => f.publicApproved);
  const proofBandEnabled =
    Boolean(settings.proofBandEnabled) &&
    approved.length >= 3 &&
    approved.some((f) => f.status === 'umsetzung-gestartet' || f.status === 'realisiert');

  // — check.config.json zusammenstellen (nur öffentliche Felder) —
  const checkConfig = {
    generatedAt: new Date().toISOString(),
    settings: {
      thresholdHigh: settings.thresholdHigh || {},
      scoreWeights: settings.scoreWeights || {},
      scarcityTrue: Boolean(settings.scarcityTrue),
      monthlySlots: settings.monthlySlots || 0,
      proofBandEnabled,
      privacyflowReady: Boolean(settings.privacyflowReady),
      calComUrl: settings.calComUrl || null,
      stundensatzDefault: settings.stundensatzDefault || { min: 60, max: 90 },
    },
    roles: roles
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((r) => ({
        slug: r.slug,
        label: r.label,
        sizeMetric: (() => {
          const sm = sizeMetrics.find((m) => m.id === idOf(r.sizeMetric));
          return sm
            ? {
                slug: sm.slug,
                frageWortlaut: sm.frageWortlaut,
                // Auto-generierte Array-Row-IDs entfernen → deterministischer Export
                buckets: (sm.buckets || []).map((b: any) => ({
                  label: b.label,
                  rank: b.rank,
                  ...(b.unitsMid != null ? { unitsMid: b.unitsMid } : {}),
                })),
              }
            : null;
        })(),
        endAusgang: r.endAusgang,
        allowMandatsCTA: r.allowMandatsCTA,
        sizeIndependent: r.sizeIndependent,
      })),
    problems: eingeschlossen.map((p) => ({
      slug: p.slug,
      title: p.title,
      userFacingDescription: p.userFacingDescription,
      answerFirst: p.answerFirst || null,
      roleFilters: (p.roleFilters || []).map(slugOfRole),
      valueCategory: p.valueCategory || [],
      priority: p.priority,
      solutions: (p.solutions || [])
        .map(idOf)
        .map((id: number) => solutionById.get(id))
        .filter((s: any) => s && s.active)
        .map((s: any) => ({
          slug: s.slug,
          title: s.title,
          shortDescription: s.shortDescription,
          valueCategory: s.valueCategory,
          scaleBreakNote: s.scaleBreakNote,
          nutzenAussage: s.nutzenAussage || null,
          calculationModel: calcModelIdById.get(idOf(s.calculationModel)) || null,
          primaryAsset: idOf(s.primaryAsset) || null,
          // Nur live-fähige Assets (§25): qualityStatus∈{reviewed,approved} UND riskLevel gesetzt
          assets: (s.assets || [])
            .map((aRel: any) => assetById.get(idOf(aRel)))
            .filter(
              (a: any) =>
                a &&
                (a.qualityStatus === 'reviewed' || a.qualityStatus === 'approved') &&
                a.riskLevel,
            )
            .map((a: any) => ({
              slug: a.slug,
              title: a.title,
              assetType: a.assetType,
              summary: a.summary,
              copyable: Boolean(a.copyable),
              promptText: a.promptText || null,
              requiredInputs: a.requiredInputs || null,
              bodyText: a.bodyText || null,
              videoUrl: a.videoUrl || null,
              requiresPrivacyNote: Boolean(a.requiresPrivacyNote),
              riskLevel: a.riskLevel,
            })),
        })),
      calculationModel: calcModelIdById.get(idOf(p.calculationModel)) || null,
    })),
    calculationModels: calcModels.map((m) => ({
      modelId: m.modelId,
      valueCategory: m.valueCategory,
      formula: m.formula,
      requiredInputs: (m.requiredInputs || []).map((i: any) => i.key),
      optionalInputs: (m.optionalInputs || []).map((i: any) => i.key),
      explanationText: m.explanationText,
      sourceNote: m.sourceNote,
      // Nur nicht-Platzhalter-Benchmarkwerte öffentlich ausgeben
      benchmarks: (m.benchmarkFactors || [])
        .map((bRel: any) => benchmarkById.get(idOf(bRel)))
        .filter((b: any) => b && !b.isPlaceholder)
        .map((b: any) => ({ key: b.key, min: b.min, max: b.max, unit: b.unit })),
    })),
    ctaRules: ctaRules
      .filter((c) => c.active)
      .map((c) => ({
        name: c.name,
        roleFilters: (c.roleFilters || []).map(slugOfRole),
        problemFilters: (c.problemFilters || []).map(idOf),
        solutionFilters: (c.solutionFilters || []).map(idOf),
        minSizeScore: c.minSizeScore ?? null,
        maxSizeScore: c.maxSizeScore ?? null,
        minRelevanceScore: c.minRelevanceScore ?? null,
        allowRisiko: Boolean(c.allowRisiko),
        primaryLabel: c.primaryLabel,
        sublineKey: c.sublineKey || null,
        secondaryLabel: c.secondaryLabel || null,
        destination: c.destination,
        priority: c.priority || 0,
      })),
    copy: Object.fromEntries(copyKeys.map((c) => [c.key, c.value])),
    proofFindings: proofBandEnabled
      ? approved.map((f) => ({
          category: f.category,
          title: f.title,
          valueMin: f.valueMin ?? null,
          valueMax: f.valueMax ?? null,
          realizedValue: f.realizedValue ?? null,
          status: f.status,
        }))
      : [],
    // Experiment-Bundle (§19.3): hash-stabile Client-Zuteilung erfolgt im Frontend
    experiments: experiments
      .filter((e) => e.status === 'running')
      .map((e) => ({
        name: e.name,
        variants: (e.variants || []).map((v: any) => ({ id: v.id, weight: v.weight })),
        trafficAllocation: e.trafficAllocation ?? 1,
        targetAudience: e.targetAudience || null,
        successMetric: e.successMetric,
      })),
    designVariants: designVariants.map((d) => ({
      slug: d.slug,
      tokens: Object.fromEntries((d.tokens || []).map((t: any) => [t.key, t.value])),
    })),
  };

  // — Report —
  for (const w of warnungen) console.warn('WARN  ' + w);
  if (fehler.length > 0) {
    for (const f of fehler) console.error('FEHLER ' + f);
    console.error(`\nExport abgebrochen: ${fehler.length} blockierende Gate-Verletzung(en).`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(checkConfig, null, 2) + '\n');
  console.log(
    `EXPORT OK (Level ${level}) → ${path.relative(process.cwd(), OUT)} ` +
      `(${checkConfig.problems.length} Probleme live, proofBand=${proofBandEnabled}, ` +
      `${warnungen.length} Warnung(en))`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error('EXPORT FAIL', e);
  process.exit(1);
});
