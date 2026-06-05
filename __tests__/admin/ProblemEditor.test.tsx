import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProblemEditor } from '@/components/admin/ProblemEditor';
import { schatzsucheConfig } from '@/content/schatzsuche.config';
import type { Config } from '@/domain/schema/config';

describe('ProblemEditor', () => {
  it('legt ein Problem an und bearbeitet es', () => {
    let aktuelleConfig: Config = { ...schatzsucheConfig };
    const onAendern = (neu: Config) => {
      aktuelleConfig = neu;
    };

    const { rerender } = render(
      <ProblemEditor config={aktuelleConfig} onAendern={onAendern} />,
    );

    // Neues Problem anlegen
    const neuButton = screen.getByRole('button', { name: /neu|hinzufügen|anlegen/i });
    fireEvent.click(neuButton);

    rerender(<ProblemEditor config={aktuelleConfig} onAendern={onAendern} />);

    // Textfeld für Problem-Text finden und befüllen
    const textFelder = screen.getAllByRole('textbox');
    // Wir suchen ein leeres Textfeld (das neue Problem)
    const neuesTextFeld = textFelder.find(
      (el) => (el as HTMLInputElement).value === '' || (el as HTMLInputElement).placeholder,
    );
    expect(neuesTextFeld).toBeTruthy();
  });

  it('deaktiviert ein Problem ohne es zu löschen (aktiv=false, bleibt in der Liste)', () => {
    let aktuelleConfig: Config = { ...schatzsucheConfig };
    const onAendern = (neu: Config) => {
      aktuelleConfig = neu;
    };

    render(<ProblemEditor config={aktuelleConfig} onAendern={onAendern} />);

    // Alle Probleme sind zunächst sichtbar in der Liste
    const anfangsAnzahl = aktuelleConfig.probleme.length;
    expect(anfangsAnzahl).toBeGreaterThan(0);

    // Deaktivieren-Button des ersten Problems
    const deaktivierenButtons = screen.getAllByRole('button', { name: /deaktivieren|aktiv/i });
    expect(deaktivierenButtons.length).toBeGreaterThan(0);

    fireEvent.click(deaktivierenButtons[0]);

    // Das Problem muss noch in der Config sein (nicht gelöscht)
    expect(aktuelleConfig.probleme.length).toBe(anfangsAnzahl);

    // Das erste deaktivierte Problem hat aktiv=false
    const deaktiviertes = aktuelleConfig.probleme.find((p) => !p.aktiv);
    expect(deaktiviertes).toBeTruthy();
    expect(deaktiviertes!.aktiv).toBe(false);
  });
});
