import { describe, it, expect, vi, beforeEach } from 'vitest';

// Brevo-Adapter mocken — kein echter Netzwerkaufruf
const mockSendeOptIn = vi.fn().mockResolvedValue(undefined);
vi.mock('@/services/brevo-client', () => ({
  sendeOptIn: mockSendeOptIn,
}));

// pdf-export mocken
const mockErzeugePotenzialPdf = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]));
vi.mock('@/services/pdf-export', () => ({
  erzeugePotenzialPdf: mockErzeugePotenzialPdf,
}));

import { buildServer } from '../../api/server';

const GUELTIGE_PAYLOAD = {
  email: 'max@muster.de',
  consentPdf: true,
  consentAbo: false,
  rolle: 'buyAndHold',
  relevanteEinheiten: 60,
  ergebnisSpanne: { min: 10000, max: 30000 },
};

describe('POST /api/optin (API, Brevo gemockt)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/optin sendet das PDF transaktional', async () => {
    const app = await buildServer();
    const response = await app.inject({
      method: 'POST',
      url: '/api/optin',
      payload: GUELTIGE_PAYLOAD,
    });
    expect(response.statusCode).toBe(200);
    expect(mockErzeugePotenzialPdf).toHaveBeenCalledOnce();
    expect(mockSendeOptIn).toHaveBeenCalledOnce();
    // Prüfe dass die PDF-Bytes übergeben wurden
    const sendeArgs = mockSendeOptIn.mock.calls[0] as [unknown, Uint8Array];
    expect(sendeArgs[1]).toBeInstanceOf(Uint8Array);
  });

  it('speichert die Attribute ROLLE und EINHEITEN', async () => {
    const app = await buildServer();
    const response = await app.inject({
      method: 'POST',
      url: '/api/optin',
      payload: GUELTIGE_PAYLOAD,
    });
    expect(response.statusCode).toBe(200);
    // Der Brevo-Client wird mit dem vollständigen Payload aufgerufen (enthält rolle + relevanteEinheiten)
    const sendeArgs = mockSendeOptIn.mock.calls[0] as [Record<string, unknown>, unknown];
    expect(sendeArgs[0]).toMatchObject({
      rolle: 'buyAndHold',
      relevanteEinheiten: 60,
    });
  });

  it('fügt nur bei consentAbo zur Liste hinzu + Double-Opt-in', async () => {
    const app = await buildServer();

    // Ohne consentAbo
    await app.inject({
      method: 'POST',
      url: '/api/optin',
      payload: { ...GUELTIGE_PAYLOAD, consentAbo: false },
    });
    const argOhneAbo = mockSendeOptIn.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(argOhneAbo).toMatchObject({ consentAbo: false });

    vi.clearAllMocks();

    // Mit consentAbo
    await app.inject({
      method: 'POST',
      url: '/api/optin',
      payload: { ...GUELTIGE_PAYLOAD, consentAbo: true },
    });
    const argMitAbo = mockSendeOptIn.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(argMitAbo).toMatchObject({ consentAbo: true });
  });

  it('lehnt eine Payload ohne consentPdf mit 400 ab', async () => {
    const app = await buildServer();
    const response = await app.inject({
      method: 'POST',
      url: '/api/optin',
      payload: { ...GUELTIGE_PAYLOAD, consentPdf: false },
    });
    expect(response.statusCode).toBe(400);
    expect(mockSendeOptIn).not.toHaveBeenCalled();
  });

  it('speichert keine Bestandsinhalte', async () => {
    const app = await buildServer();
    const payloadMitBestandsinhalt = {
      ...GUELTIGE_PAYLOAD,
      mieterliste: ['Mieter A'],
      objektAdresse: 'Musterstr. 1',
    };
    const response = await app.inject({
      method: 'POST',
      url: '/api/optin',
      payload: payloadMitBestandsinhalt,
    });
    // Antwort muss 200 sein (Strip der extra Felder)
    expect(response.statusCode).toBe(200);
    // Der Brevo-Aufruf enthält keine Bestandsfelder
    const sendeArgs = mockSendeOptIn.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(sendeArgs).not.toHaveProperty('mieterliste');
    expect(sendeArgs).not.toHaveProperty('objektAdresse');
  });
});
