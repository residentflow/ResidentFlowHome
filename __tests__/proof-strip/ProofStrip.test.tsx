import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProofStrip } from '@/components/proof-strip/ProofStrip';
import { checkConfig } from '@/config/checkConfig';

describe('ProofStrip (§9.2 #4 / G1)', () => {
  it('bleibt aus, solange proofBandEnabled false ist bzw. keine approved Findings vorliegen', () => {
    // Im aktuellen L1-Seed: proofBandEnabled=false, proofFindings leer → Strip aus
    expect(checkConfig.settings.proofBandEnabled).toBe(false);
    const { container } = render(<ProofStrip />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('proof-strip')).toBeNull();
  });
});
