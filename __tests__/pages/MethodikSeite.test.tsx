import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MethodikSeite } from '@/pages/MethodikSeite';

describe('MethodikSeite (§23)', () => {
  it('erklärt Spannen, eigene-Bestand-Quelle und "kein Gutachten"', () => {
    render(<MethodikSeite />);
    const seite = screen.getByTestId('methodik-seite');
    expect(seite).toBeInTheDocument();
    expect(seite.textContent).toMatch(/Spanne/i);
    expect(seite.textContent).toMatch(/kein Gutachten/i);
    expect(seite.textContent).toMatch(/eigenen Portfolio/i);
  });
});
