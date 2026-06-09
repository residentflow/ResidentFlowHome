import { z } from 'zod';
import { TAETIGKEITEN, WERT_KATEGORIEN, RAHMUNGEN } from '../enums';
import { FormelSchema } from './formel';

/**
 * Hebel (§6/§6.1/§14) — extern sichtbarer Name einer Lösung. Gates:
 * - wertKategorie=risiko ⇒ rahmung=verlust (Verlust-Rahmung nur bei Risiko).
 * - quantifizierbar=true ⇒ berechnung (Formel) Pflicht.
 * - quantifizierbar=false ⇒ nutzenAussage Pflicht (qualitativer Nutzen statt Euro).
 */
export const HebelSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    lebenszyklusPhase: z.number().int().positive(),
    wertKategorie: z.enum(WERT_KATEGORIEN),
    rahmung: z.enum(RAHMUNGEN),
    quantifizierbar: z.boolean(),
    taetigkeiten: z.array(z.enum(TAETIGKEITEN)).min(1),
    detailFragen: z.array(z.string().min(1)),
    berechnung: FormelSchema.optional(),
    nutzenAussage: z.string().min(1).optional(),
    personaSprache: z.record(z.string(), z.string()).optional(),
    playbookLink: z.string().min(1),
    videoLink: z.string().min(1).optional(),
    kartenText: z.string().min(1),
  })
  .refine((h) => !(h.wertKategorie === 'risiko' && h.rahmung !== 'verlust'), {
    message: 'Risiko-Hebel müssen die Verlust-Rahmung tragen (§6.1).',
    path: ['rahmung'],
  })
  .refine((h) => !(h.quantifizierbar && !h.berechnung), {
    message: 'Quantifizierbarer Hebel verlangt eine Berechnung (Formel) (§7).',
    path: ['berechnung'],
  })
  .refine((h) => !(!h.quantifizierbar && !h.nutzenAussage), {
    message: 'Qualitativer Hebel verlangt eine nutzenAussage (§6.1).',
    path: ['nutzenAussage'],
  });

export type Hebel = z.infer<typeof HebelSchema>;
