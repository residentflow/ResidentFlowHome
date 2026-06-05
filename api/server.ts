// Lokale Typ-Deklarationen für Node.js-Globals (kein @types/node erforderlich)
declare const process: {
  env: Record<string, string | undefined>;
  argv: readonly string[];
  exit: (code?: number) => never;
};

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { optinRoute } from './routes/optin';

/**
 * Baut die Fastify-Instanz (§15.3).
 * Exportiert buildServer() für Tests via app.inject — kein echtes Listen nötig.
 */
export async function buildServer() {
  const app = Fastify({ logger: false });

  await app.register(cors, {
    origin: true,
  });

  await app.register(optinRoute);

  return app;
}

// Nur starten wenn direkt ausgeführt (nicht beim Import in Tests)
if (process.argv[1] === import.meta.url?.replace('file://', '')) {
  const PORT = Number(process.env['PORT'] ?? 3001);
  buildServer()
    .then((app) => app.listen({ port: PORT, host: '0.0.0.0' }))
    .then(() => {
      console.log(`API läuft auf Port ${PORT}`);
    })
    .catch((err: unknown) => {
      console.error('Serverfehler:', err);
      process.exit(1);
    });
}
