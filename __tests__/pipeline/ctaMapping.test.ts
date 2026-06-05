import { describe, it, expect } from 'vitest';
import { mappeCtaZuPipeline } from '@/pipeline/ctaMapping';

describe('CTA → Pipeline-Mapping (§18 BRD §8)', () => {
  it('mappt den Stufe-3-CTA "Bestand gemeinsam ansehen" auf S2 Diagnose', () => {
    expect(mappeCtaZuPipeline('stufe3-termin')).toBe('S2-Diagnose');
  });

  it('mappt PrivacyFlow (Stufe 2) auf den S3 Beweis-Moment', () => {
    expect(mappeCtaZuPipeline('stufe2-privacyflow')).toBe('S3-Beweis');
  });

  it('verortet Playbook (Stufe 1) außerhalb der Mandats-Pipeline', () => {
    expect(mappeCtaZuPipeline('stufe1-playbook')).toBe('ausserhalb');
  });

  it('führt Multiplikatoren zum Partnerprogramm', () => {
    expect(mappeCtaZuPipeline('multiplikator')).toBe('partnerprogramm');
  });
});
