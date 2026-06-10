import { describe, it, expect } from 'vitest';
import { LoesungSchema } from '@/domain/schema/loesung';

const quantLoesung = {
  id: 'h1',
  name: 'Virtuelles Staging',
  lebenszyklusPhase: 3,
  wertKategorie: 'ertrag',
  rahmung: 'chance',
  quantifizierbar: true,
  taetigkeiten: ['B'],
  detailFragen: ['neuvermietungenProJahr'],
  berechnung: {
    inputs: ['neuvermietungenProJahr'],
    faktoren: { mieteProMonat: { min: 550, max: 650 }, verkuerzungWochen: { min: 3, max: 4 } },
    ausgabe: { min: 2700, max: 3600 },
    einheit: '€ p.a.',
    rechenwegText: '5 × 600 € × (3–4 Wochen)',
  },
  playbookLink: '#playbook-staging',
  kartenText: 'Leerstand kostet — Staging verkürzt die Vermarktung.',
};

const qualLoesung = {
  id: 'h2',
  name: 'Fristenüberwachung',
  lebenszyklusPhase: 5,
  wertKategorie: 'risiko',
  rahmung: 'verlust',
  quantifizierbar: false,
  taetigkeiten: ['A', 'B'],
  detailFragen: [],
  nutzenAussage: 'Verhindert übersehene Fristen und damit drohende Kosten.',
  playbookLink: '#playbook-fristen',
  kartenText: 'Fristen gehen unter — das Risiko ist real.',
};

describe('LoesungSchema (§6.1/§14)', () => {
  it('akzeptiert einen gültigen quantifizierbaren Loesung', () => {
    expect(LoesungSchema.safeParse(quantLoesung).success).toBe(true);
  });

  it('akzeptiert einen gültigen qualitativen Risiko-Loesung', () => {
    expect(LoesungSchema.safeParse(qualLoesung).success).toBe(true);
  });

  it('erzwingt rahmung=verlust bei wertKategorie=risiko', () => {
    const falsch = { ...qualLoesung, rahmung: 'chance' };
    expect(LoesungSchema.safeParse(falsch).success).toBe(false);
  });

  it('erlaubt rahmung=chance bei ertrag und effizienz', () => {
    expect(LoesungSchema.safeParse({ ...quantLoesung, wertKategorie: 'effizienz' }).success).toBe(
      true,
    );
  });

  it('verlangt nutzenAussage bei qualitativem Loesung', () => {
    const { nutzenAussage: _n, ...ohne } = qualLoesung;
    void _n;
    expect(LoesungSchema.safeParse(ohne).success).toBe(false);
  });

  it('verlangt berechnung (Formel) bei quantifizierbarem Loesung', () => {
    const { berechnung: _b, ...ohne } = quantLoesung;
    void _b;
    expect(LoesungSchema.safeParse(ohne).success).toBe(false);
  });
});
