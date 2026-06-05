import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FAQ } from '../../src/components/content/FAQ';

describe('FAQ', () => {
  it('zeigt genau 5 Vertrauensfragen', () => {
    render(<FAQ />);
    // Jede Frage ist als <dt> oder Button/Heading gerendert — wir suchen nach allen Frage-Texten
    const fragen = screen.getAllByRole('term');
    expect(fragen).toHaveLength(5);
  });

  it('die Datenfrage steht prominent an erster Stelle', () => {
    render(<FAQ />);
    const fragen = screen.getAllByRole('term');
    expect(fragen[0]?.textContent).toMatch(/mit meinen Daten/);
  });

  it('adressiert Wechselkosten ehrlich (Frage zum Aussteigen)', () => {
    const { container } = render(<FAQ />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/aussteigen/i);
  });
});
