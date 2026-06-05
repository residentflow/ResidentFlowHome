import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OptInFormular } from '@/components/treppe/OptInFormular';
import type { Rolle } from '@/domain/enums';
import type { Spanne } from '@/domain/schema/spanne';

const DEFAULT_PROPS = {
  rolle: 'buyAndHold' as Rolle,
  relevanteEinheiten: 60,
  ergebnisSpanne: { min: 10000, max: 30000 } as Spanne,
  onSubmit: vi.fn(),
};

describe('OptInFormular M5 (§10.4/§11)', () => {
  it('das Abo-Häkchen ist nicht vorausgewählt', () => {
    render(<OptInFormular {...DEFAULT_PROPS} />);
    const aboCheckbox = screen.getByRole('checkbox', { name: /monatlich/i });
    expect(aboCheckbox).not.toBeChecked();
  });

  it('die Einwilligung für PDF/Verarbeitung ist Pflicht (Submit ohne consent blockiert)', async () => {
    const onSubmit = vi.fn();
    render(<OptInFormular {...DEFAULT_PROPS} onSubmit={onSubmit} />);

    // E-Mail eintragen, aber NICHT consentPdf anklicken
    const emailInput = screen.getByRole('textbox', { name: /e-mail/i });
    await userEvent.type(emailInput, 'test@beispiel.de');

    const submitButton = screen.getByRole('button', { name: /potenzialprofil/i });
    await userEvent.click(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('zeigt die Fallback-Staffel: PDF → Abo → auf die Ergebnis-Mail antworten', () => {
    render(<OptInFormular {...DEFAULT_PROPS} />);

    // ① Ergebnis-PDF
    expect(screen.getByText(/Potenzialprofil.*PDF/i)).toBeInTheDocument();
    // ② monatliches Abo
    expect(screen.getByText(/monatlich/i)).toBeInTheDocument();
    // ③ auf die Ergebnis-Mail antworten
    expect(screen.getByText(/Ergebnis-Mail antworten/i)).toBeInTheDocument();
  });

  it('fragt die E-Mail erst nach dem Ergebnis ab (kein Gate)', () => {
    render(<OptInFormular {...DEFAULT_PROPS} />);
    // Das Formular muss direkt sichtbar sein (kein vorangeschaltetes Gate)
    expect(screen.getByRole('textbox', { name: /e-mail/i })).toBeInTheDocument();
    // Keine Aufforderung die Suche erst zu starten
    expect(screen.queryByText(/zuerst.*Analyse/i)).not.toBeInTheDocument();
  });

  it('Submit funktioniert bei ausgefüllter E-Mail + consentPdf', async () => {
    const onSubmit = vi.fn();
    render(<OptInFormular {...DEFAULT_PROPS} onSubmit={onSubmit} />);

    const emailInput = screen.getByRole('textbox', { name: /e-mail/i });
    await userEvent.type(emailInput, 'max@muster.de');

    const consentPdfCheckbox = screen.getByRole('checkbox', { name: /Verarbeitung/i });
    await userEvent.click(consentPdfCheckbox);

    const submitButton = screen.getByRole('button', { name: /potenzialprofil/i });
    await userEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'max@muster.de',
        consentPdf: true,
        consentAbo: false,
      }),
    );
  });

  it('zeigt nach dem Absenden eine Bestätigung mit der E-Mail-Adresse', async () => {
    render(<OptInFormular {...DEFAULT_PROPS} onSubmit={vi.fn()} />);

    await userEvent.type(screen.getByRole('textbox', { name: /e-mail/i }), 'max@muster.de');
    await userEvent.click(screen.getByRole('checkbox', { name: /Verarbeitung/i }));
    await userEvent.click(screen.getByRole('button', { name: /potenzialprofil/i }));

    const bestaetigung = await screen.findByTestId('optin-bestaetigung');
    expect(bestaetigung).toHaveTextContent(/Vielen Dank/i);
    expect(bestaetigung).toHaveTextContent('max@muster.de');
    // Formular ist nach dem Absenden nicht mehr sichtbar
    expect(screen.queryByRole('textbox', { name: /e-mail/i })).not.toBeInTheDocument();
  });
});
