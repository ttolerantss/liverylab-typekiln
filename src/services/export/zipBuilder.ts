import JSZip from 'jszip';
import type { FontMetadata, ExportOptions } from '../../types';

export async function createFontPackage(
  ttfBuffer: ArrayBuffer,
  metadata: FontMetadata,
  options: ExportOptions
): Promise<Blob> {
  const zip = new JSZip();

  const safeName = metadata.familyName.replace(/[^a-zA-Z0-9]/g, '-');

  // Add TTF file
  if (options.formats.includes('ttf')) {
    zip.file(`${safeName}.ttf`, ttfBuffer);
  }

  // Add OTF file (same buffer, different extension for TrueType-based OTF)
  if (options.formats.includes('otf')) {
    zip.file(`${safeName}.otf`, ttfBuffer);
  }

  // Add README if requested
  if (options.includeReadme) {
    const readme = generateReadme(metadata);
    zip.file('README.txt', readme);
  }

  // Generate the zip file
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  return blob;
}

function generateReadme(metadata: FontMetadata): string {
  const lines = [
    `${metadata.familyName}`,
    '='.repeat(metadata.familyName.length),
    '',
    `Style: ${metadata.styleName}`,
    `Version: ${metadata.version}`,
  ];

  if (metadata.author) {
    lines.push(`Author: ${metadata.author}`);
  }

  if (metadata.description) {
    lines.push('', 'Description:', metadata.description);
  }

  lines.push('', '---', '', 'Installation:', '');
  lines.push('Windows: Right-click the font file and select "Install"');
  lines.push('macOS: Double-click the font file and click "Install Font"');
  lines.push('Linux: Copy to ~/.fonts or /usr/share/fonts');

  if (metadata.license !== 'Custom') {
    lines.push('', '---', '', `License: ${metadata.license}`);
  }

  if (metadata.copyright) {
    lines.push('', metadata.copyright);
  }

  lines.push('', '---', '', 'Created with Font Builder');

  return lines.join('\n');
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
