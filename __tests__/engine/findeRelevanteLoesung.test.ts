import { describe, it, expect } from 'vitest';
import { findeRelevanteLoesung } from '@/domain/engine/findeRelevanteLoesung';
import type { Problem } from '@/domain/schema/problem';
import type { Loesung } from '@/domain/schema/loesung';

const loesung: Loesung[] = [
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

const p = (id: string, loesungIds: string[]): Problem => ({
  id,
  schmerzBereich: 'x',
  text: id,
  rollenFilter: ['buyAndHold'],
  verknuepfteLoesung: loesungIds,
  aktiv: true,
});

describe('findeRelevanteLoesung (§4/§6/§8.4)', () => {
  it('findet Loesung phasenübergreifend über das Problem-Mapping (Phase 3 und 8)', () => {
    const r = findeRelevanteLoesung([p('p1', ['h-phase3', 'h-phase8'])], loesung);
    expect(r.map((h) => h.id)).toEqual(expect.arrayContaining(['h-phase3', 'h-phase8']));
  });

  it('liefert keinen unreferenzierten Loesung', () => {
    const r = findeRelevanteLoesung([p('p1', ['h-phase3'])], loesung);
    expect(r.map((h) => h.id)).not.toContain('h-unreferenziert');
  });

  it('dedupliziert Loesung, die von mehreren Problemen referenziert werden', () => {
    const r = findeRelevanteLoesung([p('p1', ['h-phase3']), p('p2', ['h-phase3'])], loesung);
    expect(r.filter((h) => h.id === 'h-phase3')).toHaveLength(1);
  });
});
