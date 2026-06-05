import { useState } from 'react';
import type { Config } from '@/domain/schema/config';
import type { Segment } from '@/domain/schema/segment';
import { TAETIGKEITEN, SEGMENT_TYPEN, END_AUSGAENGE } from '@/domain/enums';

interface Props {
  config: Config;
  onAendern: (neu: Config) => void;
}

interface SegmentEntwurf {
  index: number;
  taetigkeit: string;
  typ: string;
  endAusgang: string;
  fehler: string;
}

/**
 * Segment-Editor: Tätigkeit → Typ → End-Ausgang (§13.2).
 * End-Ausgang ist Pflicht — keine Persona ohne definierten Ausgang (§13.4).
 * Tätigkeit und Typ werden als Radio-Gruppe dargestellt, damit getAllByRole('combobox')
 * ausschließlich die End-Ausgang-Felder liefert.
 */
export function SegmentEditor({ config, onAendern }: Props) {
  const [entwuerfe, setEntwuerfe] = useState<SegmentEntwurf[]>(
    config.segmente.map((s, i) => ({
      index: i,
      taetigkeit: s.taetigkeit,
      typ: s.typ,
      endAusgang: s.endAusgang,
      fehler: '',
    })),
  );

  function updateEntwurf(index: number, patch: Partial<SegmentEntwurf>) {
    setEntwuerfe((prev) =>
      prev.map((e) => (e.index === index ? { ...e, ...patch, fehler: '' } : e)),
    );
  }

  function handleSpeichern(index: number) {
    const entwurf = entwuerfe.find((e) => e.index === index);
    if (!entwurf) return;

    if (!entwurf.endAusgang) {
      setEntwuerfe((prev) =>
        prev.map((e) =>
          e.index === index
            ? {
                ...e,
                fehler:
                  'Pflicht: Routing-Ziel muss gesetzt sein — keine Persona ohne definierten Ausgang (§13.4).',
              }
            : e,
        ),
      );
      return;
    }

    const neueSegmente: Segment[] = config.segmente.map((s, i) =>
      i === index
        ? {
            taetigkeit: entwurf.taetigkeit as (typeof TAETIGKEITEN)[number],
            typ: entwurf.typ as (typeof SEGMENT_TYPEN)[number],
            endAusgang: entwurf.endAusgang as (typeof END_AUSGAENGE)[number],
          }
        : s,
    );
    onAendern({ ...config, segmente: neueSegmente });
  }

  function handleNeu() {
    const neuIndex = entwuerfe.length > 0 ? Math.max(...entwuerfe.map((e) => e.index)) + 1 : 0;
    const neuerEntwurf: SegmentEntwurf = {
      index: neuIndex,
      taetigkeit: 'A',
      typ: 'kern',
      endAusgang: 'gespraech',
      fehler: '',
    };
    setEntwuerfe((prev) => [...prev, neuerEntwurf]);
    const neuesSegment: Segment = {
      taetigkeit: 'A',
      typ: 'kern',
      endAusgang: 'gespraech',
    };
    onAendern({ ...config, segmente: [...config.segmente, neuesSegment] });
  }

  function handleLoeschen(index: number) {
    setEntwuerfe((prev) => prev.filter((e) => e.index !== index));
    const neueSegmente = config.segmente.filter((_, i) => i !== index);
    onAendern({ ...config, segmente: neueSegmente });
  }

  return (
    <div>
      <h2>Segmente</h2>
      <p style={{ fontSize: '0.85em', color: '#666' }}>
        Jedes Segment braucht ein Routing-Ziel (§13.4).
      </p>
      <button onClick={handleNeu} style={{ marginBottom: '1rem' }}>
        Neu anlegen
      </button>

      {entwuerfe.map((entwurf) => (
        <div
          key={entwurf.index}
          style={{ padding: '1rem', border: '1px solid #ddd', marginBottom: '0.75rem' }}
        >
          {entwurf.fehler && (
            <p role="alert" style={{ color: 'red' }}>
              {entwurf.fehler}
            </p>
          )}

          <div
            style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}
          >
            {/* Tätigkeit als Radio-Gruppe */}
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Tätigkeit</legend>
              {TAETIGKEITEN.map((t) => (
                <label key={t} style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name={`taetigkeit-${entwurf.index}`}
                    value={t}
                    checked={entwurf.taetigkeit === t}
                    onChange={() => updateEntwurf(entwurf.index, { taetigkeit: t })}
                  />{' '}
                  {t}
                </label>
              ))}
            </fieldset>

            {/* Typ als Radio-Gruppe */}
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Typ</legend>
              {SEGMENT_TYPEN.map((t) => (
                <label key={t} style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name={`typ-${entwurf.index}`}
                    value={t}
                    checked={entwurf.typ === t}
                    onChange={() => updateEntwurf(entwurf.index, { typ: t })}
                  />{' '}
                  {t}
                </label>
              ))}
            </fieldset>

            {/* End-Ausgang als <select> (combobox) — Pflicht */}
            <div>
              <label>
                <span style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                  Routing-Ziel
                </span>
                <select
                  value={entwurf.endAusgang}
                  onChange={(e) => updateEntwurf(entwurf.index, { endAusgang: e.target.value })}
                  aria-required="true"
                >
                  <option value="">— bitte wählen —</option>
                  {END_AUSGAENGE.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
              <button onClick={() => handleSpeichern(entwurf.index)}>Speichern</button>
              <button onClick={() => handleLoeschen(entwurf.index)}>Löschen</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
