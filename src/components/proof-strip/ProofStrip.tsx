import { checkConfig, copy } from '@/config/checkConfig';

/**
 * ProofStrip (PRD §9.2 #4) — kompakt: bis zu 3 Mini-Findings + Founder-Micro.
 * Nur publicApproved Findings (aus check.config.json). Feature-Flag proofBandEnabled (G1):
 * ohne approved Findings bleibt der Strip AUS (und L2 ist blockiert). Keine erfundenen Zahlen.
 */
export function ProofStrip() {
  const aktiv = checkConfig.settings.proofBandEnabled && checkConfig.proofFindings.length > 0;
  if (!aktiv) return null;

  const findings = checkConfig.proofFindings.slice(0, 3) as Array<{
    title: string;
    valueMin: number | null;
    valueMax: number | null;
    realizedValue: number | null;
  }>;

  return (
    <div
      data-testid="proof-strip"
      style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      {findings.map((f) => (
        <div key={f.title} data-testid="proof-finding" style={{ flex: '1 1 180px' }}>
          {f.realizedValue != null ? (
            <strong>{f.realizedValue.toLocaleString('de-DE')} € realisiert</strong>
          ) : (
            f.valueMin != null &&
            f.valueMax != null && (
              <strong>
                {f.valueMin.toLocaleString('de-DE')}–{f.valueMax.toLocaleString('de-DE')} €
              </strong>
            )
          )}
          <div style={{ fontSize: '0.85rem', color: '#555' }}>{f.title}</div>
        </div>
      ))}
      <p
        data-testid="founder-micro"
        style={{ flex: '1 1 240px', fontSize: '0.85rem', fontStyle: 'italic' }}
      >
        {copy('copy.founderMicro')}
      </p>
    </div>
  );
}
