interface FortschrittsbalkenProps {
  analysiert: number;
  gesamt: number;
}

/**
 * Fortschrittsbalken „x von y relevanten Bereichen analysiert" (§8.4, Zeigarnik-Effekt).
 * Nutzt die Werte aus fortschritt() direkt als Props.
 */
export function Fortschrittsbalken({ analysiert, gesamt }: FortschrittsbalkenProps) {
  const anteil = gesamt === 0 ? 0 : analysiert / gesamt;

  return (
    <div
      style={{
        margin: '1rem 0',
        padding: '0.75rem 1rem',
        background: 'var(--farbe-flaeche, #f5f5f5)',
        borderRadius: 'var(--radius, 4px)',
      }}
    >
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: 'var(--farbe-text-leise, #666)' }}>
        {analysiert} von {gesamt} relevanten Bereichen analysiert
      </p>
      <div
        role="progressbar"
        aria-valuenow={analysiert}
        aria-valuemin={0}
        aria-valuemax={gesamt}
        style={{
          height: '6px',
          background: 'var(--farbe-linie, #e0e0e0)',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${anteil * 100}%`,
            background: 'var(--farbe-akzent, #b8860b)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}
