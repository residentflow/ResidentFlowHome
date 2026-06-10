import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PartnerprogrammSeite } from '@/pages/PartnerprogrammSeite';

describe('PartnerprogrammSeite /partnerprogramm (§2.3/§14.5)', () => {
  it('erklärt den Partneransatz und verlinkt auf den Termin', () => {
    render(<PartnerprogrammSeite />);
    expect(screen.getByTestId('partnerprogramm-seite')).toBeInTheDocument();
    expect(screen.getByTestId('partner-ablauf')).toBeInTheDocument();
    expect(screen.getByTestId('partner-nutzen')).toBeInTheDocument();
    expect(screen.getByTestId('partner-termin')).toHaveAttribute('href', '/termin?src=partner');
  });
});
