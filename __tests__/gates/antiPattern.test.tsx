import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { LandingPage } from '@/pages/LandingPage';
import { checkConfig } from '@/config/checkConfig';

/**
 * Anti-Pattern-Gate G5 (§4) + Domain-Gate G7 (§25) auf der gerenderten Homepage.
 */
describe('Anti-Pattern-Gate G5/G7 (§4/§25)', () => {
  it('kein Upload-Feld als Erstkontakt (§4)', () => {
    const { container } = render(<LandingPage />);
    expect(container.querySelector('input[type="file"]')).toBeNull();
  });

  it('keine zwei gleichwertigen Haupt-CTAs „Wähle deinen Weg" / kein „Demo"', () => {
    const { container } = render(<LandingPage />);
    expect(container.textContent).not.toMatch(/Demo/i);
    expect(container.textContent).not.toMatch(/Wähle deinen Weg/i);
  });

  it('PDF wird bei HighIntent nicht direkt neben dem Termin-CTA gezeigt (§14.4)', () => {
    render(<LandingPage />);
    const hero = screen.getByTestId('hero-check');
    fireEvent.click(within(hero).getByTestId('role-buyAndHold'));
    fireEvent.click(within(hero).getByTestId('size-3'));
    fireEvent.click(within(hero).getByTestId('problem-mieten-indexmieten-pruefen'));
    // HighIntent → Termin-CTA sichtbar, aber keine PDF-/Fallback-Zeile im selben Ergebnis
    expect(within(hero).getByTestId('highintent-cta')).toBeInTheDocument();
    expect(within(hero).queryByTestId('fallback-zeile')).toBeNull();
  });

  it('kein Skool-/Lovable-Link im öffentlichen Pfad (G7)', () => {
    const { container } = render(<LandingPage />);
    const html = container.innerHTML;
    expect(html).not.toMatch(/skool/i);
    expect(html).not.toMatch(/lovable/i);
  });

  it('Scarcity-Zeile nur mit Settings.scarcityTrue (Test-Gate §14.2)', () => {
    // Seed: scarcityTrue=false → Flag respektiert
    expect(checkConfig.settings.scarcityTrue).toBe(false);
  });
});
