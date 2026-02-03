import { MAX_FILE_SIZE, ALLOWED_EXTENSIONS } from './constants';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateSVGFile(file: File): ValidationResult {
  // Check extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file type: ${extension}. Only SVG files are allowed.`
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 10MB.`
    };
  }

  return { valid: true };
}

export function validateFontName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      error: 'Font family name is required.'
    };
  }

  if (name.length > 63) {
    return {
      valid: false,
      error: 'Font family name must be 63 characters or less.'
    };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (invalidChars.test(name)) {
    return {
      valid: false,
      error: 'Font family name contains invalid characters.'
    };
  }

  return { valid: true };
}

export function validateGlyphCount(count: number): ValidationResult {
  if (count === 0) {
    return {
      valid: false,
      error: 'At least one glyph is required to export the font.'
    };
  }

  return { valid: true };
}

export function validateSVGContent(content: string): ValidationResult {
  // Check if it's valid XML/SVG
  if (!content.includes('<svg')) {
    return {
      valid: false,
      error: 'File does not appear to be a valid SVG.'
    };
  }

  // Check for paths
  if (!content.includes('<path') && !content.includes('<polygon') &&
      !content.includes('<rect') && !content.includes('<circle') &&
      !content.includes('<ellipse') && !content.includes('<line') &&
      !content.includes('<polyline')) {
    return {
      valid: false,
      error: 'SVG contains no drawable elements (paths, shapes).'
    };
  }

  return { valid: true };
}
