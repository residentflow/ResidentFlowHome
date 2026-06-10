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

  it('nennt die verantwortliche Stelle mit echten Daten', () => {
    const { container } = render(<Datenschutz />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/menosgada Service GmbH/);
    expect(text).toMatch(/datenschutz@menosgada\.de/);
  });

  it('enthält keine Platzhalter und keinen Entwurfs-Hinweis mehr', () => {
    const { container } = render(<Datenschutz />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/PLATZHALTER/i);
    expect(text).not.toMatch(/Entwurf/i);
  });

  it('erwähnt keine Dienste, die die Seite nicht nutzt (kein Google-Tracking)', () => {
    const { container } = render(<Datenschutz />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/Google Analytics|AdWords|reCAPTCHA|Mouseflow/i);
  });
});
