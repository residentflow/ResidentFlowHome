/**
 * Server-seitiger Brevo-Adapter (§11 / §15.3).
 * Liest BREVO_API_KEY und BREVO_LIST_ID aus der Umgebung.
 * In Tests wird dieses Modul via vi.mock komplett ersetzt — kein echter Netzwerkaufruf.
 */

export function getBrevoApiKey(): string {
  return process.env['BREVO_API_KEY'] ?? '';
}

export function getBrevoListId(): number {
  return Number(process.env['BREVO_LIST_ID'] ?? 0);
}
