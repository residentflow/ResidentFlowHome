import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { PDF_RAHMUNG } from '@/content/texte';
import type { Rolle } from '@/domain/enums';
import type { Spanne } from '@/domain/schema/spanne';

interface PotenzialDaten {
  rolle: Rolle;
  relevanteEinheiten: number;
  ergebnisSpanne: Spanne;
}

/** Formatiert eine Zahl mit Tausender-Punkt (deutsches Format). */
function formatiereBetrag(wert: number): string {
  return wert.toLocaleString('de-DE');
}

/**
 * Erzeugt das Potenzialprofil-PDF als Uint8Array via pdf-lib (§10.3).
 * Rahmt das Ergebnis ehrlich als "Indikatives Potenzialprofil auf Basis Ihrer Angaben".
 * Stellt Werte immer als Spannen dar — keine Punktwerte.
 */
export async function erzeugePotenzialPdf(daten: PotenzialDaten): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  const margin = 60;
  const textWidth = width - 2 * margin;

  // Rahmung (§10.3)
  page.drawText(PDF_RAHMUNG, {
    x: margin,
    y: height - 80,
    size: 14,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
    maxWidth: textWidth,
  });

  // Trennlinie
  page.drawLine({
    start: { x: margin, y: height - 100 },
    end: { x: width - margin, y: height - 100 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Rolle + Einheiten
  page.drawText(`Rolle: ${daten.rolle}`, {
    x: margin,
    y: height - 140,
    size: 11,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText(`Relevante Einheiten: ${daten.relevanteEinheiten}`, {
    x: margin,
    y: height - 165,
    size: 11,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Potenzialspanne (immer als Spanne, nie als Punktwert — §7/§17)
  const spannenText = `Identifiziertes Potenzial: ${formatiereBetrag(daten.ergebnisSpanne.min)} – ${formatiereBetrag(daten.ergebnisSpanne.max)} € p.a.`;
  page.drawText(spannenText, {
    x: margin,
    y: height - 220,
    size: 13,
    font: fontBold,
    color: rgb(0.05, 0.3, 0.15),
    maxWidth: textWidth,
  });

  // Hinweis: Spanne, kein Gutachten
  const hinweis =
    'Diese Übersicht basiert auf Ihren Angaben und allgemeinen Benchmark-Faktoren. ' +
    'Sie ist indikativ und kein Gutachten.';
  page.drawText(hinweis, {
    x: margin,
    y: height - 290,
    size: 9,
    font,
    color: rgb(0.5, 0.5, 0.5),
    maxWidth: textWidth,
    lineHeight: 14,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
