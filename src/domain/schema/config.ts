import { z } from 'zod';
import { SchmerzBereichSchema } from './schmerzBereich';
import { PhaseSchema } from './phase';
import { ProblemSchema } from './problem';
import { LoesungSchema } from './loesung';
import { SegmentSchema } from './segment';
import { GlobalConfigSchema } from './globalConfig';

/**
 * Gesamt-Config (Single Source of Truth, §13/§14). Zusätzlich zu den Einzel-Gates erzwingt
 * superRefine die Cross-Reference-Integrität:
 * - jeder verknüpfteLoesung eines Problems existiert im Loesung-Katalog;
 * - die lebenszyklusPhase jedes Loesungs existiert im Phasen-Katalog.
 */
export const ConfigSchema = z
  .object({
    schmerzBereiche: z.array(SchmerzBereichSchema),
    phasen: z.array(PhaseSchema),
    probleme: z.array(ProblemSchema),
    loesung: z.array(LoesungSchema),
    segmente: z.array(SegmentSchema),
    globalConfig: GlobalConfigSchema,
  })
  .superRefine((config, ctx) => {
    const loesungIds = new Set(config.loesung.map((h) => h.id));
    const phasenIds = new Set(config.phasen.map((p) => p.id));

    config.probleme.forEach((problem, pi) => {
      problem.verknuepfteLoesung.forEach((loesungId, hi) => {
        if (!loesungIds.has(loesungId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Problem "${problem.id}" verweist auf unbekannte Lösung "${loesungId}".`,
            path: ['probleme', pi, 'verknuepfteLoesung', hi],
          });
        }
      });
    });

    config.loesung.forEach((loesung, hi) => {
      if (!phasenIds.has(loesung.lebenszyklusPhase)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Lösung "${loesung.id}" verweist auf unbekannte Phase ${loesung.lebenszyklusPhase}.`,
          path: ['loesung', hi, 'lebenszyklusPhase'],
        });
      }
    });
  });

export type Config = z.infer<typeof ConfigSchema>;
