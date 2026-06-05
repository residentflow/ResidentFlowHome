import { describe, it, expect } from 'vitest';
import { OptInPayloadSchema } from '@/services/optin-payload';

describe('OptInPayloadSchema (§11)', () => {
  it('validiert eine vollständige Payload', () => {
    const result = OptInPayloadSchema.safeParse({
      email: 'max@muster.de',
      consentPdf: true,
      consentAbo: false,
      rolle: 'buyAndHold',
      relevanteEinheiten: 60,
      ergebnisSpanne: { min: 10000, max: 30000 },
    });
    expect(result.success).toBe(true);
  });

  it('lehnt eine Payload ohne consentPdf ab', () => {
    const result = OptInPayloadSchema.safeParse({
      email: 'max@muster.de',
      consentPdf: false,
      consentAbo: false,
      rolle: 'buyAndHold',
      relevanteEinheiten: 60,
      ergebnisSpanne: { min: 10000, max: 30000 },
    });
    expect(result.success).toBe(false);
  });

  it('enthält nur Rolle/Einheiten/Spanne — keine Bestandsinhalte', () => {
    // Die Schema-Felder dürfen keine Bestandsdetails (Objekt-Adressen, Mieterlisten etc.) aufnehmen
    const result = OptInPayloadSchema.safeParse({
      email: 'max@muster.de',
      consentPdf: true,
      consentAbo: false,
      rolle: 'buyAndHold',
      relevanteEinheiten: 60,
      ergebnisSpanne: { min: 10000, max: 30000 },
      // Bestandsinhalte — müssen ignoriert/abgelehnt werden
      mieterliste: ['Mieter A', 'Mieter B'],
      objektAdresse: 'Musterstr. 1',
    });
    // Entweder erfolgreich (strip) oder fehlschlagend — aber KEINE Bestandsfelder im Ergebnis
    if (result.success) {
      expect(result.data).not.toHaveProperty('mieterliste');
      expect(result.data).not.toHaveProperty('objektAdresse');
    }
    // Nur erlaubte Felder: email, consentPdf, consentAbo, rolle, relevanteEinheiten, ergebnisSpanne
    if (result.success) {
      const keys = Object.keys(result.data);
      expect(keys).toEqual(
        expect.arrayContaining(['email', 'consentPdf', 'consentAbo', 'rolle', 'relevanteEinheiten', 'ergebnisSpanne']),
      );
      expect(keys.length).toBe(6);
    }
  });
});
