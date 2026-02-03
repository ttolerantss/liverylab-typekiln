// Standard ASCII printable characters (32-126)
export const FULL_CHARACTER_SET = [
  // Space
  ' ',
  // Punctuation & symbols (33-47)
  '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/',
  // Numbers (48-57)
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  // Symbols (58-64)
  ':', ';', '<', '=', '>', '?', '@',
  // Uppercase letters (65-90)
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  // Symbols (91-96)
  '[', '\\', ']', '^', '_', '`',
  // Lowercase letters (97-122)
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  // Symbols (123-126)
  '{', '|', '}', '~'
];

export const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
export const NUMBERS = '0123456789'.split('');
export const PUNCTUATION = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'.split('');

export const ASCENDER_CHARS = ['b', 'd', 'f', 'h', 'k', 'l', 't', ...UPPERCASE_LETTERS];
export const DESCENDER_CHARS = ['g', 'j', 'p', 'q', 'y'];
export const XHEIGHT_CHARS = ['a', 'c', 'e', 'm', 'n', 'o', 'r', 's', 'u', 'v', 'w', 'x', 'z'];

export function getCharacterUnicode(char: string): number {
  return char.charCodeAt(0);
}

export function getCharacterFromUnicode(unicode: number): string {
  return String.fromCharCode(unicode);
}

export function isUppercase(char: string): boolean {
  return UPPERCASE_LETTERS.includes(char);
}

export function isLowercase(char: string): boolean {
  return LOWERCASE_LETTERS.includes(char);
}

export function isLetter(char: string): boolean {
  return isUppercase(char) || isLowercase(char);
}

export function isNumber(char: string): boolean {
  return NUMBERS.includes(char);
}
