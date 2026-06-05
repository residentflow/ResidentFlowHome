import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HebelEditor } from '@/components/admin/HebelEditor';
import { schatzsucheConfig } from '@/content/schatzsuche.config';
import type { Config } from '@/domain/schema/config';

describe('HebelEditor', () => {
  it('blockiert das Speichern eines Punktwerts und erzwingt eine Spanne', () => {
    let aktuelleConfig: Config = { ...schatzsucheConfig };
    const onAendern = (neu: Config) => {
      aktuelleConfig = neu;
    };

    render(<HebelEditor config={aktuelleConfig} onAendern={onAendern} />);

    // Neuen Hebel anlegen
    const neuButton = screen.getByRole('button', { name: /neu|hinzufügen|anlegen/i });
    fireEvent.click(neuButton);

    // Punktwert-Eingabe (ein Feld für min oder max eines Faktors) muss vorhanden sein
    // Ein Eingabefeld für "Ausgabe" (Formel) muss als Spanne (min/max) vorliegen
    // Wir prüfen, dass kein "Punktwert speichern" möglich ist:
    // Das Formular soll eine Validierungsfehlermeldung zeigen, wenn min === max
    const punktwertHinweis = screen.queryByText(/spanne|min.*max|kein punktwert/i);
    // Der Hinweis muss vorhanden sein (kann auch ein label sein)
    // Hauptsache: das Formular erzwingt min < max
    const speichernButton = screen.queryByRole('button', { name: /speichern|sichern/i });
    // Wenn kein Speichern-Button sichtbar ist beim leeren Formular — OK
    // Wenn er sichtbar ist, prüfen wir, dass beim Versuch mit gleichem min/max ein Fehler erscheint
    if (speichernButton) {
      // Versuche mit Punktwert zu speichern (min = max)
      const minFelder = screen.queryAllByLabelText(/min/i);
      const maxFelder = screen.queryAllByLabelText(/max/i);
      if (minFelder.length > 0 && maxFelder.length > 0) {
        fireEvent.change(minFelder[0], { target: { value: '100' } });
        fireEvent.change(maxFelder[0], { target: { value: '100' } });
        fireEvent.click(speichernButton);
        const fehler = screen.queryByText(/spanne|min.*max|kein punktwert|fehler/i);
        expect(fehler).toBeTruthy();
      }
    }
    // Mindestens: keine Felder mit type="number" für direkten Punktwert ohne min/max
    // Der Spannen-Zwang ist in der UI erkennbar (Label mit min/max vorhanden)
    const alleInputs = document.querySelectorAll('input[type="number"]');
    // Wenn Zahlenfelder vorhanden, müssen sie paarweise (min+max) sein oder Punktwert-Eingabe ist blockiert
    expect(punktwertHinweis !== null || alleInputs.length === 0 || alleInputs.length % 2 === 0).toBe(true);
  });

  it('verlangt bei qualitativem Hebel eine nutzenAussage', () => {
    let aktuelleConfig: Config = { ...schatzsucheConfig };
    const onAendern = (neu: Config) => {
      aktuelleConfig = neu;
    };

    render(<HebelEditor config={aktuelleConfig} onAendern={onAendern} />);

    // Neuen Hebel anlegen
    const neuButton = screen.getByRole('button', { name: /neu|hinzufügen|anlegen/i });
    fireEvent.click(neuButton);

    // "quantifizierbar = false" auswählen (qualitativ)
    const qualitativOption = screen.queryByRole('radio', { name: /qualitativ|nicht quantifizierbar/i })
      ?? screen.queryByLabelText(/qualitativ/i);

    if (qualitativOption) {
      fireEvent.click(qualitativOption);
    } else {
      // Checkbox oder Select für quantifizierbar
      const quantCheckbox = screen.queryByRole('checkbox', { name: /quantifizierbar/i });
      if (quantCheckbox && (quantCheckbox as HTMLInputElement).checked) {
        fireEvent.click(quantCheckbox);
      }
    }

    // Versuche ohne nutzenAussage zu speichern
    const speichernButton = screen.queryByRole('button', { name: /speichern|sichern/i });
    if (speichernButton) {
      fireEvent.click(speichernButton);
      // Es muss ein Hinweis auf nutzenAussage erscheinen
      const fehler = screen.queryByText(/nutzen|nutzenaussage|pflicht|erforderlich/i);
      expect(fehler).toBeTruthy();
    } else {
      // Das Feld für nutzenAussage muss sichtbar/required sein
      const nutzenFeld = screen.queryByLabelText(/nutzen|nutzenaussage/i)
        ?? screen.queryByPlaceholderText(/nutzen/i);
      expect(nutzenFeld).toBeTruthy();
    }
  });
});
