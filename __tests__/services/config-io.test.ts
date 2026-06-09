import { describe, it, expect } from 'vitest';
import { exportConfig, importConfig, validiereConfig } from '@/services/config-io';
import { schatzsucheConfig } from '@/content/schatzsuche.config';
import type { Config } from '@/domain/schema/config';

describe('config-io', () => {
  it('exportiert und reimportiert die Config verlustfrei (Roundtrip)', () => {
    const json = exportConfig(schatzsucheConfig);
    expect(typeof json).toBe('string');

    const reimportiert = importConfig(json);
    expect(reimportiert).toEqual(schatzsucheConfig);
  });

  it('lehnt eine ungültige Config beim Import ab', () => {
    const ungueltig = JSON.stringify({ foo: 'bar' });
    expect(() => importConfig(ungueltig)).toThrow();
  });

  it('speichert keine Besucherdaten (nur Konfiguration)', () => {
    const json = exportConfig(schatzsucheConfig);
    const parsed: unknown = JSON.parse(json);

    // Die exportierte Config darf keine Besucher-typischen Felder enthalten
    expect(parsed).not.toHaveProperty('email');
    expect(parsed).not.toHaveProperty('sessionId');
    expect(parsed).not.toHaveProperty('ip');
    expect(parsed).not.toHaveProperty('besuchsDaten');
    expect(parsed).not.toHaveProperty('tracking');

    // Muss die erwarteten Konfigurations-Schlüssel enthalten
    expect(parsed).toHaveProperty('schmerzBereiche');
    expect(parsed).toHaveProperty('probleme');
    expect(parsed).toHaveProperty('hebel');
    expect(parsed).toHaveProperty('segmente');
    expect(parsed).toHaveProperty('globalConfig');
  });

  it('validiereConfig gibt Erfolg bei gültiger Config zurück', () => {
    const ergebnis = validiereConfig(schatzsucheConfig);
    expect(ergebnis.success).toBe(true);
  });

  it('validiereConfig gibt Fehler bei ungültiger Config zurück', () => {
    const ungueltig = { schmerzBereiche: 'falsch' } as unknown as Config;
    const ergebnis = validiereConfig(ungueltig);
    expect(ergebnis.success).toBe(false);
  });
});
