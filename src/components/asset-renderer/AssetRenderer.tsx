import { useState } from 'react';
import type { AssetCfg } from '@/config/checkConfig';

/**
 * AssetRenderer (PRD §11.1 Block 6): rendert einen Baustein je Typ.
 * PromptBlock: Copy-Button + Pflicht-Datenschutzhinweis + benötigte Eingaben.
 * Guide/Checklist/Example/Warning: Textinhalt. Video: Verweis.
 * Extern heißt es immer Asset/Baustein.
 */
const DATENSCHUTZ_HINWEIS =
  'Entfernen Sie vor der Nutzung Namen und Anschriften — für die Auswertung sind sie unnötig. Ihre Daten bleiben bei Ihnen.';

function copyToClipboard(text: string): void {
  try {
    void navigator?.clipboard?.writeText?.(text);
  } catch {
    /* Clipboard nicht verfügbar (z. B. Test/Server) — bewusst ignoriert */
  }
}

export function AssetRenderer({ asset }: { asset: AssetCfg }) {
  const [kopiert, setKopiert] = useState(false);

  if (asset.assetType === 'prompt') {
    return (
      <div data-testid={`asset-prompt-${asset.slug}`} style={blockStyle}>
        <strong>{asset.title}</strong>
        <p style={{ margin: '0.25rem 0', color: '#555' }}>{asset.summary}</p>
        {asset.requiredInputs && (
          <p data-testid="prompt-inputs" style={{ fontSize: '0.9rem' }}>
            <em>Benötigte Eingaben:</em> {asset.requiredInputs}
          </p>
        )}
        <pre
          data-testid="prompt-text"
          style={{
            whiteSpace: 'pre-wrap',
            background: '#f6f6f4',
            padding: '0.75rem',
            borderRadius: 6,
          }}
        >
          {asset.promptText}
        </pre>
        {/* Pflicht-Datenschutzhinweis (§11.1) */}
        <p data-testid="prompt-datenschutz" style={{ fontSize: '0.85rem', color: '#a15c00' }}>
          {DATENSCHUTZ_HINWEIS}
        </p>
        {asset.copyable && (
          <button
            type="button"
            data-testid={`copy-${asset.slug}`}
            onClick={() => {
              copyToClipboard(asset.promptText ?? '');
              setKopiert(true);
            }}
            style={buttonStyle}
          >
            {kopiert ? 'Kopiert' : 'Prompt kopieren'}
          </button>
        )}
      </div>
    );
  }

  if (asset.assetType === 'video') {
    return (
      <div data-testid={`asset-video-${asset.slug}`} style={blockStyle}>
        <strong>{asset.title}</strong>
        <p style={{ color: '#555' }}>{asset.summary}</p>
        {asset.videoUrl ? (
          <a href={asset.videoUrl}>Video ansehen</a>
        ) : (
          <span style={{ color: '#999' }}>Video folgt.</span>
        )}
      </div>
    );
  }

  // guide / checklist / example / warning / template
  return (
    <div data-testid={`asset-${asset.assetType}-${asset.slug}`} style={blockStyle}>
      <strong>{asset.title}</strong>
      <p style={{ color: '#555' }}>{asset.summary}</p>
      {asset.bodyText && <p style={{ whiteSpace: 'pre-wrap' }}>{asset.bodyText}</p>}
    </div>
  );
}

const blockStyle: React.CSSProperties = {
  border: '1px solid var(--farbe-linie, #eee)',
  borderRadius: 8,
  padding: '0.9rem',
  marginTop: '0.6rem',
};
const buttonStyle: React.CSSProperties = {
  border: '1px solid var(--farbe-akzent, #b8860b)',
  borderRadius: 8,
  padding: '0.5rem 0.9rem',
  background: 'transparent',
  cursor: 'pointer',
};
