import { describe, it, expect, vi, beforeEach } from 'vitest';

// Brevo SDK komplett mocken — KEIN echter Netzwerkaufruf
vi.mock('@/services/brevo-client', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/services/brevo-client')>();
  return mod;
});

// Mock-Adapter für den Brevo SDK-Client
const mockSendTransacEmail = vi.fn().mockResolvedValue({ messageId: 'mock-id' });
const mockCreateContact = vi.fn().mockResolvedValue({});
const mockAddContactToList = vi.fn().mockResolvedValue({});
const mockSendDoubleOptinConfirmation = vi.fn().mockResolvedValue({});

vi.mock('@getbrevo/brevo', () => ({
  TransactionalEmailsApi: vi.fn().mockImplementation(() => ({
    sendTransacEmail: mockSendTransacEmail,
  })),
  ContactsApi: vi.fn().mockImplementation(() => ({
    createContact: mockCreateContact,
    addContactToList: mockAddContactToList,
    sendDoubleOptinConfirmation: mockSendDoubleOptinConfirmation,
  })),
  ApiClient: {
    instance: {
      authentications: {
        'api-key': { apiKey: '' },
      },
    },
  },
}));

import { sendeOptIn } from '@/services/brevo-client';

const BEISPIEL_PDF = new Uint8Array([1, 2, 3, 4, 5]);
const BASIS_PAYLOAD = {
  email: 'max@muster.de',
  consentPdf: true as const,
  consentAbo: false,
  rolle: 'buyAndHold' as const,
  relevanteEinheiten: 60,
  ergebnisSpanne: { min: 10000, max: 30000 },
};

describe('brevo-client (§11, Brevo gemockt)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sendet das PDF transaktional (immer)', async () => {
    await sendeOptIn(BASIS_PAYLOAD, BEISPIEL_PDF);
    expect(mockSendTransacEmail).toHaveBeenCalledOnce();
    // PDF muss als Anhang mitgeschickt werden
    const call = mockSendTransacEmail.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(call).toHaveProperty('attachment');
  });

  it('setzt die Attribute ROLLE und EINHEITEN', async () => {
    await sendeOptIn(BASIS_PAYLOAD, BEISPIEL_PDF);
    expect(mockCreateContact).toHaveBeenCalledOnce();
    const call = mockCreateContact.mock.calls[0]?.[0] as Record<string, unknown>;
    const attributes = call['attributes'] as Record<string, unknown>;
    expect(attributes).toHaveProperty('ROLLE', 'buyAndHold');
    expect(attributes).toHaveProperty('EINHEITEN', 60);
  });

  it('fügt den Kontakt nur bei consentAbo zur Liste hinzu (Double-Opt-in)', async () => {
    const payloadMitAbo = { ...BASIS_PAYLOAD, consentAbo: true };
    await sendeOptIn(payloadMitAbo, BEISPIEL_PDF);
    // Double-Opt-in muss ausgelöst werden
    const doubleOptInCalled =
      mockSendDoubleOptinConfirmation.mock.calls.length > 0 ||
      mockAddContactToList.mock.calls.length > 0;
    expect(doubleOptInCalled).toBe(true);
  });

  it('startet ohne consentAbo keinen Double-Opt-in/kein Add-to-List', async () => {
    await sendeOptIn(BASIS_PAYLOAD, BEISPIEL_PDF);
    expect(mockAddContactToList).not.toHaveBeenCalled();
    expect(mockSendDoubleOptinConfirmation).not.toHaveBeenCalled();
  });
});
