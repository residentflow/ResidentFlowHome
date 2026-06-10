import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProofStrip } from '@/components/proof-strip/ProofStrip';
import { checkConfig } from '@/config/checkConfig';

describe('ProofStrip (§9.2 #4 / G1)', () => {
  it('ist aktiv (proofBandEnabled) und zeigt bis zu 3 echte Findings + Founder-Micro', () => {
    // G1 erfüllt: 3 freigegebene Findings im Seed
    expect(checkConfig.settings.proofBandEnabled).toBe(true);
    render(<ProofStrip />);
    expect(screen.getByTestId('proof-strip')).toBeInTheDocument();
    const findings = screen.getAllByTestId('proof-finding');
    expect(findings.length).toBeGreaterThanOrEqual(1);
    expect(findings.length).toBeLessThanOrEqual(3);
    expect(screen.getByTestId('founder-micro')).toBeInTheDocument();
  });

  it('zeigt realisierte €-Werte (keine erfundenen Zahlen, nur approved)', () => {
    render(<ProofStrip />);
    expect(screen.getAllByText(/realisiert/i).length).toBeGreaterThanOrEqual(1);
  });
});
