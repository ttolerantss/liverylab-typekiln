import { useCallback } from 'react';
import { useUploadStore, useGlyphStore, useUIStore, useMetadataStore } from '../store';
import { parseSVGContent } from '../services';
import { validateSVGFile, validateSVGContent, getCharacterUnicode } from '../utils';
import type { Glyph } from '../types';

export function useFileUpload() {
  const addFiles = useUploadStore((s) => s.addFiles);
  const updateFileStatus = useUploadStore((s) => s.updateFileStatus);
  const updateFileContent = useUploadStore((s) => s.updateFileContent);
  const addParsedSVG = useUploadStore((s) => s.addParsedSVG);
  const setProcessing = useUploadStore((s) => s.setProcessing);
  const setProgress = useUploadStore((s) => s.setProgress);
  const files = useUploadStore((s) => s.files);

  const addGlyph = useGlyphStore((s) => s.addGlyph);
  const assignCharacter = useGlyphStore((s) => s.assignCharacter);
  const initializeMappings = useGlyphStore((s) => s.initializeMappings);

  const addToast = useUIStore((s) => s.addToast);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    const fileArray = Array.from(fileList);
    const validFiles: File[] = [];

    // Validate files
    for (const file of fileArray) {
      const result = validateSVGFile(file);
      if (result.valid) {
        validFiles.push(file);
      } else {
        addToast('error', `${file.name}: ${result.error}`);
      }
    }

    if (validFiles.length === 0) return;

    // Initialize character mappings if not already done
    initializeMappings();

    // Add files to store
    addFiles(validFiles);

    setProcessing(true);
    setProgress(0);

    const currentFiles = useUploadStore.getState().files;
    const newFileIds = currentFiles.slice(-validFiles.length).map((f) => f.id);

    let processed = 0;
    const total = validFiles.length;

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const fileId = newFileIds[i];

      try {
        updateFileStatus(fileId, 'parsing');

        // Read file content
        const content = await file.text();
        updateFileContent(fileId, content);

        // Validate SVG content
        const contentValidation = validateSVGContent(content);
        if (!contentValidation.valid) {
          throw new Error(contentValidation.error);
        }

        // Parse SVG
        const parsed = parseSVGContent(fileId, file.name, content);
        addParsedSVG(parsed);

        // Create glyph from parsed SVG
        // Calculate advance width in font units based on glyph proportions
        const metrics = useMetadataStore.getState().metrics;
        const glyphHeight = parsed.bounds.height || 1;
        const glyphWidth = parsed.bounds.width || 1;
        const desiredHeight = metrics.ascender * 0.85;
        const scale = desiredHeight / glyphHeight;
        const scaledWidth = glyphWidth * scale;
        // Use proportional sidebearing (5% of glyph width, not fixed UPM percentage)
        // This keeps spacing proportional for narrow glyphs like I, 1, l
        const sidebearing = Math.round(scaledWidth * 0.05);
        const leftSideBearing = sidebearing;
        const advanceWidth = Math.round(scaledWidth + sidebearing * 2);

        const glyph: Glyph = {
          id: parsed.id,
          character: parsed.detectedCharacter || '',
          unicode: parsed.detectedCharacter ? getCharacterUnicode(parsed.detectedCharacter) : 0,
          name: parsed.detectedCharacter || file.name.replace('.svg', ''),
          paths: parsed.paths,
          originalBounds: parsed.bounds,
          advanceWidth,
          leftSideBearing,
          sourceFileId: fileId,
          sourceFileName: file.name,
        };

        addGlyph(glyph);

        // Auto-assign character if detected
        if (parsed.detectedCharacter) {
          assignCharacter(glyph.id, parsed.detectedCharacter);
        }

        updateFileStatus(fileId, 'parsed');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        updateFileStatus(fileId, 'error', message);
        addToast('error', `Failed to parse ${file.name}: ${message}`);
      }

      processed++;
      setProgress((processed / total) * 100);
    }

    setProcessing(false);
    addToast('success', `Processed ${processed} file${processed !== 1 ? 's' : ''}`);

    // Auto-navigate to mapping tab after upload completes
    setActiveTab('mapping');
  }, [
    addFiles, updateFileStatus, updateFileContent, addParsedSVG,
    setProcessing, setProgress, addGlyph, assignCharacter,
    initializeMappings, addToast, setActiveTab
  ]);

  return { processFiles, files };
}
