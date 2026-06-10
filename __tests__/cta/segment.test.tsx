import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SegmentCTA } from '@/components/cta/SegmentCTA';
import { SolutionResult } from '@/components/solution-result/SolutionResult';
import { problemBySlug } from '@/config/checkConfig';

describe('SegmentCTA (§14.5)', () => {
  it('Partnerprogramm ohne externen Link → eigene Erklärseite /partnerprogramm', () => {
    render(<SegmentCTA endAusgang="partnerprogramm" />);
    expect(screen.getByTestId('segment-cta-link')).toHaveAttribute('href', '/partnerprogramm');
    expect(screen.getByText(/Partneransatz besprechen/)).toBeInTheDocument();
  });

  it('Vermarktungsprozess → /termin?src=makler', () => {
    render(<SegmentCTA endAusgang="vermarktungsprozess" />);
    expect(screen.getByTestId('segment-cta-link')).toHaveAttribute('href', '/termin?src=makler');
  });

  it('unbekannter Ausgang rendert nichts', () => {
    const { container } = render(<SegmentCTA endAusgang="nur-loesungen" />);
    expect(container.firstChild).toBeNull();
  });
});

describe('SolutionResult End-Ausgänge (§2.3/§14.5)', () => {
  const problem = problemBySlug('mieten-indexmieten-pruefen')!;

  it('Steuerberater (partnerprogramm): SegmentCTA, KEIN Mandats-CTA, KEIN Skalierungs-Block', () => {
    render(<SolutionResult problem={problem} highIntent={false} endAusgang="partnerprogramm" />);
    expect(screen.getByTestId('segment-cta')).toBeInTheDocument();
    expect(screen.queryByTestId('highintent-cta')).toBeNull();
    expect(screen.queryByTestId('skalierungs-block')).toBeNull();
    expect(screen.queryByTestId('fallback-zeile')).toBeNull();
  });

  it('Makler HighIntent (vermarktungsprozess): NIE Mandats-CTA, sondern SegmentCTA (§2.3)', () => {
    render(<SolutionResult problem={problem} highIntent endAusgang="vermarktungsprozess" />);
    expect(screen.queryByTestId('highintent-cta')).toBeNull();
    expect(screen.queryByTestId('skalierungs-block')).toBeNull();
    expect(screen.getByTestId('segment-cta')).toHaveAttribute(
      'data-endausgang',
      'vermarktungsprozess',
    );
  });

  it('B&H Gespräch: Mandats-CTA + Skalierungs-Block, kein SegmentCTA', () => {
    render(<SolutionResult problem={problem} highIntent endAusgang="gespraech" />);
    expect(screen.getByTestId('highintent-cta')).toBeInTheDocument();
    expect(screen.getByTestId('skalierungs-block')).toBeInTheDocument();
    expect(screen.queryByTestId('segment-cta')).toBeNull();
  });
});
