import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Datenschutz } from '../../src/components/content/Datenschutz';

describe('Datenschutz', () => {
  it('beschreibt, dass die Suche nichts überträgt', () => {
    const { container } = render(<Datenschutz />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/Suche/i);
    expect(text).toMatch(/übertr/i);
  });

  it('nennt Brevo als Auftragsverarbeiter (AVV)', () => {
    const { container } = render(<Datenschutz />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/Brevo/);
    expect(text).toMatch(/Auftragsverarbeiter/i);
  });

  it('nennt Plausible cookieless', () => {
    const { container } = render(<Datenschutz />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/Plausible/);
    expect(text).toMatch(/cookieless|cookie-los|ohne Cookie/i);
  });

  it('beschreibt den einen Opt-in-Kanal samt Abmeldung', () => {
    const { container } = render(<Datenschutz />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/Opt-in|E-Mail.*hinterlass|PDF/i);
    expect(text).toMatch(/Abmeld/i);
  });

  it('enthält den Hinweis "rechtlich prüfen lassen"', () => {
    const { container } = render(<Datenschutz />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/rechtlich prüfen lassen/i);
  });
});
