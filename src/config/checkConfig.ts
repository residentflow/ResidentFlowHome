/**
 * Typisierter Zugriff auf die gebaute Bestands-Check-Konfiguration (PRD §10).
 * Quelle ist das statische, aus Payload exportierte check.config.json (Build-Export).
 * Kein Laufzeit-Fetch — die Datei ist Teil des Bundles (hartes Gate §10).
 */
import raw from '@/generated/check.config.json';

export interface BucketCfg {
  label: string;
  rank: number;
  unitsMid?: number;
}
export interface SizeMetricCfg {
  slug: string;
  frageWortlaut: string;
  buckets: BucketCfg[];
}
export interface RoleCfg {
  slug: string;
  label: string;
  sizeMetric: SizeMetricCfg | null;
  endAusgang: string;
  allowMandatsCTA: boolean;
  sizeIndependent: boolean;
}
export interface SolutionCfg {
  slug: string;
  title: string;
  shortDescription: string;
  valueCategory: 'ertrag' | 'effizienz' | 'risiko';
  scaleBreakNote: string;
  nutzenAussage: string | null;
  calculationModel: number | string | null;
}
export interface ProblemCfg {
  slug: string;
  title: string;
  userFacingDescription: string;
  roleFilters: string[];
  valueCategory: string[];
  priority: 'P1' | 'P2' | 'P3';
  solutions: SolutionCfg[];
  calculationModel: number | string | null;
}
export interface SettingsCfg {
  thresholdHigh: Record<string, number>;
  scoreWeights: { w1Size?: number; w2Value?: number; w3RoleFit?: number };
  scarcityTrue: boolean;
  monthlySlots: number;
  proofBandEnabled: boolean;
  privacyflowReady: boolean;
  calComUrl: string | null;
  stundensatzDefault: { min: number; max: number };
}
export interface CheckConfig {
  generatedAt: string;
  settings: SettingsCfg;
  roles: RoleCfg[];
  problems: ProblemCfg[];
  calculationModels: Array<{
    modelId: string;
    valueCategory: string;
    formula: string;
    requiredInputs: string[];
    optionalInputs: string[];
    explanationText: string;
    sourceNote: string;
    benchmarks: Array<{ key: string; min: number; max: number; unit: string }>;
  }>;
  ctaRules: Array<Record<string, unknown>>;
  copy: Record<string, string>;
  proofFindings: Array<Record<string, unknown>>;
  experiments: Array<Record<string, unknown>>;
  designVariants: Array<{ slug: string; tokens: Record<string, string> }>;
}

export const checkConfig = raw as unknown as CheckConfig;

/** Copy-Key mit Fallback (Platzhalter sichtbar machen statt leer rendern). */
export function copy(key: string): string {
  return checkConfig.copy[key] ?? `‹${key}›`;
}

/** Probleme, die für eine Rolle gelten (roleFilters per Slug), max. 7 Karten (§10.1). */
export function problemeFuerRolle(rolleSlug: string): ProblemCfg[] {
  return checkConfig.problems
    .filter((p) => p.roleFilters.length === 0 || p.roleFilters.includes(rolleSlug))
    .slice(0, 7);
}

export function rolleBySlug(slug: string): RoleCfg | undefined {
  return checkConfig.roles.find((r) => r.slug === slug);
}
