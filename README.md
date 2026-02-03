# TypeKiln

A web-based font creation tool that converts SVG files into usable TTF and OTF font files. Everything runs in your browser - no server uploads, no account required.

## What It Does

TypeKiln takes your glyph designs (as SVG files) and packages them into a working font. Upload your character designs, map them to the right characters, adjust spacing and kerning, then export a ready-to-use font file.

## How to Use

### 1. Upload

Drag and drop your SVG files onto the upload area, or click to browse. Each SVG should contain one glyph (letter, number, or symbol).

**Automatic character detection:** Name your files after the character they represent:
- Simple characters: `A.svg`, `B.svg`, `1.svg`
- Special characters: `period.svg`, `comma.svg`, `question.svg`, `ampersand.svg`

### 2. Mapping

Review and adjust character assignments. Click any glyph to change which character it represents. The coverage panel shows which characters in the standard set are mapped and which are missing.

### 3. Kerning

Fine-tune the spacing between specific character pairs (like AV, To, or WA). Use **Auto-Kern** to generate initial values based on glyph shapes, then manually adjust any pairs that need attention.

### 4. Preview

See how your font looks with real text. Adjust the preview size, colors, and spacing to test different scenarios.

### 5. Metadata

Set your font's name, version, author, and license information. The font family name is required for export.

### 6. Export

Generate your font files and download them as a ZIP package containing:
- TTF (TrueType) font file
- OTF (OpenType) font file
- README with font information

## SVG Preparation Tips

For best results when creating your glyph SVGs:

- **Expand strokes:** Convert all strokes to filled paths
- **Flatten transforms:** Apply all rotations, scales, and translations
- **Outline text:** Convert any text to paths
- **Use a consistent artboard:** Same dimensions for all glyphs helps with alignment
- **Keep it simple:** Avoid clipping masks, filters, or effects

## Supported Characters

TypeKiln supports the basic ASCII character set (95 characters):
- Uppercase letters: A-Z
- Lowercase letters: a-z
- Numbers: 0-9
- Punctuation and symbols: `!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~` and space

## Privacy

All processing happens locally in your browser. Your SVG files and generated fonts never leave your computer.

---

A [LiveryLab](https://liverylab.cc) and [Daniel's Workshop](https://danielwork.shop) project
