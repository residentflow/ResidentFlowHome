import { ConfigSchema } from '@/domain/schema/config';
import type { Config } from '@/domain/schema/config';

/**
 * Exportiert die Config als JSON-String (§13.1).
 * Enthält ausschließlich Konfigurationsdaten — niemals Besucherdaten (§13.4).
 */
export function exportConfig(config: Config): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Importiert und validiert eine Config aus einem JSON-String (§13.1).
 * Wirft bei ungültiger Config (Schema-Gate via ConfigSchema).
 */
export function importConfig(json: string): Config {
  const parsed: unknown = JSON.parse(json);
  return ConfigSchema.parse(parsed);
}

/**
 * Validiert eine Config ohne zu werfen — gibt Zod-SafeParseReturnType zurück (§13.3).
 */
export function validiereConfig(
  config: unknown,
): { success: true; data: Config } | { success: false; error: unknown } {
  const ergebnis = ConfigSchema.safeParse(config);
  if (ergebnis.success) {
    return { success: true, data: ergebnis.data };
  }
  return { success: false, error: ergebnis.error };
}
