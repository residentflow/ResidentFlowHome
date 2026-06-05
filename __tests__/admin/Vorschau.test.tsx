import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Vorschau } from '@/components/admin/Vorschau';
import { schatzsucheConfig } from '@/content/schatzsuche.config';

describe('Vorschau', () => {
  it('zeigt die Suche für gewählte Rolle + Größe + Problem', () => {
    render(<Vorschau config={schatzsucheConfig} />);

    // Rollen-Auswahl muss vorhanden sein
    const rollenAuswahl =
      screen.queryByLabelText(/rolle/i) ?? screen.queryByTestId('rolle-select');
    expect(rollenAuswahl).toBeTruthy();

    // Größen-Eingabe muss vorhanden sein
    const groeßeEingabe =
      screen.queryByLabelText(/einheiten|größe|anzahl/i) ??
      screen.queryByTestId('groesse-input');
    expect(groeßeEingabe).toBeTruthy();

    // Eine Rolle auswählen (buyAndHold)
    if (rollenAuswahl) {
      fireEvent.change(rollenAuswahl, { target: { value: 'buyAndHold' } });
    }

    // Größe setzen (z.B. 60 Einheiten → volle Treppe)
    if (groeßeEingabe) {
      fireEvent.change(groeßeEingabe, { target: { value: '60' } });
    }

    // Nach Auswahl von Rolle+Größe muss ein Routing-Ergebnis-Abschnitt vorhanden sein
    const routingErgebnis = screen.queryByRole('heading', { name: /routing/i });
    expect(routingErgebnis).toBeTruthy();

    // Mindestens ein Passende-Probleme-Abschnitt muss erscheinen
    const problemeAbschnitt = screen.queryByRole('heading', { name: /passende probleme/i });
    expect(problemeAbschnitt).toBeTruthy();
  });
});
