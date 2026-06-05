import { useState } from 'react';
import type { Config } from '@/domain/schema/config';
import type { Hebel } from '@/domain/schema/hebel';
import { TAETIGKEITEN, WERT_KATEGORIEN, RAHMUNGEN } from '@/domain/enums';

interface Props {
  config: Config;
  onAendern: (neu: Config) => void;
}

type HebelEntwurf = Omit<Hebel, 'berechnung' | 'nutzenAussage'> & {
  quantifizierbar: boolean;
  nutzenAussage: string;
  /** Faktor-Schlüssel → min/max als Strings (für Formular-Eingabe) */
  faktorenRoh: { key: string; min: string; max: string }[];
  ausgabeMin: string;
  ausgabeMax: string;
  ausgabeEinheit: string;
  rechenwegText: string;
  formFehler: string;
};

function neuerEntwurf(): HebelEntwurf {
  return {
    id: `hebel-${Date.now()}`,
    name: '',
    lebenszyklusPhase: 1,
    wertKategorie: 'ertrag',
    rahmung: 'chance',
    quantifizierbar: false,
    taetigkeiten: ['A'],
    detailFragen: [],
    nutzenAussage: '',
    playbookLink: '',
    kartenText: '',
    faktorenRoh: [{ key: '', min: '', max: '' }],
    ausgabeMin: '',
    ausgabeMax: '',
    ausgabeEinheit: '€ p.a.',
    rechenwegText: '',
    formFehler: '',
  };
}

function entwurfAusHebel(h: Hebel): HebelEntwurf {
  const faktorenRoh =
    h.berechnung
      ? Object.entries(h.berechnung.faktoren).map(([key, spanne]) => ({
          key,
          min: String(spanne.min),
          max: String(spanne.max),
        }))
      : [{ key: '', min: '', max: '' }];

  return {
    id: h.id,
    name: h.name,
    lebenszyklusPhase: h.lebenszyklusPhase,
    wertKategorie: h.wertKategorie,
    rahmung: h.rahmung,
    quantifizierbar: h.quantifizierbar,
    taetigkeiten: h.taetigkeiten,
    detailFragen: h.detailFragen,
    nutzenAussage: h.nutzenAussage ?? '',
    playbookLink: h.playbookLink,
    videoLink: h.videoLink,
    kartenText: h.kartenText,
    faktorenRoh,
    ausgabeMin: h.berechnung ? String(h.berechnung.ausgabe.min) : '',
    ausgabeMax: h.berechnung ? String(h.berechnung.ausgabe.max) : '',
    ausgabeEinheit: h.berechnung?.einheit ?? '€ p.a.',
    rechenwegText: h.berechnung?.rechenwegText ?? '',
    formFehler: '',
  };
}

/**
 * CRUD-Editor für Hebel (§13.2).
 * Blockiert Punktwert-Eingabe für Formel-Ausgabe/Faktoren → erzwingt Spanne (min < max).
 * Verlangt bei qualitativem Hebel eine nutzenAussage.
 */
