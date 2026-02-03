// Map descriptive names to characters
export const DESCRIPTIVE_NAMES: Record<string, string> = {
  // Punctuation
  'space': ' ',
  'exclamation': '!',
  'exclaim': '!',
  'quotedbl': '"',
  'doublequote': '"',
  'numbersign': '#',
  'hash': '#',
  'pound': '#',
  'dollar': '$',
  'percent': '%',
  'ampersand': '&',
  'and': '&',
  'quotesingle': "'",
  'apostrophe': "'",
  'parenleft': '(',
  'leftparen': '(',
  'parenright': ')',
  'rightparen': ')',
  'asterisk': '*',
  'star': '*',
  'plus': '+',
  'comma': ',',
  'hyphen': '-',
  'minus': '-',
  'dash': '-',
  'period': '.',
  'dot': '.',
  'fullstop': '.',
  'slash': '/',
  'forwardslash': '/',
  'colon': ':',
  'semicolon': ';',
  'less': '<',
  'lessthan': '<',
  'equal': '=',
  'equals': '=',
  'greater': '>',
  'greaterthan': '>',
  'question': '?',
  'questionmark': '?',
  'at': '@',
  'atsign': '@',
  'bracketleft': '[',
  'leftbracket': '[',
  'backslash': '\\',
  'bracketright': ']',
  'rightbracket': ']',
  'asciicircum': '^',
  'caret': '^',
  'circumflex': '^',
  'underscore': '_',
  'underline': '_',
  'grave': '`',
  'backtick': '`',
  'braceleft': '{',
  'leftbrace': '{',
  'leftcurly': '{',
  'bar': '|',
  'pipe': '|',
  'verticalbar': '|',
  'braceright': '}',
  'rightbrace': '}',
  'rightcurly': '}',
  'asciitilde': '~',
  'tilde': '~',

  // Numbers written as words
  'zero': '0',
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9',
};

// Map characters to display names
export const CHARACTER_DISPLAY_NAMES: Record<string, string> = {
  ' ': 'Space',
  '!': 'Exclamation',
  '"': 'Double Quote',
  '#': 'Hash',
  '$': 'Dollar',
  '%': 'Percent',
  '&': 'Ampersand',
  "'": 'Apostrophe',
  '(': 'Left Paren',
  ')': 'Right Paren',
  '*': 'Asterisk',
  '+': 'Plus',
  ',': 'Comma',
  '-': 'Hyphen',
  '.': 'Period',
  '/': 'Slash',
  ':': 'Colon',
  ';': 'Semicolon',
  '<': 'Less Than',
  '=': 'Equals',
  '>': 'Greater Than',
  '?': 'Question',
  '@': 'At Sign',
  '[': 'Left Bracket',
  '\\': 'Backslash',
  ']': 'Right Bracket',
  '^': 'Caret',
  '_': 'Underscore',
  '`': 'Backtick',
  '{': 'Left Brace',
  '|': 'Pipe',
  '}': 'Right Brace',
  '~': 'Tilde',
};

export function getDisplayName(char: string): string {
  if (CHARACTER_DISPLAY_NAMES[char]) {
    return CHARACTER_DISPLAY_NAMES[char];
  }
  return char;
}

export function detectCharacterFromFilename(filename: string): string | undefined {
  // Remove extension
  const baseName = filename.replace(/\.svg$/i, '');

  // Check if it's a single character (literal)
  if (baseName.length === 1) {
    return baseName;
  }

  // Check for uppercase/lowercase prefix pattern: "upper_A", "lower_a", "uppercase-B"
  const caseMatch = baseName.match(/^(upper|uppercase|lower|lowercase)[_-]?(.+)$/i);
  if (caseMatch) {
    const caseType = caseMatch[1].toLowerCase();
    const char = caseMatch[2];
    if (char.length === 1) {
      return caseType.startsWith('upper') ? char.toUpperCase() : char.toLowerCase();
    }
  }

  // Check descriptive names
  const normalized = baseName.toLowerCase().replace(/[_-]/g, '');
  if (DESCRIPTIVE_NAMES[normalized]) {
    return DESCRIPTIVE_NAMES[normalized];
  }

  // Check if filename ends with a single character after underscore or hyphen
  const suffixMatch = baseName.match(/[_-]([a-zA-Z0-9])$/);
  if (suffixMatch) {
    return suffixMatch[1];
  }

  return undefined;
}
