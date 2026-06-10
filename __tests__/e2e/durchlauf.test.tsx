import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { LandingPage } from '@/pages/LandingPage';

/**
 * E2E — Durchlauf des Bestands-Checks je Segment (§10) auf der LandingPage.
 * Neue 5-Rollen-Zustandsmaschine: Rolle → Größe → Problem → SolutionResult inline.
 */
describe('E2E — BestandsCheck-Durchlauf je Segment (§10)', () => {
  it('Buy & Hold mit hohem Bucket (≥ Schwelle) → HighIntent: kompakter Termin-CTA + System-Satz', () => {
    render(<LandingPage />);
    const hero = screen.getByTestId('hero-check');
    fireEvent.click(within(hero).getByTestId('role-buyAndHold'));
    fireEvent.click(within(hero).getByTestId('size-3')); // 50–99, rank 3 ≥ Schwelle 3
    fireEvent.click(within(hero).getByTestId('problem-mieten-indexmieten-pruefen'));

    expect(within(hero).getByTestId('solution-result')).toBeInTheDocument();
    expect(within(hero).getByTestId('highintent-cta')).toBeInTheDocument();
    expect(within(hero).getByTestId('system-satz')).toBeInTheDocument();
  });

  it('Buy & Hold mit niedrigem Bucket (< Schwelle) → Motor A: kein HighIntent-CTA, Fallback-Zeile', () => {
    render(<LandingPage />);
    const hero = screen.getByTestId('hero-check');
    fireEvent.click(within(hero).getByTestId('role-buyAndHold'));
    fireEvent.click(within(hero).getByTestId('size-0')); // 1–10, rank 0
    fireEvent.click(within(hero).getByTestId('problem-mieten-indexmieten-pruefen'));

    expect(within(hero).queryByTestId('highintent-cta')).toBeNull();
    expect(within(hero).getByTestId('fallback-zeile')).toBeInTheDocument();
  });

  it('Steuerberater ist größenunabhängig → nie HighIntent über die Größe', () => {
    render(<LandingPage />);
    const hero = screen.getByTestId('hero-check');
    fireEvent.click(within(hero).getByTestId('role-steuerberater'));
    fireEvent.click(within(hero).getByTestId('size-4')); // hoher Bucket
    // Keine P1-Probleme für Steuerberater im Seed → keine-probleme-Hinweis, kein HighIntent-CTA
    expect(within(hero).queryByTestId('highintent-cta')).toBeNull();
  });
});
