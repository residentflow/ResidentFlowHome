import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Impressum } from '../../src/components/content/Impressum';

describe('Impressum', () => {
  it('rendert ein Impressum mit Anbieterangaben (Platzhalter)', () => {
    const { container } = render(<Impressum />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/Impressum/i);
    expect(text).toMatch(/Anbieter|Verantwortlich/i);
    // Platzhalter-Markierung muss vorhanden sein
    expect(text).toMatch(/PLATZHALTER/i);
  });
});
