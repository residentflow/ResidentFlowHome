import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MappingEditor } from '@/components/admin/MappingEditor';
import { schatzsucheConfig } from '@/content/schatzsuche.config';
import type { Config } from '@/domain/schema/config';

describe('MappingEditor', () => {
  it('verbindet Probleme und Loesung als n:m-Mapping', () => {
    let aktuelleConfig: Config = JSON.parse(JSON.stringify(schatzsucheConfig));
    const onAendern = (neu: Config) => {
      aktuelleConfig = neu;
    };

    render(<MappingEditor config={aktuelleConfig} onAendern={onAendern} />);

    // Probleme und Loesung müssen aufgelistet sein
    const problemTitel = screen.queryByText(/probleme/i);
    expect(problemTitel).toBeTruthy();

    // Mindestens eine Auswahl für Probleme muss da sein
    const problemSelect = screen.getByTestId('problem-select');
    expect(problemSelect).toBeTruthy();

    // Ein Loesung-Checkbox oder -Auswahl muss vorhanden sein
    const loesungCheckboxen = screen.getAllByRole('checkbox');
    expect(loesungCheckboxen.length).toBeGreaterThan(0);

    // Ersten Problem auswählen und einen Loesung hinzufügen
    const erstesProblemId = aktuelleConfig.probleme[0].id;
    fireEvent.change(problemSelect, { target: { value: erstesProblemId } });

    // Anzahl der Loesung im ersten Problem merken
    const vorher = aktuelleConfig.probleme[0].verknuepfteLoesung.length;

    // Den letzten verfügbaren Loesung verknüpfen (der noch nicht verknüpft ist)
    const verfuegbareLoesung = aktuelleConfig.loesung.filter(
      (h) => !aktuelleConfig.probleme[0].verknuepfteLoesung.includes(h.id),
    );

    if (verfuegbareLoesung.length > 0) {
      // Checkbox für den ersten verfügbaren (noch nicht verknüpften) Loesung aktivieren
      const loesungCheckbox =
        screen.queryByTestId(`loesung-${verfuegbareLoesung[0].id}`) ??
        screen.queryByLabelText(verfuegbareLoesung[0].name);
      if (loesungCheckbox) {
        fireEvent.click(loesungCheckbox);
        expect(aktuelleConfig.probleme[0].verknuepfteLoesung.length).toBeGreaterThan(vorher);
      }
    }

    // n:m: Ein Loesung kann auch entfernt werden
    const verknuepfteId = aktuelleConfig.probleme[0].verknuepfteLoesung[0];
    const verknuepfterLoesung = aktuelleConfig.loesung.find((h) => h.id === verknuepfteId);
    if (verknuepfterLoesung) {
      const verknuepfteCheckbox =
        screen.queryByTestId(`loesung-${verknuepfterLoesung.id}`) ??
        screen.queryByLabelText(verknuepfterLoesung.name);
      if (verknuepfteCheckbox && (verknuepfteCheckbox as HTMLInputElement).checked) {
        // Nur entfernen wenn mehr als 1 Loesung verknüpft (Schema-Gate: min 1)
        if (aktuelleConfig.probleme[0].verknuepfteLoesung.length > 1) {
          const vorherAnzahl = aktuelleConfig.probleme[0].verknuepfteLoesung.length;
          fireEvent.click(verknuepfteCheckbox);
          expect(aktuelleConfig.probleme[0].verknuepfteLoesung.length).toBe(vorherAnzahl - 1);
        }
      }
    }
  });
});
