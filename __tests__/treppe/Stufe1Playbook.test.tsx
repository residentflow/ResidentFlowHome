import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Stufe1Playbook } from '@/components/treppe/Stufe1Playbook';
import { schatzsucheConfig } from '@/content/schatzsuche.config';

describe('Stufe1Playbook — 6 Schwerpunkte (§10.1)', () => {
  it('enthält keinen externen Link (kein Skool-Abfluss, PRD v6 §G7)', () => {
    const { container } = render(<Stufe1Playbook />);
    expect(container.querySelector('a[href^="http"]')).toBeNull();
    expect(screen.queryByRole('button', { name: /Playbook ansehen/i })).not.toBeInTheDocument();
  });

  it('rendert alle 6 Schwerpunkt-Titel mit Beschreibung', () => {
    render(<Stufe1Playbook />);
    const liste = screen.getByTestId('playbook-schwerpunkte');
    for (const p of schatzsucheConfig.phasen) {
      expect(within(liste).getByText(p.name)).toBeInTheDocument();
      // ein charakteristisches Wort aus der Beschreibung muss erscheinen
      expect(within(liste).getByText(new RegExp(p.beschreibung!.slice(0, 24)))).toBeInTheDocument();
    }
  });

  it('verwendet weder das Wort "Kurs" noch die veraltete "8 …phasen"-Copy', () => {
    const { container } = render(<Stufe1Playbook />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/Kurs/i);
    expect(text).not.toMatch(/8 Lebenszyklus/i);
  });
});
