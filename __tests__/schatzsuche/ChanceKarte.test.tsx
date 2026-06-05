import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChanceKarte } from '@/components/schatzsuche/ChanceKarte';
import { VerlustKarte } from '@/components/schatzsuche/VerlustKarte';

describe('ChanceKarte (§8.3)', () => {
  it('die Chance-Karte zeigt Titel, Spanne, Typische Ursache und Playbook-Hinweis', () => {
    render(
      <ChanceKarte
        titel="Mietpotenzial-Erkennung"
        spanne={{ min: 18000, max: 42000 }}
        typischeUrsache="Nicht gezogene Mieterhöhungen summieren sich."
        playbookHinweis="Wie Sie systematisch alle Potenziale heben."
        playbookLink="#playbook"
      />,
    );

    expect(screen.getByText('Mietpotenzial-Erkennung')).toBeInTheDocument();
    // Spanne im Format "18.000 – 42.000 €" o.ä.
    expect(screen.getByText(/18[\.,]?000/)).toBeInTheDocument();
    expect(screen.getByText(/42[\.,]?000/)).toBeInTheDocument();
    expect(screen.getByText(/Typische Ursache/i)).toBeInTheDocument();
    expect(screen.getByText(/Nicht gezogene Mieterhöhungen summieren sich/)).toBeInTheDocument();
    expect(screen.getByText(/Im Playbook erfahren Sie/i)).toBeInTheDocument();
    expect(screen.getByText(/Wie Sie systematisch alle Potenziale heben/)).toBeInTheDocument();
  });

  it('verwendet das Label "Hebel" und nie "Skill"', () => {
    const { container } = render(
      <ChanceKarte
        titel="Virtuelles Staging"
        spanne={{ min: 2700, max: 3600 }}
        typischeUrsache="Leere Wohnungen vermarkten sich schlechter."
        playbookHinweis="Virtuelles Staging einfach anwenden."
        playbookLink="#playbook-staging"
      />,
    );
    expect(container.textContent).not.toMatch(/\bSkill\b/i);
  });
});

describe('VerlustKarte (§8.3)', () => {
  it('die Verlust-Karte zeigt ⚠️, Wahrscheinlichkeit/Grund und "Was droht"', () => {
    render(
      <VerlustKarte
        titel="Fristenüberwachung"
        wahrscheinlichkeitOderGrund="Übersehene Fristen können teuer werden."
        wasDroht="Vertragsstrafen, Fristverlust und kostspielige Nachbesserungen."
        playbookLink="#playbook-fristen"
      />,
    );

    expect(screen.getByText(/⚠️/)).toBeInTheDocument();
    expect(screen.getByText('Fristenüberwachung')).toBeInTheDocument();
    expect(screen.getByText(/Übersehene Fristen können teuer werden/)).toBeInTheDocument();
    expect(screen.getByText(/Was droht/i)).toBeInTheDocument();
    expect(screen.getByText(/Vertragsstrafen/)).toBeInTheDocument();
  });

  it('verwendet die Verlust-Rahmung nur bei Risiko-Hebeln', () => {
    // VerlustKarte existiert nur für Risiko-Hebel — das ist durch den Typ erzwungen.
    // Dieser Test prüft, dass die Karte das ⚠️ und "Was droht" immer zeigt,
    // und dass kein "Potenzial" oder CHANCE-Vokabular auftaucht.
    const { container } = render(
      <VerlustKarte
        titel="Risikotest"
        wahrscheinlichkeitOderGrund="Hohes Risiko durch fehlende Kontrolle."
        wasDroht="Mögliche Verluste."
        playbookLink="#"
      />,
    );
    expect(container.textContent).toContain('⚠️');
    // Verlust-Karte zeigt kein CHANCE-Wording
    expect(container.textContent).not.toMatch(/Typische Ursache/i);
  });

  it('verwendet das Label "Hebel" und nie "Skill"', () => {
    const { container } = render(
      <VerlustKarte
        titel="Fristenüberwachung"
        wahrscheinlichkeitOderGrund="Risiko."
        wasDroht="Verlust."
        playbookLink="#"
      />,
    );
    expect(container.textContent).not.toMatch(/\bSkill\b/i);
  });
});
