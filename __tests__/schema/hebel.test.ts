import { describe, it, expect } from 'vitest';
import { HebelSchema } from '@/domain/schema/hebel';

const quantHebel = {
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

const qualHebel = {
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

describe('HebelSchema (§6.1/§14)', () => {
  it('akzeptiert einen gültigen quantifizierbaren Hebel', () => {
    expect(HebelSchema.safeParse(quantHebel).success).toBe(true);
  });

  it('akzeptiert einen gültigen qualitativen Risiko-Hebel', () => {
    expect(HebelSchema.safeParse(qualHebel).success).toBe(true);
  });

  it('erzwingt rahmung=verlust bei wertKategorie=risiko', () => {
    const falsch = { ...qualHebel, rahmung: 'chance' };
    expect(HebelSchema.safeParse(falsch).success).toBe(false);
  });

  it('erlaubt rahmung=chance bei ertrag und effizienz', () => {
    expect(HebelSchema.safeParse({ ...quantHebel, wertKategorie: 'effizienz' }).success).toBe(true);
  });

  it('verlangt nutzenAussage bei qualitativem Hebel', () => {
    const { nutzenAussage: _n, ...ohne } = qualHebel;
    void _n;
    expect(HebelSchema.safeParse(ohne).success).toBe(false);
  });

  it('verlangt berechnung (Formel) bei quantifizierbarem Hebel', () => {
    const { berechnung: _b, ...ohne } = quantHebel;
    void _b;
    expect(HebelSchema.safeParse(ohne).success).toBe(false);
  });
});
