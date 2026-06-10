/**
 * Build-Export-Loader (PRD §10). Die Logik lebt in apps/admin/src/export-config.ts,
 * wo der `payload`-Import korrekt aus apps/admin/node_modules auflöst. Dieser dünne
 * Loader erlaubt den Aufruf vom Repo-Root: `tsx scripts/export-config.ts`.
 * Env: DATABASE_URI, PAYLOAD_SECRET, optional EXPORT_LEVEL=L2 (strikt).
 */
import '../apps/admin/src/export-config';
