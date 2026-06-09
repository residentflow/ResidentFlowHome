import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { LandingPage } from '@/pages/LandingPage';

/** Sucht nach einer Euro-Betrags-Angabe (Zahl gefolgt von €). */
function enthaeltEuroBetrag(text: string): boolean {
  return /\d[\d.\s]*€/.test(text);
}

/**
 * §3.3/§11.2: keine €-Spanne ohne Selbstauskunft — und in L1 (Platzhalter-Benchmarks)
 * erscheint im Check/Ergebnis überhaupt keine €-Zahl, der Relevanzblock bleibt qualitativ.
 * Dieser Test schützt beide Eigenschaften end-to-end.
 */
describe('E2E — keine Euro-Zahl im Check/Ergebnis ohne quantifizierte Benchmarks (§3.3/§11.2)', () => {
  it('zeigt über den gesamten Durchlauf keine €-Spanne im HeroCheck (L1 qualitativ)', () => {
    render(<LandingPage />);
    const hero = screen.getByTestId('hero-check');

    // S0 → S1: noch keine € (nur Rollen-/Größenwahl)
    fireEvent.click(within(hero).getByTestId('role-buyAndHold'));
    expect(enthaeltEuroBetrag(hero.textContent ?? '')).toBe(false);

    fireEvent.click(within(hero).getByTestId('size-3'));
    expect(enthaeltEuroBetrag(hero.textContent ?? '')).toBe(false);

    // S2 → S3: SolutionResult sichtbar, aber Relevanzblock qualitativ → weiterhin keine €
    fireEvent.click(within(hero).getByTestId('problem-mieten-indexmieten-pruefen'));
    expect(within(hero).getByTestId('solution-result')).toBeInTheDocument();
    expect(enthaeltEuroBetrag(hero.textContent ?? '')).toBe(false);
  });
});
