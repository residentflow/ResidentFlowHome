import { checkConfig, type ProblemCfg } from '@/config/checkConfig';
import { berechneM1, berechneM2, type Spanne } from './models';

/**
 * Config-gebundene Relevanzrechnung (PRD §13). Verbindet das Problem mit seinem
 * CalculationModel und den (nicht-Platzhalter-)Benchmarks aus check.config.json.
 * Liefert null (→ qualitativ), wenn Modell/Benchmarks fehlen oder Einheiten unbekannt sind.
 */
export interface RangeErgebnis {
  spanne: Spanne;
  rechenweg: string;
}

function benchmarkSpanne(modelId: string, key: string): Spanne | null {
  const m = checkConfig.calculationModels.find((cm) => cm.modelId === modelId);
  const b = m?.benchmarks.find((x) => x.key === key);
  return b ? { min: b.min, max: b.max } : null;
}

export function berechneRange(problem: ProblemCfg, units: number | null): RangeErgebnis | null {
  const modelId = problem.calculationModel;
  if (typeof modelId !== 'string' || units == null) return null;
  const model = checkConfig.calculationModels.find((cm) => cm.modelId === modelId);
  if (!model) return null;

  if (model.formula === 'M1') {
    const share = benchmarkSpanne(modelId, 'shareContractsUnreviewed24m');
    const uplift = benchmarkSpanne(modelId, 'avgUpliftPerAffectedContract');
    if (!share || !uplift) return null; // Platzhalter ausgeschlossen → qualitativ
    const spanne = berechneM1({ units, shareUnreviewed: share, upliftPerContract: uplift });
    const rechenweg = model.explanationText
      .replace('{units}', String(units))
      .replace('{share}', `${Math.round(share.min * 100)}–${Math.round(share.max * 100)}`)
      .replace('{uplift}', `${uplift.min}–${uplift.max}`);
    return { spanne, rechenweg };
  }

  if (model.formula === 'M2') {
    const minutes = benchmarkSpanne(modelId, 'adminMinutesPerUnitMonth');
    if (!minutes) return null;
    const r = berechneM2({ units, adminMinutesPerUnitMonth: minutes });
    // M2 zeigt primär Zeit; € nur sekundär (hier nicht als €-Spanne ausgegeben)
    return {
      spanne: { min: r.stundenProMonat.min, max: r.stundenProMonat.max },
      rechenweg: `${units} Einheiten × ${minutes.min}–${minutes.max} Min./Monat ÷ 60 — Stunden/Monat.`,
    };
  }

  return null; // M3/M4 qualitativ bzw. ohne €
}