export function HebelEditor({ config, onAendern }: Props) {
  const [entwurf, setEntwurf] = useState<HebelEntwurf | null>(null);

  function setEntwurfFeld<K extends keyof HebelEntwurf>(feld: K, wert: HebelEntwurf[K]) {
    setEntwurf((e) => (e ? { ...e, [feld]: wert, formFehler: '' } : e));
  }

  function handleNeu() {
    setEntwurf(neuerEntwurf());
  }

  function handleBearbeiten(h: Hebel) {
    setEntwurf(entwurfAusHebel(h));
  }

  function handleAbbrechen() {
    setEntwurf(null);
  }

  function handleSpeichern() {
    if (!entwurf) return;

    if (!entwurf.name.trim()) {
      setEntwurf({ ...entwurf, formFehler: 'Name fehlt — bitte eingeben.' });
      return;
    }

    // Qualitativ: nutzenAussage Pflicht
    if (!entwurf.quantifizierbar && !entwurf.nutzenAussage.trim()) {
      setEntwurf({
        ...entwurf,
        formFehler: 'Qualitativer Hebel verlangt eine nutzenAussage (Pflicht).',
      });
      return;
    }

    // Quantifizierbar: Spannen-Zwang (min < max)
    if (entwurf.quantifizierbar) {
      const outMin = parseFloat(entwurf.ausgabeMin);
      const outMax = parseFloat(entwurf.ausgabeMax);
      if (isNaN(outMin) || isNaN(outMax)) {
        setEntwurf({ ...entwurf, formFehler: 'Ausgabe-Spanne: Min und Max müssen Zahlen sein.' });
        return;
      }
      if (outMin >= outMax) {
        setEntwurf({
          ...entwurf,
          formFehler:
            'Spannen-Zwang: min < max erforderlich — kein Punktwert erlaubt (§7/§17).',
        });
        return;
      }

      for (const f of entwurf.faktorenRoh) {
        if (!f.key.trim()) continue;
        const fMin = parseFloat(f.min);
        const fMax = parseFloat(f.max);
        if (isNaN(fMin) || isNaN(fMax) || fMin >= fMax) {
          setEntwurf({
            ...entwurf,
            formFehler: `Faktor „${f.key}": Spanne min < max erforderlich — kein Punktwert (§7).`,
          });
          return;
        }
      }
    }

    const faktoren: Record<string, { min: number; max: number }> = {};
    for (const f of entwurf.faktorenRoh) {
      if (f.key.trim()) {
        faktoren[f.key] = { min: parseFloat(f.min), max: parseFloat(f.max) };
      }
    }

    const hebelGespeichert: Hebel = {
      id: entwurf.id,
      name: entwurf.name,
      lebenszyklusPhase: entwurf.lebenszyklusPhase,
      wertKategorie: entwurf.wertKategorie,
      rahmung: entwurf.rahmung,
      quantifizierbar: entwurf.quantifizierbar,
      taetigkeiten: entwurf.taetigkeiten,
      detailFragen: entwurf.detailFragen,
      playbookLink: entwurf.playbookLink,
      kartenText: entwurf.kartenText,
      ...(entwurf.videoLink ? { videoLink: entwurf.videoLink } : {}),
      ...(entwurf.quantifizierbar
        ? {
            berechnung: {
              inputs: entwurf.detailFragen.length > 0 ? entwurf.detailFragen : ['input'],
              faktoren,
              ausgabe: {
                min: parseFloat(entwurf.ausgabeMin),
                max: parseFloat(entwurf.ausgabeMax),
              },
              einheit: entwurf.ausgabeEinheit,
              rechenwegText: entwurf.rechenwegText,
            },
          }
        : { nutzenAussage: entwurf.nutzenAussage }),
    };

    const bestehend = config.hebel.find((h) => h.id === hebelGespeichert.id);
    const neueHebel = bestehend
      ? config.hebel.map((h) => (h.id === hebelGespeichert.id ? hebelGespeichert : h))
      : [...config.hebel, hebelGespeichert];

    onAendern({ ...config, hebel: neueHebel });
    setEntwurf(null);
  }

  function handleLoeschen(id: string) {
    onAendern({ ...config, hebel: config.hebel.filter((h) => h.id !== id) });
    if (entwurf?.id === id) setEntwurf(null);
  }

  return (
    <div>
      <h2>Hebel</h2>
      <button onClick={handleNeu} aria-label="Neu anlegen">
        Neu anlegen
      </button>

      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Name</th>
            <th style={{ textAlign: 'left' }}>Phase</th>
            <th style={{ textAlign: 'left' }}>Kategorie</th>
            <th style={{ textAlign: 'left' }}>Typ</th>
            <th style={{ textAlign: 'left' }}>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {config.hebel.map((h) => (
            <tr key={h.id}>
              <td>{h.name}</td>
              <td>{h.lebenszyklusPhase}</td>
              <td>{h.wertKategorie}</td>
              <td>{h.quantifizierbar ? 'quantifizierbar' : 'qualitativ'}</td>
              <td style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleBearbeiten(h)}>Bearbeiten</button>
                <button onClick={() => handleLoeschen(h.id)}>Löschen</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {entwurf && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h3>Hebel bearbeiten</h3>

          {entwurf.formFehler && (
            <p role="alert" style={{ color: 'red' }}>
              {entwurf.formFehler}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label>
              Name
              <input
                type="text"
                value={entwurf.name}
                onChange={(e) => setEntwurfFeld('name', e.target.value)}
                style={{ display: 'block', width: '100%' }}
              />
            </label>

            <label>
              Lebenszyklus-Phase
              <select
                value={entwurf.lebenszyklusPhase}
                onChange={(e) => setEntwurfFeld('lebenszyklusPhase', parseInt(e.target.value))}
                style={{ display: 'block' }}
              >
                {config.phasen.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} — {p.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Wert-Kategorie
              <select
                value={entwurf.wertKategorie}
                onChange={(e) =>
                  setEntwurfFeld('wertKategorie', e.target.value as typeof WERT_KATEGORIEN[number])
                }
                style={{ display: 'block' }}
              >
                {WERT_KATEGORIEN.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Rahmung
              <select
                value={entwurf.rahmung}
                onChange={(e) =>
                  setEntwurfFeld('rahmung', e.target.value as typeof RAHMUNGEN[number])
                }
                style={{ display: 'block' }}
              >
                {RAHMUNGEN.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <fieldset>
              <legend>Typ</legend>
              <label>
                <input
                  type="radio"
                  name="quantifizierbar"
                  value="qualitativ"
                  checked={!entwurf.quantifizierbar}
                  onChange={() => setEntwurfFeld('quantifizierbar', false)}
                />
                {' '}Qualitativ (nicht quantifizierbar)
              </label>
              <label style={{ marginLeft: '1rem' }}>
                <input
                  type="radio"
                  name="quantifizierbar"
                  value="quantifizierbar"
                  checked={entwurf.quantifizierbar}
                  onChange={() => setEntwurfFeld('quantifizierbar', true)}
                />
                {' '}Quantifizierbar (Euro-Spanne)
              </label>
            </fieldset>

            <fieldset>
              <legend>Tätigkeiten</legend>
              {TAETIGKEITEN.map((t) => (
                <label key={t} style={{ marginRight: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={entwurf.taetigkeiten.includes(t)}
                    onChange={(e) => {
                      const aktuelle = entwurf.taetigkeiten;
                      const neu = e.target.checked
                        ? ([...aktuelle, t] as typeof TAETIGKEITEN[number][])
                        : aktuelle.filter((x) => x !== t);
                      setEntwurfFeld('taetigkeiten', neu);
                    }}
                  />
                  {' '}{t}
                </label>
              ))}
            </fieldset>

            {/* Qualitativ: nutzenAussage Pflicht */}
            {!entwurf.quantifizierbar && (
              <label>
                nutzenAussage (Pflicht bei qualitativem Hebel)
                <textarea
                  value={entwurf.nutzenAussage}
                  placeholder="Nutzen-Aussage (qualitativ, kein Euro)"
                  onChange={(e) => setEntwurfFeld('nutzenAussage', e.target.value)}
                  style={{ display: 'block', width: '100%', minHeight: '3rem' }}
                  aria-label="nutzenAussage"
                />
              </label>
            )}

            {/* Quantifizierbar: Formel-Felder — Spannen-Zwang erzwungen */}
            {entwurf.quantifizierbar && (
              <fieldset>
                <legend>Formel — Spannen-Zwang (min &lt; max, kein Punktwert §7)</legend>

                <p style={{ fontSize: '0.85em', color: '#666' }}>
                  Spanne: min &lt; max erforderlich — kein Punktwert erlaubt.
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                  <label>
                    Ausgabe min
                    <input
                      type="number"
                      aria-label="Ausgabe min"
                      value={entwurf.ausgabeMin}
                      onChange={(e) => setEntwurfFeld('ausgabeMin', e.target.value)}
                    />
                  </label>
                  <label>
                    Ausgabe max
                    <input
                      type="number"
                      aria-label="Ausgabe max"
                      value={entwurf.ausgabeMax}
                      onChange={(e) => setEntwurfFeld('ausgabeMax', e.target.value)}
                    />
                  </label>
                  <label>
                    Einheit
                    <input
                      type="text"
                      value={entwurf.ausgabeEinheit}
                      onChange={(e) => setEntwurfFeld('ausgabeEinheit', e.target.value)}
                    />
                  </label>
                </div>

                <label>
                  Rechenweg-Text
                  <input
                    type="text"
                    value={entwurf.rechenwegText}
                    onChange={(e) => setEntwurfFeld('rechenwegText', e.target.value)}
                    style={{ display: 'block', width: '100%' }}
                  />
                </label>

                <div style={{ marginTop: '0.75rem' }}>
                  <strong>Benchmark-Faktoren (je als Spanne min &lt; max)</strong>
                  {entwurf.faktorenRoh.map((f, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <input
                        type="text"
                        placeholder="Faktor-Schlüssel"
                        value={f.key}
                        onChange={(e) => {
                          const neu = entwurf.faktorenRoh.map((x, i) =>
                            i === idx ? { ...x, key: e.target.value } : x,
                          );
                          setEntwurfFeld('faktorenRoh', neu);
                        }}
                      />
                      <label>
                        min
                        <input
                          type="number"
                          aria-label={`Faktor ${idx + 1} min`}
                          value={f.min}
                          onChange={(e) => {
                            const neu = entwurf.faktorenRoh.map((x, i) =>
                              i === idx ? { ...x, min: e.target.value } : x,
                            );
                            setEntwurfFeld('faktorenRoh', neu);
                          }}
                        />
                      </label>
                      <label>
                        max
                        <input
                          type="number"
                          aria-label={`Faktor ${idx + 1} max`}
                          value={f.max}
                          onChange={(e) => {
                            const neu = entwurf.faktorenRoh.map((x, i) =>
                              i === idx ? { ...x, max: e.target.value } : x,
                            );
                            setEntwurfFeld('faktorenRoh', neu);
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const neu = entwurf.faktorenRoh.filter((_, i) => i !== idx);
                          setEntwurfFeld('faktorenRoh', neu.length > 0 ? neu : [{ key: '', min: '', max: '' }]);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setEntwurfFeld('faktorenRoh', [
                        ...entwurf.faktorenRoh,
                        { key: '', min: '', max: '' },
                      ])
                    }
                    style={{ marginTop: '0.25rem' }}
                  >
                    + Faktor
                  </button>
                </div>
              </fieldset>
            )}

            <label>
              Playbook-Link
              <input
                type="text"
                value={entwurf.playbookLink}
                onChange={(e) => setEntwurfFeld('playbookLink', e.target.value)}
                style={{ display: 'block', width: '100%' }}
              />
            </label>

            <label>
              Karten-Text
              <input
                type="text"
                value={entwurf.kartenText}
                onChange={(e) => setEntwurfFeld('kartenText', e.target.value)}
                style={{ display: 'block', width: '100%' }}
              />
            </label>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleSpeichern}>Speichern</button>
            <button onClick={handleAbbrechen}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
}
