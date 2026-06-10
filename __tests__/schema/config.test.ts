import { describe, it, expect } from 'vitest';
import { ConfigSchema } from '@/domain/schema/config';
import { schatzsucheConfig } from '@/content/schatzsuche.config';

function gueltigeConfig() {
  return {
    schmerzBereiche: [{ id: 'ertrag', name: 'Ertrag & Rendite', reihenfolge: 1 }],
    phasen: [{ id: 3, name: 'Vermarktung & Neuvermietung', reihenfolge: 3 }],
    probleme: [
      {
        id: 'p1',
        schmerzBereich: 'ertrag',
        text: 'Vermarktung dauert zu lange',
        rollenFilter: ['hausverwaltung'],
        verknuepfteHebel: ['h1'],
        aktiv: true,
      },
    ],
    hebel: [
      {
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
          faktoren: { mieteProMonat: { min: 550, max: 650 } },
          ausgabe: { min: 2700, max: 3600 },
          einheit: '€ p.a.',
          rechenwegText: '5 × 600 € × (3–4 Wochen)',
        },
        playbookLink: '#p',
        kartenText: 'Text',
      },
    ],
    segmente: [{ taetigkeit: 'A', typ: 'kern', endAusgang: 'gespraech' }],
    globalConfig: {
      schwellenwertStufe3: 50,
      terminLink: '#termin',
      partnerprogrammLink: '#partner',
      brevoListId: 1,
      privacyFlowDownloadUrl: '#privacyflow',
    },
  };
}

describe('ConfigSchema — Cross-Reference-Integrität (§14)', () => {
  it('validiert eine in sich konsistente Config', () => {
    expect(ConfigSchema.safeParse(gueltigeConfig()).success).toBe(true);
  });

  it('lehnt ein Problem ab, das auf einen nicht existierenden Hebel verweist', () => {
    const c = gueltigeConfig();
    c.probleme[0]!.verknuepfteHebel = ['existiert-nicht'];
    expect(ConfigSchema.safeParse(c).success).toBe(false);
  });

  it('lehnt einen Hebel ab, dessen lebenszyklusPhase nicht existiert', () => {
    const c = gueltigeConfig();
    c.hebel[0]!.lebenszyklusPhase = 99;
    expect(ConfigSchema.safeParse(c).success).toBe(false);
  });

  it('setzt den Schwellenwert-Standard auf 50', () => {
    const c = gueltigeConfig();
    const parsed = ConfigSchema.parse(c);
    expect(parsed.globalConfig.schwellenwertStufe3).toBe(50);
  });
});

describe('Seed-Config aus src/content', () => {
  it('validiert den ausgelieferten Seed erfolgreich', () => {
    expect(ConfigSchema.safeParse(schatzsucheConfig).success).toBe(true);
  });

  it('enthält für jedes Problem mindestens einen verknüpften Hebel', () => {
    for (const p of schatzsucheConfig.probleme) {
      expect(p.verknuepfteHebel.length).toBeGreaterThan(0);
    }
  });
});
