import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { LandingPage } from '@/pages/LandingPage';

/** Sucht nach einer Euro-Betrags-Angabe (Zahl gefolgt von €). */
function enthaeltEuroBetrag(text: string): boolean {
  return /\d[\d.\s]*€/.test(text);
}

/**
 * §3.3/§11.2: keine €-Spanne OHNE Selbstauskunft. Erst nachdem Rolle UND Größe gewählt
 * sind (Selbstauskunft), darf die quantifizierte €-Spanne erscheinen — vorher nie.
 */
describe('E2E — keine €-Zahl vor Selbstauskunft (§3.3/§11.2)', () => {
  it('S0/S1: vor abgeschlossener Größenwahl keine €-Spanne; nach Rolle+Größe+Problem erscheint sie', () => {
    render(<LandingPage />);
    const hero = screen.getByTestId('hero-check');

    // S0: nur Rollen-Frage → keine €
    expect(enthaeltEuroBetrag(hero.textContent ?? '')).toBe(false);

    // Rolle gewählt, Größe noch offen → weiterhin keine €
    fireEvent.click(within(hero).getByTestId('role-buyAndHold'));
    expect(enthaeltEuroBetrag(hero.textContent ?? '')).toBe(false);

    // Größe + Problem gewählt (Selbstauskunft vollständig) → quantifizierte €-Spanne erlaubt
    fireEvent.click(within(hero).getByTestId('size-3'));
    fireEvent.click(within(hero).getByTestId('problem-mieten-indexmieten-pruefen'));
    expect(within(hero).getByTestId('euro-spanne')).toBeInTheDocument();
    expect(enthaeltEuroBetrag(within(hero).getByTestId('euro-spanne').textContent ?? '')).toBe(
      true,
    );
  });
});
