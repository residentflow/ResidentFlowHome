import { describe, it, expect } from 'vitest';
import { findeRelevanteHebel } from '@/domain/engine/findeRelevanteHebel';
import type { Problem } from '@/domain/schema/problem';
import type { Hebel } from '@/domain/schema/hebel';

const hebel: Hebel[] = [
  {
    id: 'h-phase3',
    name: 'Staging',
    lebenszyklusPhase: 3,
    wertKategorie: 'ertrag',
    rahmung: 'chance',
    quantifizierbar: false,
    taetigkeiten: ['B'],
    detailFragen: [],
    nutzenAussage: 'n',
    playbookLink: '#',
    kartenText: 't',
  },
  {
    id: 'h-phase8',
    name: 'Automatisierung',
    lebenszyklusPhase: 8,
    wertKategorie: 'effizienz',
    rahmung: 'chance',
    quantifizierbar: false,
    taetigkeiten: ['A'],
    detailFragen: [],
    nutzenAussage: 'n',
    playbookLink: '#',
    kartenText: 't',
  },
  {
    id: 'h-unreferenziert',
    name: 'Sonst',
    lebenszyklusPhase: 1,
    wertKategorie: 'effizienz',
    rahmung: 'chance',
    quantifizierbar: false,
    taetigkeiten: ['A'],
    detailFragen: [],
    nutzenAussage: 'n',
    playbookLink: '#',
    kartenText: 't',
  },
];

const p = (id: string, hebelIds: string[]): Problem => ({
  id,
  schmerzBereich: 'x',
  text: id,
  rollenFilter: ['buyAndHold'],
  verknuepfteHebel: hebelIds,
  aktiv: true,
});

describe('findeRelevanteHebel (§4/§6/§8.4)', () => {
  it('findet Hebel phasenübergreifend über das Problem-Mapping (Phase 3 und 8)', () => {
    const r = findeRelevanteHebel([p('p1', ['h-phase3', 'h-phase8'])], hebel);
    expect(r.map((h) => h.id)).toEqual(expect.arrayContaining(['h-phase3', 'h-phase8']));
  });

  it('liefert keinen unreferenzierten Hebel', () => {
    const r = findeRelevanteHebel([p('p1', ['h-phase3'])], hebel);
    expect(r.map((h) => h.id)).not.toContain('h-unreferenziert');
  });

  it('dedupliziert Hebel, die von mehreren Problemen referenziert werden', () => {
    const r = findeRelevanteHebel([p('p1', ['h-phase3']), p('p2', ['h-phase3'])], hebel);
    expect(r.filter((h) => h.id === 'h-phase3')).toHaveLength(1);
  });
});
