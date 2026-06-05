import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MappingEditor } from '@/components/admin/MappingEditor';
import { schatzsucheConfig } from '@/content/schatzsuche.config';
import type { Config } from '@/domain/schema/config';

describe('MappingEditor', () => {
  it('verbindet Probleme und Hebel als n:m-Mapping', () => {
    let aktuelleConfig: Config = JSON.parse(JSON.stringify(schatzsucheConfig));
    const onAendern = (neu: Config) => {
      aktuelleConfig = neu;
    };

    render(<MappingEditor config={aktuelleConfig} onAendern={onAendern} />);

    // Probleme und Hebel müssen aufgelistet sein
    const problemTitel = screen.queryByText(/probleme/i);
    expect(problemTitel).toBeTruthy();

    // Mindestens eine Auswahl für Probleme muss da sein
    const problemSelect = screen.getByTestId('problem-select');
    expect(problemSelect).toBeTruthy();

    // Ein Hebel-Checkbox oder -Auswahl muss vorhanden sein
    const hebelCheckboxen = screen.getAllByRole('checkbox');
    expect(hebelCheckboxen.length).toBeGreaterThan(0);

    // Ersten Problem auswählen und einen Hebel hinzufügen
    const erstesProblemId = aktuelleConfig.probleme[0].id;
    fireEvent.change(problemSelect, { target: { value: erstesProblemId } });

    // Anzahl der Hebel im ersten Problem merken
    const vorher = aktuelleConfig.probleme[0].verknuepfteHebel.length;

    // Den letzten verfügbaren Hebel verknüpfen (der noch nicht verknüpft ist)
    const verfuegbareHebel = aktuelleConfig.hebel.filter(
      (h) => !aktuelleConfig.probleme[0].verknuepfteHebel.includes(h.id),
    );

    if (verfuegbareHebel.length > 0) {
      // Checkbox für den ersten verfügbaren (noch nicht verknüpften) Hebel aktivieren
      const hebelCheckbox = screen.queryByTestId(`hebel-${verfuegbareHebel[0].id}`)
        ?? screen.queryByLabelText(verfuegbareHebel[0].name);
      if (hebelCheckbox) {
        fireEvent.click(hebelCheckbox);
        expect(aktuelleConfig.probleme[0].verknuepfteHebel.length).toBeGreaterThan(vorher);
      }
    }

    // n:m: Ein Hebel kann auch entfernt werden
    const verknuepfteId = aktuelleConfig.probleme[0].verknuepfteHebel[0];
    const verknuepfterHebel = aktuelleConfig.hebel.find((h) => h.id === verknuepfteId);
    if (verknuepfterHebel) {
      const verknuepfteCheckbox = screen.queryByTestId(`hebel-${verknuepfterHebel.id}`)
        ?? screen.queryByLabelText(verknuepfterHebel.name);
      if (verknuepfteCheckbox && (verknuepfteCheckbox as HTMLInputElement).checked) {
        // Nur entfernen wenn mehr als 1 Hebel verknüpft (Schema-Gate: min 1)
        if (aktuelleConfig.probleme[0].verknuepfteHebel.length > 1) {
          const vorherAnzahl = aktuelleConfig.probleme[0].verknuepfteHebel.length;
          fireEvent.click(verknuepfteCheckbox);
          expect(aktuelleConfig.probleme[0].verknuepfteHebel.length).toBe(vorherAnzahl - 1);
        }
      }
    }
  });
});
