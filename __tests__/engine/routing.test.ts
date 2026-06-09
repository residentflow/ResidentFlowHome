import { describe, it, expect } from 'vitest';
import { routing, relevanteEinheiten, rolleZuTaetigkeit } from '@/domain/engine/routing';

describe('routing — Segment-/Schwellen-Logik (§3.3)', () => {
  it('Steuerberater wird immer dem Partnerprogramm zugewiesen (größenunabhängig)', () => {
    expect(routing(['steuerberater'], { B: 5 }).endAusgang).toBe('partnerprogramm');
    expect(routing(['steuerberater'], { B: 5000 }).endAusgang).toBe('partnerprogramm');
  });

  it('Makler wird immer dem Partnerprogramm zugewiesen (größenunabhängig)', () => {
    expect(routing(['makler'], { B: 9999 }).endAusgang).toBe('partnerprogramm');
  });

  it('Buy & Hold mit genau 50 Einheiten erhält die volle Treppe', () => {
    const r = routing(['buyAndHold'], { A: 50 });
    expect(r.endAusgang).toBe('gespraech');
    expect(r.vollerTreppe).toBe(true);
  });

  it('Buy & Hold mit 49 Einheiten erhält den Selbermacher-Weg', () => {
    const r = routing(['buyAndHold'], { A: 49 });
    expect(r.endAusgang).toBe('nur-playbook');
    expect(r.vollerTreppe).toBe(false);
  });

  it('Hausverwaltung (B-verwaltend) mit 50 betreuten Einheiten erhält die volle Treppe', () => {
    expect(routing(['hausverwaltung'], { B: 50 }).vollerTreppe).toBe(true);
  });

  it('Projektentwicklung erhält den Nebenstrang/kürzeren Weg ohne Stufe 3', () => {
    const r = routing(['projektentwicklung'], { C: 30 });
    expect(r.segmentTyp).toBe('nebenstrang');
    expect(r.vollerTreppe).toBe(false);
  });

  it('Fix & Flip erhält den Nebenstrang und keine volle Treppe', () => {
    expect(routing(['fixAndFlip'], { C: 200 }).vollerTreppe).toBe(false);
  });

  it('bei Mehrfachauswahl gewinnt der höchstwertige Weg (Summe ≥ 50 → volle Treppe)', () => {
    const r = routing(['buyAndHold', 'hausverwaltung'], { A: 30, B: 25 });
    expect(r.relevanteEinheiten).toBe(55);
    expect(r.vollerTreppe).toBe(true);
  });

  it('Steuerberater + Buy & Hold mit Summe ≥ 50 → volle Treppe gewinnt über Partnerprogramm', () => {
    const r = routing(['steuerberater', 'buyAndHold'], { A: 60 });
    expect(r.endAusgang).toBe('gespraech');
    expect(r.vollerTreppe).toBe(true);
  });

  it('respektiert einen übersteuerten Schwellenwert (Schwelle 100 → 60 Einheiten = Selbermacher)', () => {
    const r = routing(['buyAndHold'], { A: 60 }, 100);
    expect(r.vollerTreppe).toBe(false);
  });
});

describe('relevanteEinheiten (§3.2)', () => {
  it('summiert eigene und verwaltete Einheiten (A + B)', () => {
    expect(relevanteEinheiten({ A: 30, B: 25 })).toBe(55);
  });

  it('ignoriert C (Vermarktungen/Jahr) in der Einheiten-Summe', () => {
    expect(relevanteEinheiten({ A: 10, C: 100 })).toBe(10);
  });
});

describe('rolleZuTaetigkeit (§3.3)', () => {
  it('ordnet Bestandshalter der Tätigkeit A zu', () => {
    expect(rolleZuTaetigkeit('buyAndHold')).toBe('A');
  });

  it('ordnet Hausverwaltung der Tätigkeit B zu', () => {
    expect(rolleZuTaetigkeit('hausverwaltung')).toBe('B');
  });

  it('ordnet Projektentwicklung der Tätigkeit C zu', () => {
    expect(rolleZuTaetigkeit('projektentwicklung')).toBe('C');
  });
});
