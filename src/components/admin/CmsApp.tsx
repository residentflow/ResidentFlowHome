import { useState } from 'react';
import type { Config } from '@/domain/schema/config';
import { schatzsucheConfig } from '@/content/schatzsuche.config';
import { exportConfig, importConfig } from '@/services/config-io';
import { ProblemEditor } from './ProblemEditor';
import { LoesungEditor } from './LoesungEditor';
import { MappingEditor } from './MappingEditor';
import { BenchmarkEditor } from './BenchmarkEditor';
import { SegmentEditor } from './SegmentEditor';
import { Vorschau } from './Vorschau';

type Tab = 'probleme' | 'loesung' | 'mapping' | 'benchmark' | 'segmente' | 'vorschau';

const TABS: { id: Tab; label: string }[] = [
  { id: 'probleme', label: 'Probleme' },
  { id: 'loesung', label: 'Loesung' },
  { id: 'mapping', label: 'Mapping' },
  { id: 'benchmark', label: 'Benchmark' },
  { id: 'segmente', label: 'Segmente' },
  { id: 'vorschau', label: 'Vorschau' },
];

/**
 * CMS-Rahmen (§13) — nur lokal/Dev erreichbar, kein Login nötig.
 * Tab-Navigation über alle Editoren.
 */
export function CmsApp() {
  const [config, setConfig] = useState<Config>(() => JSON.parse(JSON.stringify(schatzsucheConfig)));
  const [aktuellerTab, setAktuellerTab] = useState<Tab>('probleme');
  const [exportFehler, setExportFehler] = useState('');
  const [importFehler, setImportFehler] = useState('');

  function handleExport() {
    try {
      const json = exportConfig(config);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'schatzsuche.config.json';
      a.click();
      URL.revokeObjectURL(url);
      setExportFehler('');
    } catch {
      setExportFehler('Export fehlgeschlagen.');
    }
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const neu = importConfig(ev.target?.result as string);
        setConfig(neu);
        setImportFehler('');
      } catch {
        setImportFehler('Import fehlgeschlagen: ungültige Config.');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div style={{ fontFamily: 'inherit', padding: '1.5rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Schatzsuche-CMS</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAktuellerTab(tab.id)}
            style={{
              padding: '0.4rem 1rem',
              fontWeight: aktuellerTab === tab.id ? 700 : 400,
              borderBottom:
                aktuellerTab === tab.id ? '2px solid currentColor' : '2px solid transparent',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-current={aktuellerTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button onClick={handleExport} style={{ cursor: 'pointer' }}>
          JSON exportieren
        </button>
        <label>
          JSON importieren
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
        {exportFehler && <span style={{ color: 'red' }}>{exportFehler}</span>}
        {importFehler && <span style={{ color: 'red' }}>{importFehler}</span>}
      </div>

      <hr />

      {aktuellerTab === 'probleme' && <ProblemEditor config={config} onAendern={setConfig} />}
      {aktuellerTab === 'loesung' && <LoesungEditor config={config} onAendern={setConfig} />}
      {aktuellerTab === 'mapping' && <MappingEditor config={config} onAendern={setConfig} />}
      {aktuellerTab === 'benchmark' && <BenchmarkEditor config={config} onAendern={setConfig} />}
      {aktuellerTab === 'segmente' && <SegmentEditor config={config} onAendern={setConfig} />}
      {aktuellerTab === 'vorschau' && <Vorschau config={config} />}
    </div>
  );
}
