import { describe, it, expect } from 'vitest';
import { validateAssetLiveGate, LIVE_QUALITY_STATUS } from '../../apps/admin/src/gates';

/**
 * CMS-Live-Gate für Assets (PRD §25): reviewed/approved nur mit gesetztem riskLevel.
 * Spiegelt den Export-Filter direkt im Payload-Admin.
 */
describe('validateAssetLiveGate', () => {
  it('lässt Entwürfe ohne riskLevel zu', () => {
    expect(validateAssetLiveGate('draft', undefined)).toBe(true);
    expect(validateAssetLiveGate('draft', null)).toBe(true);
  });

  it('blockiert reviewed/approved ohne riskLevel', () => {
    for (const status of LIVE_QUALITY_STATUS) {
      expect(validateAssetLiveGate(status, undefined)).toMatch(/riskLevel/i);
      expect(validateAssetLiveGate(status, '')).toMatch(/riskLevel/i);
    }
  });

  it('erlaubt reviewed/approved mit gesetztem riskLevel', () => {
    expect(validateAssetLiveGate('reviewed', 'niedrig')).toBe(true);
    expect(validateAssetLiveGate('approved', 'hoch')).toBe(true);
  });
});
