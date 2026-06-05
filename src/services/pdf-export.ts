import { PDFDocument, StandardFonts, PDFName, PDFArray } from 'pdf-lib';
import { PDF_RAHMUNG } from '@/content/texte';
import type { Rolle } from '@/domain/enums';
import type { Spanne } from '@/domain/schema/spanne';

interface PotenzialDaten {
  rolle: Rolle;
  relevanteEinheiten: number;
  ergebnisSpanne: Spanne;
}

/** Formatiert eine Zahl mit Tausender-Punkt (deutsches Format, z.B. 10.000). */
function formatiereBetrag(wert: number): string {
  return wert.toLocaleString('de-DE');
}

/** Escapes einen String für PDF-String-Syntax (einfache Klammern). */
function escapePdfString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/**
 * Erzeugt das Potenzialprofil-PDF als Uint8Array via pdf-lib (§10.3).
 * Rahmt das Ergebnis ehrlich als "Indikatives Potenzialprofil auf Basis Ihrer Angaben".
 * Stellt Werte immer als Spannen dar — keine Punktwerte.
 *
 * Der Content-Stream wird unkomprimiert gespeichert, damit der Text im Bytestrom
 * mit einem latin1-Decoder direkt lesbar ist (für Test-Verifizierung).
 */
export async function erzeugePotenzialPdf(daten: PotenzialDaten): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { height } = page.getSize();
  const margin = 60;

  // Spanne formatieren
  const minText = formatiereBetrag(daten.ergebnisSpanne.min);
  const maxText = formatiereBetrag(daten.ergebnisSpanne.max);
  const spannenText = `Identifiziertes Potenzial: ${minText} - ${maxText} EUR p.a.`;

  // Content-Stream als unkomprimierter Raw-Stream aufbauen
  // PDF-Content-Stream-Syntax: BT (Begin Text), Tf (Font), Td (Move), Tj (Show Text), ET (End Text)
  const fontNameBold = 'HelvBold';
  const fontNameReg = 'Helv';

  const lines: string[] = [
    `BT`,
    `/${fontNameBold} 14 Tf`,
    `${margin} ${height - 80} Td`,
    `(${escapePdfString(PDF_RAHMUNG)}) Tj`,
    `ET`,
    `BT`,
    `/${fontNameReg} 11 Tf`,
    `${margin} ${height - 140} Td`,
    `(Rolle: ${escapePdfString(daten.rolle)}) Tj`,
    `ET`,
    `BT`,
    `/${fontNameReg} 11 Tf`,
    `${margin} ${height - 165} Td`,
    `(Relevante Einheiten: ${daten.relevanteEinheiten}) Tj`,
    `ET`,
    `BT`,
    `/${fontNameBold} 13 Tf`,
    `${margin} ${height - 220} Td`,
    `(${escapePdfString(spannenText)}) Tj`,
    `ET`,
    `BT`,
    `/${fontNameReg} 9 Tf`,
    `${margin} ${height - 290} Td`,
    `(Indikative Uebersicht. Kein Gutachten.) Tj`,
    `ET`,
  ];

  const contentStreamStr = lines.join('\n');

  // Unkomprimierten Raw-Stream im PDF-Kontext registrieren
  // ctx.stream() akzeptiert einen String und erzeugt einen unkomprimierten PDFRawStream
  const ctx = pdfDoc.context;
  const contentStreamRef = ctx.register(
    ctx.stream(contentStreamStr, {
      Length: contentStreamStr.length,
    }),
  );

  // Fontressourcen für die Seite anlegen
  const fontBoldRef = fontBold.ref;
  const fontRegRef = font.ref;

  const resourcesDict = ctx.obj({
    Font: ctx.obj({
      [fontNameBold]: fontBoldRef,
      [fontNameReg]: fontRegRef,
    }),
  });

  // Content-Stream der Seite zuweisen (ersetzt den Standard-Content-Stream)
  const pageNode = page.node;
  pageNode.set(PDFName.of('Resources'), resourcesDict);
  const contentsArray = ctx.obj([contentStreamRef]);
  pageNode.set(PDFName.of('Contents'), contentsArray as unknown as PDFArray);

  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
  return pdfBytes;
}
