import { useCallback, useState } from 'react';
import { useGlyphStore, useMetadataStore, useKerningStore, useUIStore } from '../store';
import { buildFont, exportFontToArrayBuffer, createFontPackage, downloadBlob } from '../services';
import { validateFontName, validateGlyphCount } from '../utils';
import type { ExportOptions, ExportProgress } from '../types';

export function useFontGeneration() {
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const glyphs = useGlyphStore((s) => s.glyphs);
  const metadata = useMetadataStore((s) => s.metadata);
  const metrics = useMetadataStore((s) => s.metrics);
  const pairs = useKerningStore((s) => s.pairs);
  const addToast = useUIStore((s) => s.addToast);

  const exportFont = useCallback(async (options: ExportOptions) => {
    // Validate
    const nameValidation = validateFontName(metadata.familyName);
    if (!nameValidation.valid) {
      addToast('error', nameValidation.error!);
      return;
    }

    const glyphValidation = validateGlyphCount(glyphs.size);
    if (!glyphValidation.valid) {
      addToast('error', glyphValidation.error!);
      return;
    }

    setIsExporting(true);

    try {
      // Stage 1: Preparing
      setProgress({
        stage: 'preparing',
        progress: 10,
        message: 'Preparing glyphs...',
      });

      await new Promise((r) => setTimeout(r, 100));

      // Stage 2: Building font
      setProgress({
        stage: 'building',
        progress: 30,
        message: 'Building font...',
      });

      const font = buildFont({
        glyphs,
        metadata,
        metrics,
        kerningPairs: pairs,
      });

      await new Promise((r) => setTimeout(r, 100));

      // Stage 3: Generating files
      setProgress({
        stage: 'generating',
        progress: 60,
        message: 'Generating font files...',
      });

      const ttfBuffer = exportFontToArrayBuffer(font);

      await new Promise((r) => setTimeout(r, 100));

      // Stage 4: Packaging
      setProgress({
        stage: 'packaging',
        progress: 80,
        message: 'Creating package...',
      });

      const zipBlob = await createFontPackage(ttfBuffer, metadata, options);

      // Stage 5: Complete
      setProgress({
        stage: 'complete',
        progress: 100,
        message: 'Download ready!',
      });

      // Download
      const zipName = options.zipName || `${metadata.familyName.replace(/[^a-zA-Z0-9]/g, '-')}-font`;
      downloadBlob(zipBlob, `${zipName}.zip`);

      addToast('success', 'Font exported successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      addToast('error', message);
    } finally {
      setIsExporting(false);
      setTimeout(() => setProgress(null), 2000);
    }
  }, [glyphs, metadata, metrics, pairs, addToast]);

  return { exportFont, progress, isExporting };
}
