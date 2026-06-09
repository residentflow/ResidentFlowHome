import { describe, it, expect } from 'vitest';
import { filterProbleme, haeufigsteHebelDerRolle } from '@/domain/engine/filterProbleme';
import type { Problem } from '@/domain/schema/problem';

const probleme: Problem[] = [
  {
    id: 'a',
    schmerzBereich: 'ertrag',
    text: 'A',
    rollenFilter: ['buyAndHold'],
    verknuepfteHebel: ['h1'],
    aktiv: true,
  },
  {
    id: 'b',
    schmerzBereich: 'ertrag',
    text: 'B',
    rollenFilter: ['hausverwaltung'],
    verknuepfteHebel: ['h2'],
    aktiv: true,
  },
  {
    id: 'c',
    schmerzBereich: 'zeit',
    text: 'C nur große',
    rollenFilter: ['buyAndHold'],
    groessenBedingung: { minEinheiten: 50 },
    verknuepfteHebel: ['h3'],
    aktiv: true,
  },
  {
    id: 'd',
    schmerzBereich: 'ertrag',
    text: 'D inaktiv',
    rollenFilter: ['buyAndHold'],
    verknuepfteHebel: ['h4'],
    aktiv: false,
  },
];

describe('filterProbleme (§5.1/§5.3)', () => {
  it('zeigt nur Probleme, deren rollenFilter die gewählte Rolle enthält', () => {
    const r = filterProbleme(probleme, { rollen: ['buyAndHold'], relevanteEinheiten: 100 });
    expect(r.map((p) => p.id)).not.toContain('b');
  });

  it('blendet Probleme aus, deren größenBedingung nicht erfüllt ist', () => {
    const r = filterProbleme(probleme, { rollen: ['buyAndHold'], relevanteEinheiten: 10 });
    expect(r.map((p) => p.id)).not.toContain('c');
  });

  it('zeigt größenbedingte Probleme bei erfüllter Bedingung', () => {
    const r = filterProbleme(probleme, { rollen: ['buyAndHold'], relevanteEinheiten: 80 });
    expect(r.map((p) => p.id)).toContain('c');
  });

  it('zeigt nur aktive Probleme (aktiv=false ausgeblendet)', () => {
    const r = filterProbleme(probleme, { rollen: ['buyAndHold'], relevanteEinheiten: 100 });
    expect(r.map((p) => p.id)).not.toContain('d');
  });

  it('filtert zusätzlich nach gewähltem schmerzBereich', () => {
    const r = filterProbleme(probleme, {
      rollen: ['buyAndHold'],
      relevanteEinheiten: 100,
      schmerzBereichId: 'zeit',
    });
    expect(r.map((p) => p.id)).toEqual(['c']);
  });
});

describe('haeufigsteHebelDerRolle ("weiß ich nicht genau", §5.1)', () => {
  it('liefert die Hebel der zur Rolle passenden aktiven Probleme', () => {
    const ids = haeufigsteHebelDerRolle(probleme, ['buyAndHold']);
    expect(ids).toContain('h1');
    expect(ids).not.toContain('h2');
  });
});
