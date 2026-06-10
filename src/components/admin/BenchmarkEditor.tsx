import { useState } from 'react';
import type { Config } from '@/domain/schema/config';
import type { Loesung } from '@/domain/schema/loesung';

interface Props {
  config: Config;
  onAendern: (neu: Config) => void;
}

interface FaktorEntwurf {
  key: string;
  min: string;
  max: string;
}

interface LoesungFaktorenEntwurf {
  loesungId: string;
  faktorenRoh: FaktorEntwurf[];
  ausgabeMin: string;
  ausgabeMax: string;
}

/**
 * Benchmark-Faktoren-Editor (§13.2/§13.3).
 * Spannen-Zwang technisch erzwungen — Punktwert wird abgelehnt (§7/§17).
 * Alle Änderungen werden mit einem einzigen „Übernehmen"-Button gespeichert.
 */
export function BenchmarkEditor({ config, onAendern }: Props) {
  const quantifizierbar = config.loesung.filter((h) => h.quantifizierbar && h.berechnung);

  const initialEntwuerfe = (): LoesungFaktorenEntwurf[] =>
    quantifizierbar.map((h) => ({
      loesungId: h.id,
      faktorenRoh: Object.entries(h.berechnung!.faktoren).map(([key, spanne]) => ({
        key,
        min: String(spanne.min),
        max: String(spanne.max),
      })),
      ausgabeMin: String(h.berechnung!.ausgabe.min),
      ausgabeMax: String(h.berechnung!.ausgabe.max),
    }));

  const [entwuerfe, setEntwuerfe] = useState<LoesungFaktorenEntwurf[]>(initialEntwuerfe);
  const [fehler, setFehler] = useState('');

  function updateEntwurf(loesungId: string, patch: Partial<LoesungFaktorenEntwurf>) {
    setFehler('');
    setEntwuerfe((prev) => prev.map((e) => (e.loesungId === loesungId ? { ...e, ...patch } : e)));
  }

  function handleUebernehmen() {
    // Spannen-Zwang: alle Ausgaben und Faktoren müssen min < max
    for (const entwurf of entwuerfe) {
      const loesung = config.loesung.find((h) => h.id === entwurf.loesungId);
      const name = loesung?.name ?? entwurf.loesungId;

      const outMin = parseFloat(entwurf.ausgabeMin);
      const outMax = parseFloat(entwurf.ausgabeMax);
      if (isNaN(outMin) || isNaN(outMax) || outMin >= outMax) {
        setFehler(
          `${name}: Spannen-Zwang — Ausgabe min < max erforderlich, kein Punktwert erlaubt (§7/§17).`,
        );
        return;
      }

      for (const f of entwurf.faktorenRoh) {
        if (!f.key.trim()) continue;
        const fMin = parseFloat(f.min);
        const fMax = parseFloat(f.max);
        if (isNaN(fMin) || isNaN(fMax) || fMin >= fMax) {
          setFehler(
            `${name} — Faktor „${f.key}": Spanne min < max erforderlich, kein Punktwert (§7).`,
          );
          return;
        }
      }
    }

    const neueLoesung: Loesung[] = config.loesung.map((h) => {
      const entwurf = entwuerfe.find((e) => e.loesungId === h.id);
      if (!entwurf || !h.berechnung) return h;

      const neueFaktoren: Record<string, { min: number; max: number }> = {};
      for (const f of entwurf.faktorenRoh) {
        if (f.key.trim()) {
          neueFaktoren[f.key] = { min: parseFloat(f.min), max: parseFloat(f.max) };
        }
      }

      return {
        ...h,
        berechnung: {
          ...h.berechnung,
          faktoren: neueFaktoren,
          ausgabe: {
            min: parseFloat(entwurf.ausgabeMin),
            max: parseFloat(entwurf.ausgabeMax),
          },
        },
      };
    });

    onAendern({ ...config, loesung: neueLoesung });
    setFehler('');
  }

  if (quantifizierbar.length === 0) {
    return (
      <div>
        <h2>Benchmark-Faktoren</h2>
        <p>Keine quantifizierbaren Loesung mit Formel vorhanden.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Benchmark-Faktoren</h2>
      <p style={{ fontSize: '0.85em', color: '#666' }}>
        Alle Faktoren und Ausgaben erfordern eine Bereichsangabe (Untergrenze &lt; Obergrenze) —
        Punktwerte sind nicht zulässig (§7/§17).
      </p>

      {fehler && (
        <p role="alert" style={{ color: 'red', marginBottom: '0.75rem' }}>
          {fehler}
        </p>
      )}

      {entwuerfe.map((entwurf) => {
        const loesung = config.loesung.find((h) => h.id === entwurf.loesungId);
        if (!loesung) return null;

        return (
          <div
            key={entwurf.loesungId}
            style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #ddd' }}
          >
            <h3>{loesung.name}</h3>

            <div style={{ marginBottom: '0.75rem' }}>
              <strong>Ausgabe-Bereich</strong>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                <label>
                  min
                  <input
                    type="number"
                    aria-label={`${loesung.name} Ausgabe min`}
                    value={entwurf.ausgabeMin}
                    onChange={(e) =>
                      updateEntwurf(entwurf.loesungId, { ausgabeMin: e.target.value })
                    }
                  />
                </label>
                <label>
                  max
                  <input
                    type="number"
                    aria-label={`${loesung.name} Ausgabe max`}
                    value={entwurf.ausgabeMax}
                    onChange={(e) =>
                      updateEntwurf(entwurf.loesungId, { ausgabeMax: e.target.value })
                    }
                  />
                </label>
              </div>
            </div>

            <strong>Faktoren</strong>
            {entwurf.faktorenRoh.map((f, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '0.25rem',
                  alignItems: 'center',
                }}
              >
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
                      updateEntwurf(entwurf.loesungId, { faktorenRoh: neu });
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
                      updateEntwurf(entwurf.loesungId, { faktorenRoh: neu });
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        );
      })}

      <div style={{ marginTop: '1.5rem' }}>
        <button onClick={handleUebernehmen}>Übernehmen</button>
      </div>
    </div>
  );
}
