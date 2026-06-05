import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Bruecke } from '../../src/components/sections/Bruecke';

describe('Brücke', () => {
  it('nennt die drei Entlastungen: Keine Registrierung. Keine Dokumente. Keine E-Mail.', () => {
    render(<Bruecke />);
    expect(screen.getByText('Keine Registrierung.')).toBeInTheDocument();
    expect(screen.getByText('Keine Dokumente.')).toBeInTheDocument();
    expect(screen.getByText('Keine E-Mail.')).toBeInTheDocument();
  });

  it('zeigt den CTA "Bestand analysieren" mit Subtext (3 Minuten · keine Datenübertragung · keine Registrierung)', () => {
    render(<Bruecke />);
    expect(screen.getByRole('button', { name: /Bestand analysieren/i })).toBeInTheDocument();
    expect(
      screen.getByText('3 Minuten · keine Datenübertragung · keine Registrierung'),
    ).toBeInTheDocument();
  });

  it('zeigt vier Nutzen-Häkchen', () => {
    const { container } = render(<Bruecke />);
    // Checkmarks can be ✓, ✔, ✅ or elements with a checkmark role/class
    const haekchen = container.querySelectorAll('[data-haekchen], .haekchen');
    if (haekchen.length >= 4) {
      expect(haekchen.length).toBeGreaterThanOrEqual(4);
    } else {
      // Fallback: count items that contain a checkmark character
      const text = container.textContent ?? '';
      const matches = text.match(/[✓✔✅]/g);
      expect(matches).not.toBeNull();
      expect((matches ?? []).length).toBeGreaterThanOrEqual(4);
    }
  });
});
