import { useState } from 'react';
import type { Config } from '@/domain/schema/config';
import type { Hebel } from '@/domain/schema/hebel';

interface Props {
  config: Config;
  onAendern: (neu: Config) => void;
}

interface FaktorEntwurf {
  key: string;
  min: string;
  max: string;
}

interface HebelFaktorenEntwurf {
  hebelId: string;
  faktorenRoh: FaktorEntwurf[];
  ausgabeMin: string;
  ausgabeMax: string;
  fehler: string;
}

/**
 * Benchmark-Faktoren-Editor (§13.2/§13.3).
 * Spannen-Zwang technisch erzwungen — Punktwert wird abgelehnt (§7/§17).
 */
export function BenchmarkEditor({ config, onAendern }: Props) {
  const quantifizierbar = config.hebel.filter((h) => h.quantifizierbar && h.berechnung);

  const initialEntwuerfe: HebelFaktorenEntwurf[] = quantifizierbar.map((h) => ({
    hebelId: h.id,
    faktorenRoh: Object.entries(h.berechnung!.faktoren).map(([key, spanne]) => ({
      key,
      min: String(spanne.min),
      max: String(spanne.max),
    })),
    ausgabeMin: String(h.berechnung!.ausgabe.min),
    ausgabeMax: String(h.berechnung!.ausgabe.max),
    fehler: '',
  }));

  const [entwuerfe, setEntwuerfe] = useState<HebelFaktorenEntwurf[]>(initialEntwuerfe);

  function updateEntwurf(hebelId: string, patch: Partial<HebelFaktorenEntwurf>) {
    setEntwuerfe((prev) =>
      prev.map((e) => (e.hebelId === hebelId ? { ...e, ...patch, fehler: '' } : e)),
    );
  }

  function handleSpeichern(hebelId: string) {
    const entwurf = entwuerfe.find((e) => e.hebelId === hebelId);
    if (!entwurf) return;

    // Spannen-Zwang: Ausgabe min < max
    const outMin = parseFloat(entwurf.ausgabeMin);
    const outMax = parseFloat(entwurf.ausgabeMax);
    if (isNaN(outMin) || isNaN(outMax) || outMin >= outMax) {
      setEntwuerfe((prev) =>
        prev.map((e) =>
          e.hebelId === hebelId
            ? {
                ...e,
                fehler:
                  'Spannen-Zwang: min < max erforderlich — kein Punktwert erlaubt (§7/§17).',
              }
            : e,
        ),
      );
      return;
    }

    // Spannen-Zwang: alle Faktoren min < max
    for (const f of entwurf.faktorenRoh) {
      if (!f.key.trim()) continue;
      const fMin = parseFloat(f.min);
      const fMax = parseFloat(f.max);
      if (isNaN(fMin) || isNaN(fMax) || fMin >= fMax) {
        setEntwuerfe((prev) =>
          prev.map((e) =>
            e.hebelId === hebelId
              ? {
                  ...e,
                  fehler: `Faktor „${f.key}": Spanne min < max erforderlich — kein Punktwert (§7).`,
                }
              : e,
          ),
        );
        return;
      }
    }

    const neueFaktoren: Record<string, { min: number; max: number }> = {};
    for (const f of entwurf.faktorenRoh) {
      if (f.key.trim()) {
        neueFaktoren[f.key] = { min: parseFloat(f.min), max: parseFloat(f.max) };
      }
    }

    const neueHebel: Hebel[] = config.hebel.map((h) => {
      if (h.id !== hebelId || !h.berechnung) return h;
      return {
        ...h,
        berechnung: {
          ...h.berechnung,
          faktoren: neueFaktoren,
          ausgabe: { min: outMin, max: outMax },
        },
      };
    });

    onAendern({ ...config, hebel: neueHebel });
  }

  if (quantifizierbar.length === 0) {
    return (
      <div>
        <h2>Benchmark-Faktoren</h2>
        <p>Keine quantifizierbaren Hebel mit Formel vorhanden.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Benchmark-Faktoren</h2>
      <p style={{ fontSize: '0.85em', color: '#666' }}>
        Alle Faktoren und Ausgaben müssen als Spannen (min &lt; max) angegeben werden — kein
        Punktwert erlaubt (§7/§17).
      </p>

      {entwuerfe.map((entwurf) => {
        const hebel = config.hebel.find((h) => h.id === entwurf.hebelId);
        if (!hebel) return null;

        return (
          <div
            key={entwurf.hebelId}
            style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #ddd' }}
          >
            <h3>{hebel.name}</h3>

            {entwurf.fehler && (
              <p role="alert" style={{ color: 'red' }}>
                {entwurf.fehler}
              </p>
            )}

            <div style={{ marginBottom: '0.75rem' }}>
              <strong>Ausgabe-Spanne</strong>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                <label>
                  min
                  <input
                    type="number"
                    aria-label={`${hebel.name} Ausgabe min`}
                    value={entwurf.ausgabeMin}
                    onChange={(e) =>
                      updateEntwurf(entwurf.hebelId, { ausgabeMin: e.target.value })
                    }
                  />
                </label>
                <label>
                  max
                  <input
                    type="number"
                    aria-label={`${hebel.name} Ausgabe max`}
                    value={entwurf.ausgabeMax}
                    onChange={(e) =>
                      updateEntwurf(entwurf.hebelId, { ausgabeMax: e.target.value })
                    }
                  />
                </label>
              </div>
            </div>

            <strong>Faktoren</strong>
            {entwurf.faktorenRoh.map((f, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', alignItems: 'center' }}>
                <span style={{ minWidth: '180px' }}>{f.key}</span>
                <label>
                  min
                  <input
                    type="number"
                    aria-label={`${f.key} min`}
                    value={f.min}
                    onChange={(e) => {
                      const neu = entwurf.faktorenRoh.map((x, i) =>
                        i === idx ? { ...x, min: e.target.value } : x,
                      );
                      updateEntwurf(entwurf.hebelId, { faktorenRoh: neu });
                    }}
                  />
                </label>
                <label>
                  max
                  <input
                    type="number"
                    aria-label={`${f.key} max`}
                    value={f.max}
                    onChange={(e) => {
                      const neu = entwurf.faktorenRoh.map((x, i) =>
                        i === idx ? { ...x, max: e.target.value } : x,
                      );
                      updateEntwurf(entwurf.hebelId, { faktorenRoh: neu });
                    }}
                  />
                </label>
              </div>
            ))}

            <button
              style={{ marginTop: '0.75rem' }}
              onClick={() => handleSpeichern(entwurf.hebelId)}
            >
              Speichern
            </button>
          </div>
        );
      })}
    </div>
  );
}
