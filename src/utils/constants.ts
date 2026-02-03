// Font Constants
export const UNITS_PER_EM = 1000;
export const DEFAULT_ASCENDER = 800;
export const DEFAULT_DESCENDER = -200;
export const DEFAULT_CAP_HEIGHT = 700;
export const DEFAULT_X_HEIGHT = 500;
export const DEFAULT_LINE_GAP = 0;

// Spacing Constants (for exported font)
// Based on typography research: 1000 UPM standard values
export const DEFAULT_LETTER_SPACING = 0;
export const MIN_LETTER_SPACING = -200;  // Tight/monospace fonts
export const MAX_LETTER_SPACING = 200;   // Looser for display/all-caps

export const DEFAULT_WORD_SPACING = 250; // Standard: 1/4 em
export const MIN_WORD_SPACING = 50;      // Very tight spacing
export const MAX_WORD_SPACING = 500;     // Maximum: 1/2 em (en space)

// Minimum advance width - set to 0 to allow natural glyph widths
// User controls spacing via letter spacing setting instead
export const MIN_ADVANCE_WIDTH = 0;

// Default sidebearing as percentage of UPM
export const DEFAULT_LSB_PERCENT = 0.02; // 2% of UPM = 20 units

// Kerning Constants
export const KERNING_MIN = -200;
export const KERNING_MAX = 200;
export const DEFAULT_SPACE_WIDTH = 250;

// UI Constants
export const GLYPH_GRID_SIZE = 80;
export const PREVIEW_DEFAULT_SIZE = 48;
export const PREVIEW_MIN_SIZE = 12;
export const PREVIEW_MAX_SIZE = 200;

// Validation
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_EXTENSIONS = ['.svg'];

// Default Metadata
export const DEFAULT_FONT_METADATA = {
  familyName: '',
  styleName: 'Regular',
  version: '1.000',
  author: '',
  description: '',
  license: 'OFL' as const,
  customLicense: '',
  copyright: '',
  manufacturerUrl: '',
  designerUrl: '',
};
