import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProblemSchritt } from '@/components/schatzsuche/ProblemSchritt';
import { schatzsucheConfig } from '@/content/schatzsuche.config';
import type { Rolle } from '@/domain/enums';

const config = schatzsucheConfig;

describe('ProblemSchritt (§5.1 / §8.1)', () => {
  it('zeigt zuerst die groben Schmerz-Bereiche (Stufe A)', () => {
    render(
      <ProblemSchritt
        rollen={['buyAndHold'] as Rolle[]}
        relevanteEinheiten={60}
        schmerzBereiche={config.schmerzBereiche}
        probleme={config.probleme}
        gewaehlt={[]}
        onWeiter={vi.fn()}
      />,
    );
    // Stufe A zeigt Schmerz-Bereiche
    expect(screen.getByText(/Ertrag & Rendite/)).toBeInTheDocument();
    expect(screen.getByText(/Zeit & Verwaltungsaufwand/)).toBeInTheDocument();
    // Noch keine konkreten Probleme (Stufe B)
    expect(screen.queryByText(/Mieterhöhungen/)).not.toBeInTheDocument();
  });

  it('zeigt nach Bereichswahl die nach Rolle+Größe gefilterten konkreten Probleme (Stufe B)', async () => {
    const user = userEvent.setup();
    render(
      <ProblemSchritt
        rollen={['buyAndHold'] as Rolle[]}
        relevanteEinheiten={60}
        schmerzBereiche={config.schmerzBereiche}
        probleme={config.probleme}
        gewaehlt={[]}
        onWeiter={vi.fn()}
      />,
    );

    // Schmerz-Bereich "Ertrag & Rendite" wählen
    await user.click(screen.getByText(/Ertrag & Rendite/));

    // Jetzt erscheinen konkrete Probleme (Stufe B)
    expect(screen.getByText(/Mieterhöhungen/)).toBeInTheDocument();
  });

  it('erlaubt Mehrfachauswahl konkreter Probleme', async () => {
    const user = userEvent.setup();
    const onWeiter = vi.fn();
    // Füge ein zusätzliches Problem in "ertrag" für buyAndHold hinzu
    // indem wir mehrere Rollen/Probleme aus verschiedenen Bereichen simulieren.
    // Da die Seed-Probleme pro Bereich oft nur ein Problem pro Rolle haben,
    // testen wir die Mehrfachauswahl über zwei Bereiche:
    // Nach dem ersten Bereich zurückgehen und zweiten Bereich wählen geht nicht (nur ein Bereich).
    // Stattdessen: Test mit vorselektierten Problemen (gewaehlt-Prop) und neuem Bereich.
    // Direkterer Ansatz: Verifikation, dass checkbox type="checkbox" existiert und mehrere
    // Auswahlzustände verwaltet werden können:
    render(
      <ProblemSchritt
        rollen={['buyAndHold'] as Rolle[]}
        relevanteEinheiten={60}
        schmerzBereiche={config.schmerzBereiche}
        probleme={config.probleme}
        gewaehlt={[]}
        onWeiter={onWeiter}
      />,
    );

    // Bereich mit Problemen wählen
    await user.click(screen.getByText(/Ertrag & Rendite/));

    // Checkbox für das Problem erscheint
    const checkboxen = screen.getAllByRole('checkbox');
    expect(checkboxen.length).toBeGreaterThan(0);

    // Problem auswählen
    await user.click(checkboxen[0]!);
    // Problem ist jetzt ausgewählt (Checkbox checked)
    expect(checkboxen[0]).toBeChecked();

    // Zurück und anderen Bereich wählen
    await user.click(screen.getByText(/← Zurück zu den Bereichen/));

    // Zweiten Bereich wählen (Vermarktung hat auch buyAndHold-Problem)
    await user.click(screen.getByText(/Vermarktung & Leerstand/));

    // Weitere Checkbox auswählen
    const checkboxen2 = screen.getAllByRole('checkbox');
    await user.click(checkboxen2[0]!);
    expect(checkboxen2[0]).toBeChecked();

    await user.click(screen.getByRole('button', { name: /Weiter/i }));
    expect(onWeiter).toHaveBeenCalled();
    // Beide Probleme (aus zwei Bereichen) sind gewählt
    const gewaehlteIds = onWeiter.mock.calls[0]?.[0] as string[];
    expect(gewaehlteIds.length).toBeGreaterThan(1);
  });
});
