import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProblemAbschnitt } from '../../src/components/sections/ProblemAbschnitt';

describe('ProblemAbschnitt', () => {
  it('entlastet das Team (kein System, das es systematisch findet)', () => {
    render(<ProblemAbschnitt />);
    expect(
      screen.getByText(/kein System.*systematisch findet/i),
    ).toBeInTheDocument();
  });

  it('zeigt eine Merk-Zahl als Spanne (€ – €)', () => {
    const { container } = render(<ProblemAbschnitt />);
    const text = container.textContent ?? '';
    // Matches patterns like "25.000–90.000 €" or "25.000 – 90.000 €"
    expect(text).toMatch(/\d[\d.,]+\s*[–-]\s*\d[\d.,]+\s*€/);
  });
});
