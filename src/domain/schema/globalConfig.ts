import { z } from 'zod';

/** Globale Konfiguration (§13.2/§14). Schwellenwert-Standard 50. */
export const GlobalConfigSchema = z.object({
  schwellenwertStufe3: z.number().int().positive().default(50),
  terminLink: z.string().min(1),
  partnerprogrammLink: z.string().min(1),
  brevoListId: z.number().int().nonnegative(),
  privacyFlowDownloadUrl: z.string().min(1),
});

export type GlobalConfig = z.infer<typeof GlobalConfigSchema>;
