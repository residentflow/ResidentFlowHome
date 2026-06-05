/**
 * Pipeline-Mapping der CTAs (§18, BRD §8). Verbindet die sichtbaren Treppen-CTAs mit der
 * internen Vertriebs-Pipeline — ohne dass diese Begriffe auf der Seite erscheinen.
 */
export type CtaQuelle =
  | 'stufe3-termin'
  | 'stufe2-privacyflow'
  | 'stufe1-playbook'
  | 'multiplikator';
export type PipelineStufe = 'S2-Diagnose' | 'S3-Beweis' | 'ausserhalb' | 'partnerprogramm';

const MAPPING: Record<CtaQuelle, PipelineStufe> = {
  'stufe3-termin': 'S2-Diagnose', // „Ihren Bestand gemeinsam ansehen" → Diagnose
  'stufe2-privacyflow': 'S3-Beweis', // ResidentPrivacyFlow-Download → Beweis-Moment
  'stufe1-playbook': 'ausserhalb', // Playbook → außerhalb der Mandats-Pipeline
  multiplikator: 'partnerprogramm', // Steuerberater/Makler → Partnerprogramm
};

export function mappeCtaZuPipeline(quelle: CtaQuelle): PipelineStufe {
  return MAPPING[quelle];
}
