import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SolutionResult } from '@/components/solution-result/SolutionResult';
import { problemBySlug } from '@/config/checkConfig';

const problem = problemBySlug('mieten-indexmieten-pruefen')!;

describe('PDF-Fallback (§14.4)', () => {
  it('HighIntent: initial unsichtbar — nie im selben Sichtfeld wie der Termin-CTA', () => {
    render(<SolutionResult problem={problem} highIntent />);
    expect(screen.getByTestId('highintent-cta')).toBeInTheDocument();
    expect(screen.queryByTestId('fallback-zeile')).toBeNull();
  });

  it('HighIntent: erscheint nach Exit-Intent (Maus verlässt Dokument oben)', () => {
    render(<SolutionResult problem={problem} highIntent />);
    expect(screen.queryByTestId('fallback-zeile')).toBeNull();
    fireEvent.mouseOut(document.body, { clientY: 0, relatedTarget: null });
    expect(screen.getByTestId('fallback-zeile')).toBeInTheDocument();
  });

  it('Motor A (kein HighIntent): sofort sichtbarer Sekundär-CTA', () => {
    render(<SolutionResult problem={problem} highIntent={false} />);
    expect(screen.getByTestId('fallback-zeile')).toBeInTheDocument();
  });
});
