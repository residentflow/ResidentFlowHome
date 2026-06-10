import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AssetRenderer } from '@/components/asset-renderer/AssetRenderer';
import { problemBySlug } from '@/config/checkConfig';

const problem = problemBySlug('mieten-indexmieten-pruefen')!;
const promptAsset = problem.solutions
  .flatMap((s) => s.assets)
  .find((a) => a.assetType === 'prompt')!;

describe('AssetRenderer (§11.1)', () => {
  afterEach(() => vi.restoreAllMocks());

  it('PromptBlock zeigt Prompt-Text, benötigte Eingaben und den Pflicht-Datenschutzhinweis', () => {
    render(<AssetRenderer asset={promptAsset} />);
    expect(screen.getByTestId('prompt-text')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-inputs')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-datenschutz')).toBeInTheDocument();
  });

  it('Copy-Button kopiert und wechselt das Label auf "Kopiert"', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    render(<AssetRenderer asset={promptAsset} />);
    const btn = screen.getByTestId(`copy-${promptAsset.slug}`);
    expect(btn).toHaveTextContent('Prompt kopieren');
    fireEvent.click(btn);
    expect(writeText).toHaveBeenCalledWith(promptAsset.promptText);
    expect(btn).toHaveTextContent('Kopiert');
  });
});
