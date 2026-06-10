import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Impressum } from '../../src/components/content/Impressum';

describe('Impressum', () => {
  it('rendert ein Impressum mit echten Anbieterangaben', () => {
    const { container } = render(<Impressum />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/Impressum/i);
    expect(text).toMatch(/§ 5 TMG/);
    expect(text).toMatch(/menosgada Service GmbH/);
    expect(text).toMatch(/96231 Bad Staffelstein/);
    expect(text).toMatch(/HRB 6741/);
    expect(text).toMatch(/Stefan Holhut/);
    expect(text).toMatch(/DE348721113/);
  });

  it('enthält keine Platzhalter mehr', () => {
    const { container } = render(<Impressum />);
    expect(container.textContent ?? '').not.toMatch(/PLATZHALTER/i);
  });

  it('nennt EU-Streitschlichtung und Verbraucherstreitbeilegung', () => {
    const { container } = render(<Impressum />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/Online-Streitbeilegung/i);
    expect(text).toMatch(/Verbraucherschlichtungsstelle/i);
  });
});
