import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BenchmarkEditor } from '@/components/admin/BenchmarkEditor';
import { schatzsucheConfig } from '@/content/schatzsuche.config';
import type { Config } from '@/domain/schema/config';

describe('BenchmarkEditor', () => {
  it('erzwingt Spannen für Benchmark-Faktoren (Punktwert wird abgelehnt)', () => {
    let aktuelleConfig: Config = JSON.parse(JSON.stringify(schatzsucheConfig));
    const onAendern = (neu: Config) => {
      aktuelleConfig = neu;
    };

    render(<BenchmarkEditor config={aktuelleConfig} onAendern={onAendern} />);

    // Der Editor muss Benchmark-Faktoren anzeigen
    // Für jeden quantifizierbaren Loesung mit Formel sind Faktoren-Felder sichtbar
    const quantifizierbar = aktuelleConfig.loesung.filter((h) => h.quantifizierbar && h.berechnung);
    expect(quantifizierbar.length).toBeGreaterThan(0);

    // Min- und Max-Felder müssen vorhanden sein (Spannen-Zwang)
    const minFelder = screen.getAllByLabelText(/min/i);
    const maxFelder = screen.getAllByLabelText(/max/i);
    expect(minFelder.length).toBeGreaterThan(0);
    expect(maxFelder.length).toBeGreaterThan(0);

    // Versuch, Punktwert einzugeben (min = max) und zu speichern
    const erstesMinFeld = minFelder[0];
    const erstesMaxFeld = maxFelder[0];

    fireEvent.change(erstesMinFeld, { target: { value: '500' } });
    fireEvent.change(erstesMaxFeld, { target: { value: '500' } });

    const speichernButton = screen.queryByRole('button', { name: /speichern|sichern|übernehmen/i });
    if (speichernButton) {
      fireEvent.click(speichernButton);
      // Es muss ein Fehler-Hinweis erscheinen
      const fehler = screen.queryByText(/spanne|min.*max|kein punktwert|fehler|min < max/i);
      expect(fehler).toBeTruthy();
    } else {
      // Wenn kein Speichern-Button: Inline-Validierung prüfen
      // min-Feld muss kleiner als max-Feld sein (HTML5 min/max oder Fehlermeldung)
      const minInput = erstesMinFeld as HTMLInputElement;
      const maxInput = erstesMaxFeld as HTMLInputElement;
      // Validierungsattribut oder Fehlertext
      const fehlerText = screen.queryByText(/spanne|min.*max|kein punktwert/i);
      const hatValidierung =
        minInput.getAttribute('aria-invalid') === 'true' ||
        maxInput.getAttribute('aria-invalid') === 'true' ||
        fehlerText !== null;
      // Entweder direkte Validierung oder Hinweis-Text
      expect(hatValidierung || minInput.value !== maxInput.value).toBe(true);
    }
  });
});
