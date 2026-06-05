import { z } from 'zod';
import { SchmerzBereichSchema } from './schmerzBereich';
import { PhaseSchema } from './phase';
import { ProblemSchema } from './problem';
import { HebelSchema } from './hebel';
import { SegmentSchema } from './segment';
import { GlobalConfigSchema } from './globalConfig';

/**
 * Gesamt-Config (Single Source of Truth, §13/§14). Zusätzlich zu den Einzel-Gates erzwingt
 * superRefine die Cross-Reference-Integrität:
 * - jeder verknüpfteHebel eines Problems existiert im Hebel-Katalog;
 * - die lebenszyklusPhase jedes Hebels existiert im Phasen-Katalog.
 */
export const ConfigSchema = z
  .object({
    schmerzBereiche: z.array(SchmerzBereichSchema),
    phasen: z.array(PhaseSchema),
    probleme: z.array(ProblemSchema),
    hebel: z.array(HebelSchema),
    segmente: z.array(SegmentSchema),
    globalConfig: GlobalConfigSchema,
  })
  .superRefine((config, ctx) => {
    const hebelIds = new Set(config.hebel.map((h) => h.id));
    const phasenIds = new Set(config.phasen.map((p) => p.id));

    config.probleme.forEach((problem, pi) => {
      problem.verknuepfteHebel.forEach((hebelId, hi) => {
        if (!hebelIds.has(hebelId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Problem "${problem.id}" verweist auf unbekannten Hebel "${hebelId}".`,
            path: ['probleme', pi, 'verknuepfteHebel', hi],
          });
        }
      });
    });

    config.hebel.forEach((hebel, hi) => {
      if (!phasenIds.has(hebel.lebenszyklusPhase)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Hebel "${hebel.id}" verweist auf unbekannte Phase ${hebel.lebenszyklusPhase}.`,
          path: ['hebel', hi, 'lebenszyklusPhase'],
        });
      }
    });
  });

export type Config = z.infer<typeof ConfigSchema>;
