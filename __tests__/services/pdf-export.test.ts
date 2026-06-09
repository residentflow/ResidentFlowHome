import { describe, it, expect } from 'vitest';
import { erzeugePotenzialPdf } from '@/services/pdf-export';
import { PDF_RAHMUNG } from '@/content/texte';

const BEISPIEL_DATEN = {
  rolle: 'buyAndHold' as const,
  relevanteEinheiten: 60,
  ergebnisSpanne: { min: 10000, max: 30000 },
};

describe('pdf-export (§10.3)', () => {
  it('rahmt das PDF als Indikatives Potenzialprofil auf Basis Ihrer Angaben', async () => {
    const pdfBytes = await erzeugePotenzialPdf(BEISPIEL_DATEN);
    // Das PDF soll die Rahmung als Text enthalten
    // Wir dekodieren den PDF-Bytestrom als String und suchen nach der Rahmung
    const pdfString = new TextDecoder('latin1').decode(pdfBytes);
    expect(pdfString).toContain(PDF_RAHMUNG);
  });

  it('stellt Werte als Spannen dar (kein Punktwert)', async () => {
    const pdfBytes = await erzeugePotenzialPdf(BEISPIEL_DATEN);
    const pdfString = new TextDecoder('latin1').decode(pdfBytes);
    // Beide Grenzwerte der Spanne müssen im PDF vorkommen
    expect(pdfString).toContain('10.000');
    expect(pdfString).toContain('30.000');
    // Kein isolierter Punktwert (z.B. exakt "20000" als Mittelwert)
    expect(pdfString).not.toMatch(/\b20000\b/);
  });

  it('erzeugt ein nicht-leeres PDF (Uint8Array)', async () => {
    const pdfBytes = await erzeugePotenzialPdf(BEISPIEL_DATEN);
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(100);
  });
});
