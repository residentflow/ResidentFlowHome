import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ENV_EXAMPLE_PFAD = path.resolve(process.cwd(), '.env.example');

function leseEnvExample(): string {
  return fs.readFileSync(ENV_EXAMPLE_PFAD, 'utf-8');
}

function parseEnvZeilen(inhalt: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const zeile of inhalt.split('\n')) {
    const bereinigt = zeile.trim();
    if (!bereinigt || bereinigt.startsWith('#')) continue;
    const gleichPos = bereinigt.indexOf('=');
    if (gleichPos === -1) continue;
    const schluessel = bereinigt.slice(0, gleichPos).trim();
    const wert = bereinigt.slice(gleichPos + 1).trim();
    map.set(schluessel, wert);
  }
  return map;
}

describe('.env.example — Konfigurationsdokumentation', () => {
  it('die .env.example dokumentiert BREVO_API_KEY und BREVO_LIST_ID', () => {
    const inhalt = leseEnvExample();
    const variablen = parseEnvZeilen(inhalt);

    expect(
      variablen.has('BREVO_API_KEY'),
      'BREVO_API_KEY fehlt in .env.example',
    ).toBe(true);

    expect(
      variablen.has('BREVO_LIST_ID'),
      'BREVO_LIST_ID fehlt in .env.example',
    ).toBe(true);
  });

  it('die .env.example enthält keine echten Secret-Werte (Werte leer oder Platzhalter)', () => {
    const inhalt = leseEnvExample();
    const variablen = parseEnvZeilen(inhalt);

    // Bekannte Secrets dürfen keinen echter Wert rechts vom = haben
    const sensitiveKeys = ['BREVO_API_KEY', 'BREVO_LIST_ID'];

    for (const key of sensitiveKeys) {
      if (!variablen.has(key)) continue;
      const wert = variablen.get(key)!;

      // Leer, oder Platzhalter-Muster wie <...>, DEIN_..., your_..., xxx, etc.
      const istLeerOderPlatzhalter =
        wert === '' ||
        /^<[^>]+>$/.test(wert) ||
        /^your[-_]/i.test(wert) ||
        /^DEIN/i.test(wert) ||
        /^HIER/i.test(wert) ||
        /^placeholder/i.test(wert) ||
        /^xxx+$/i.test(wert) ||
        /^changeme$/i.test(wert);

      expect(
        istLeerOderPlatzhalter,
        `${key} enthält möglicherweise einen echten Wert: "${wert}" — bitte Platzhalter verwenden`,
      ).toBe(true);
    }
  });
});

describe('.env.example — Docker-Compose-Services', () => {
  it('docker-compose.yml definiert die Services web, api und analytics', () => {
    const composePfad = path.resolve(process.cwd(), 'docker-compose.yml');
    const inhalt = fs.readFileSync(composePfad, 'utf-8');

    expect(inhalt, 'Service "web" fehlt in docker-compose.yml').toContain('web:');
    expect(inhalt, 'Service "api" fehlt in docker-compose.yml').toContain('api:');
    expect(inhalt, 'Service "analytics" fehlt in docker-compose.yml').toContain('analytics:');
  });

  it('docker-compose.yml exponiert kein CMS im Prod-Web-Service', () => {
    const composePfad = path.resolve(process.cwd(), 'docker-compose.yml');
    const inhalt = fs.readFileSync(composePfad, 'utf-8');

    // Der web-Service darf keine CMS/admin-spezifischen Pfade exponieren
    // (Kein separater CMS-Service in Prod)
    expect(inhalt).not.toContain('cms:');
    expect(inhalt).not.toContain('strapi');
    expect(inhalt).not.toContain('contentful');
  });
});
