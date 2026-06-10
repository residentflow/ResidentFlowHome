import { describe, it, expect } from 'vitest';
import { waehleCTAs, buildCalComUrl, type CTARuleCfg } from '@/domain/cta/engine';

const regel: CTARuleCfg = {
  name: 'highintent-gespraech',
  roleFilters: [],
  minSizeScore: 3,
  maxSizeScore: null,
  minRelevanceScore: null,
  allowRisiko: false,
  primaryLabel: 'Ihren Bestand gemeinsam ansehen',
  sublineKey: 'cta.give.short',
  secondaryLabel: null,
  destination: 'gespraech',
  priority: 10,
};

describe('CTARule-Engine (§14.3)', () => {
  it('zeigt die Regel erst ab firstValueShown UND sizeScore≥Schwelle', () => {
    const ctx = {
      roleSlug: 'buyAndHold',
      sizeScore: 3,
      valueCategory: ['ertrag'],
      firstValueShown: true,
    };
    expect(waehleCTAs(ctx, [regel])).toHaveLength(1);
    // ohne firstValueShown nie
    expect(waehleCTAs({ ...ctx, firstValueShown: false }, [regel])).toHaveLength(0);
    // unter Schwelle nicht
    expect(waehleCTAs({ ...ctx, sizeScore: 2 }, [regel])).toHaveLength(0);
  });

  it('Risiko-Problem ohne allowRisiko zeigt die Chance-Regel nicht', () => {
    const ctx = {
      roleSlug: 'buyAndHold',
      sizeScore: 5,
      valueCategory: ['risiko'],
      firstValueShown: true,
    };
    expect(waehleCTAs(ctx, [regel])).toHaveLength(0);
    expect(waehleCTAs(ctx, [{ ...regel, allowRisiko: true }])).toHaveLength(1);
  });

  it('buildCalComUrl setzt metadata inkl. source und Spanne (§17.2)', () => {
    const url = buildCalComUrl('https://cal.com/x', {
      role: 'buyAndHold',
      sizeBucket: '50–99',
      problemSlug: 'mieten-indexmieten-pruefen',
      top3Slugs: ['a', 'b', 'c', 'd'],
      range: { min: 14000, max: 64000 },
      source: 'header-direct',
    });
    expect(url).toContain('metadata%5Brole%5D=buyAndHold');
    expect(url).toContain('metadata%5Bsource%5D=header-direct');
    expect(url).toContain('14000-64000');
    expect(url).toContain('a%2Cb%2Cc'); // nur top 3
  });
});
