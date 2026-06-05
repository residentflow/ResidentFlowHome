import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DatenschutzBeweis } from '../../src/components/sections/DatenschutzBeweis';

describe('DatenschutzBeweis', () => {
  it('zeigt die Signale lokal · EU/self-hosted · Daten bleiben bei Ihnen', () => {
    render(<DatenschutzBeweis />);
    expect(
      screen.getByText('lokal · EU/self-hosted · Daten bleiben bei Ihnen'),
    ).toBeInTheDocument();
  });

  it('verspricht, dass Daten das Gerät nicht verlassen', () => {
    render(<DatenschutzBeweis />);
    expect(screen.getByText(/Daten verlassen Ihr Gerät nicht/i)).toBeInTheDocument();
  });
});
