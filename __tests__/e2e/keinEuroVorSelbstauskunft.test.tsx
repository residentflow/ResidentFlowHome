import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LandingPage } from '@/pages/LandingPage';

/** Sucht nach einer Euro-Betrags-Angabe (Zahl gefolgt von €). */
function enthaeltEuroBetrag(text: string): boolean {
  return /\d[\d.\s]*€/.test(text);
}

/**
 * Textinhalt nur der interaktiven Such-/Ergebnis-Abschnitte (6+7). Der statische
 * Problem-Abschnitt (§9 #3) zeigt bewusst eine editoriale Merk-Zahl und ist hier ausgenommen —
 * die §7-Regel betrifft die berechneten Potenziale der Suche, nicht die illustrative Merk-Zahl.
 */
function suchUndErgebnisText(): string {
  const ids = ['abschnitt-6-schatzsuche', 'abschnitt-7-ergebnis'];
  return ids
    .map((id) => document.querySelector(`[data-testid="${id}"]`)?.textContent ?? '')
    .join(' ');
}

describe('E2E — keine Euro-Zahl vor Selbstauskunft (§7/§17)', () => {
  it('zeigt bis einschließlich Problemauswahl keine Euro-Spanne — erst nach Detailangabe', async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    // Tätigkeit A
    await user.click(await screen.findByRole('checkbox', { name: /Eigener Bestand/i }));
    await user.click(screen.getByRole('button', { name: /Weiter/i }));
    // Größe
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '60');
    await user.click(screen.getByRole('button', { name: /Weiter/i }));
    // Probleme: Ertrag & Rendite → Mietpotenzial (quantifizierbar)
    await user.click(screen.getByText(/Ertrag & Rendite/));
    await user.click(screen.getAllByRole('checkbox')[0]!);
    await user.click(screen.getByRole('button', { name: /Weiter/i }));

    // Detail-Schritt erreicht, ABER noch keine Selbstauskunft → keine Euro-Zahl im Such-/Ergebnisbereich
    await screen.findByTestId('abschnitt-7-ergebnis');
    expect(enthaeltEuroBetrag(suchUndErgebnisText())).toBe(false);

    // Selbstauskunft eingeben → jetzt darf eine Euro-Spanne erscheinen
    const detailInput = screen.getByRole('spinbutton');
    await user.clear(detailInput);
    await user.type(detailInput, '20');

    expect(enthaeltEuroBetrag(suchUndErgebnisText())).toBe(true);
  });
});
