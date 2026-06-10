import { describe, it, expect, vi, afterEach } from 'vitest';
import { EVENTS, track } from '@/analytics/plausible';

describe('Plausible Custom Events (§19.1)', () => {
  afterEach(() => {
    delete (globalThis as Record<string, unknown>).plausible;
    vi.restoreAllMocks();
  });

  it('enthält die Funnel-Pflicht-Events', () => {
    for (const e of [
      'role_selected',
      'size_selected',
      'problem_selected',
      'value_range_shown',
      'cta_shown',
      'calendar_clicked',
      'booking_confirmed',
    ]) {
      expect(Object.values(EVENTS)).toContain(e);
    }
  });

  it('track() ist no-op ohne geladenes Plausible (kein Fehler)', () => {
    expect(() => track(EVENTS.role_selected, { role: 'buyAndHold' })).not.toThrow();
  });

  it('track() ruft window.plausible mit Event und props (nur Buckets/Slugs)', () => {
    const fn = vi.fn();
    (globalThis as Record<string, unknown>).plausible = fn;
    track(EVENTS.size_selected, { bucket: '50–99' });
    expect(fn).toHaveBeenCalledWith('size_selected', { props: { bucket: '50–99' } });
  });
});
