/**
 * Zentrale Copy-Konstanten — eine einzige Quelle für lasttragende deutsche Strings (§9/§10/§17).
 * Tests prüfen gegen diese Konstanten, Komponenten importieren sie → exakte Texte driften nie.
 *
 * ACHTUNG Rote Linien (§17): verbotene Begriffe dürfen weder hier noch im gesamten src/ vorkommen.
 * Der Produktname ist ausschließlich in der Stufe-3-Komponente erlaubt.
 */

// — Hero (§9 #1) —
export const HERO_TOPLINE = 'Bestand optimieren · Rendite steigern · Verwaltungsaufwand reduzieren';
export const HERO_SUBLINE =
  'Finden Sie heraus, wo in Ihrem Bestand Ertrag liegen bleibt — und sorgen Sie dafür, dass es nicht liegen bleibt.';
export const HERO_VERSPRECHEN =
  'In wenigen Minuten sehen Sie Ihr eigenes Potenzial — bevor Sie irgendetwas geben.';

// — Brücke (§9 #5) —
export const CTA_ANALYSE = 'Bestand analysieren';
export const CTA_ANALYSE_SUBTEXT = '3 Minuten · keine Datenübertragung · keine Registrierung';
export const ENTLASTUNGEN = ['Keine Registrierung.', 'Keine Dokumente.', 'Keine E-Mail.'] as const;

// — Erkenntnis-Liste (§8.2) —
export const ERKENNTNIS_HEADER = 'Bereits identifizierte Lösungen:';
export const FUND_LABEL = 'Lösung'; // (§17: nur dieses Label, nie ein anderes)

// — Treppe & Ergebnis (§10) —
export const TERMINLINK_TEXT = 'Ihren Bestand gemeinsam ansehen';
export const PLAYBOOK_CTA = 'Playbook ansehen';
export const PDF_RAHMUNG = 'Indikatives Potenzialprofil auf Basis Ihrer Angaben';

// — Datenschutz-Beweis (§9 #8) —
export const DATENSCHUTZ_SIGNALE = 'lokal · EU/self-hosted · Daten bleiben bei Ihnen';

// — Founder (§9 #9 / §12) —
export const FOUNDER_SCHLUSSSATZ = '…deshalb verstehe ich Ihr Problem von innen.';

// Hinweis: Die verbotenen Begriffe (§17) sind bewusst NICHT als Literale in src/ hinterlegt,
// damit das repo-weite Sprach-Gate (M6, __tests__/sprachgates) nicht sich selbst auslöst.
// Die Liste lebt ausschließlich im Test unter __tests__/.
