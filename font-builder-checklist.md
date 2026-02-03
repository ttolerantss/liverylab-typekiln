# Font Builder Web App - Development Specification

## Project Overview

Build a client-side web application that converts SVG files into usable, properly scaled, and kerned font files (TTF/OTF). Users upload SVG character designs, configure options, preview their font, and download the generated files. This is an open-source project that will be hosted on GitHub Pages or Cloudflare Pages.

### Key Requirements
- **Entirely client-side** - no backend server required
- **Input**: SVG files (either one multi-artboard export from Illustrator, or individual SVG files per character)
- **Output**: TTF and OTF font files bundled in a ZIP download
- **Features**: Auto-kerning with manual override, font preview, case toggle (uppercase-only/lowercase-only modes)

---

## Technical Stack

### Recommended
- **Framework**: Vite + React (or Svelte if you determine it's a better fit)
- **Language**: TypeScript
- **Font Generation**: opentype.js
- **SVG Parsing**: svg-pathdata or similar
- **ZIP Creation**: JSZip
- **State Management**: Zustand, Jotai, or React Context (keep it simple)
- **Styling**: Tailwind CSS or CSS Modules (your choice)

### Deployment
- GitHub Pages or Cloudflare Pages
- No server-side code, no database, no user accounts

---

## Phase 1: Project Setup

1. Initialize project with Vite + React + TypeScript
2. Configure ESLint and Prettier
3. Set up GitHub repository structure
4. Add MIT license
5. Create initial README.md
6. Set up deployment pipeline (GitHub Actions for GitHub Pages or Cloudflare Pages)

---

## Phase 2: Core Dependencies

Install and configure:
- `opentype.js` - for TTF/OTF font generation client-side
- `svg-pathdata` - for SVG path parsing and manipulation
- `jszip` - for bundling font files into downloadable ZIP
- State management library of choice

---

## Phase 3: SVG Upload & Parsing

### 3.1 File Input Component
- Create drag-and-drop upload zone with click-to-browse fallback
- Accept two input modes:
  1. **Single SVG file** with multiple artboards (exported from Illustrator with "Use Artboards" option)
  2. **Multiple individual SVG files** (one per character, e.g., `A.svg`, `B.svg`)
- Support folder upload for batch files
- Validate that uploaded files are valid SVGs
- Display clear error messages for invalid files

### 3.2 SVG Parsing Engine
- Extract artboard names or layer names from multi-artboard SVG files
- For individual files, use the filename as the character identifier
- Convert SVG `<path>` elements to font-compatible path data
- Handle these SVG complexities:
  - Transforms (translate, rotate, scale) - flatten them
  - Compound paths and grouped elements - merge appropriately
  - Clipping masks - warn user these may not convert correctly
  - Strokes - warn user to convert strokes to outlines in Illustrator
- Normalize path coordinates for consistent scaling
- Display parsing errors clearly with suggestions to fix

### 3.3 Character Auto-Detection
Map artboard names or filenames to characters using these conventions:
- **Literal**: `A`, `B`, `a`, `1`, etc.
- **Descriptive**: `period` → `.`, `comma` → `,`, `space` → ` `, `question` → `?`, `exclamation` → `!`, `at` → `@`, `hash` → `#`, `dollar` → `$`, `percent` → `%`, `ampersand` → `&`, `asterisk` → `*`, `plus` → `+`, `equals` → `=`, `hyphen` or `dash` → `-`, `underscore` → `_`, `slash` → `/`, `backslash` → `\`, `colon` → `:`, `semicolon` → `;`, `quote` or `apostrophe` → `'`, `doublequote` → `"`, `leftparen` or `lparen` → `(`, `rightparen` or `rparen` → `)`, `leftbracket` or `lbracket` → `[`, `rightbracket` or `rbracket` → `]`, `leftbrace` or `lbrace` → `{`, `rightbrace` or `rbrace` → `}`
- **Unicode**: `U+0041` → A (if someone uses this format)

### 3.4 Character Mapping UI
- Display grid showing each parsed glyph with:
  - Visual preview of the SVG shape
  - Detected/assigned character
  - Edit button to manually reassign if auto-detection failed
- Allow manual character assignment via dropdown or text input
- Show warning for duplicate assignments
- Show warning for unrecognized/unmapped glyphs

---

## Phase 4: Character Set Configuration

### 4.1 Supported Character Set
The font should support these characters (95 total):
- **Uppercase**: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z (26)
- **Lowercase**: a b c d e f g h i j k l m n o p q r s t u v w x y z (26)
- **Numbers**: 0 1 2 3 4 5 6 7 8 9 (10)
- **Punctuation & Symbols**: `. , ! ? ' " - _ ( ) [ ] { } / \ @ # $ % & * + = : ;` (27)
- **Space**: (1) - with configurable width

### 4.2 Character Management UI
- Display complete grid of all 95 expected characters
- Visual status for each character:
  - ✓ Glyph assigned (green)
  - ✗ Missing glyph (red/gray)
  - ⊘ Excluded by user (strikethrough)
- Click to exclude/include individual characters
- Bulk actions: "Exclude all missing", "Include all"

### 4.3 Case Mode Toggles
Implement three modes:
1. **Both cases** (default): Uppercase and lowercase are independent
2. **Uppercase only**: 
   - All lowercase slots (a-z) are filled with corresponding uppercase glyphs (A-Z)
   - User only needs to provide A-Z designs
   - Typing `a` displays the `A` glyph
3. **Lowercase only**:
   - All uppercase slots (A-Z) are filled with corresponding lowercase glyphs (a-z)
   - User only needs to provide a-z designs
   - Typing `A` displays the `a` glyph

UI should clearly indicate when characters will be duplicated.

---

## Phase 5: Font Metrics & Scaling

### 5.1 Auto-Configuration (Default Behavior)
- **UPM (Units Per Em)**: Set to 1000 (industry standard)
- **Ascender**: Auto-calculate from tallest glyph (typically uppercase letters or characters like `b`, `d`, `f`, `h`, `k`, `l`)
- **Descender**: Auto-calculate from lowest glyph (typically `g`, `j`, `p`, `q`, `y`)
- **Cap Height**: Calculate from uppercase letters
- **x-Height**: Calculate from lowercase letters (specifically `x`)
- **Baseline**: Position at 0, with descenders going negative
- Scale all imported glyphs proportionally to fit within the UPM while maintaining relative sizes

### 5.2 Scaling Algorithm
1. Find the bounding box of each glyph from SVG
2. Determine the overall maximum height needed (ascender to descender)
3. Calculate scale factor to fit within UPM with appropriate margins
4. Apply consistent scale to all glyphs to maintain relative proportions
5. Position glyphs on baseline appropriately

### 5.3 Optional Manual Overrides (Advanced Section)
- Baseline position adjustment
- Global vertical offset
- Per-glyph vertical position adjustment
- Per-glyph scale adjustment

---

## Phase 6: Kerning System

### 6.1 Auto-Kerning Engine
Implement automatic kerning based on glyph shape analysis:

**Algorithm approach:**
1. For each glyph, analyze the right edge contour and left edge contour
2. Calculate default sidebearings (space on left and right of each glyph)
3. For known problematic pairs, calculate optical adjustments by analyzing how the shapes fit together
4. Generate negative kern values where shapes can tuck closer together
5. Generate positive kern values where shapes need more breathing room

**Priority kerning pairs to analyze:**
- AV, AW, AY, AT, AC, AG, AO, AQ, AU
- FA, FO, Fe, Fo, Fi
- LT, LV, LW, LY, LA
- PA, Pe, Po
- TA, TO, TR, Ta, Te, To, Tr, Ti, Ty
- VA, VO, Ve, Vo, Vi, Vy
- WA, WO, Wa, We, Wi, Wo
- YA, YO, Ya, Ye, Yi, Yo
- Lowercase: av, aw, ay, fa, fo, fe, fi, lt, lv, ly, ta, te, to, tr, va, ve, vo, wa, we, wi, wo, ya, ye, yo
- Numbers with 1 and 7 (T1, 17, 71, etc.)
- Punctuation pairs: quotes followed by letters, periods/commas preceded by letters

### 6.2 Manual Kerning Controls
- Display table of all generated kerning pairs with values
- Each pair shows:
  - Left character | Right character | Kern value (in font units)
  - Visual preview of the pair at current kern value
  - Slider or number input to adjust (-200 to +200 range suggested)
- "Add custom pair" button to create new kerning pairs
- "Remove" button to delete pairs (or set to 0)
- "Reset to auto" button per pair
- "Reset all to auto" button
- Search/filter kerning pairs

### 6.3 Kerning Preview
- Live preview updates as kern values change
- Show metrics/guides option to visualize spacing

---

## Phase 7: Font Preview

### 7.1 Preview Panel
- Large text input area for typing custom preview text
- Default sample text: 
  ```
  The quick brown fox jumps over the lazy dog.
  THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.
  0123456789
  !@#$%&*()_+-=[]{}|;':",.<>?/\
  ```
- Real-time rendering using the generated font (use opentype.js to render to canvas or generate SVG paths)

### 7.2 Preview Controls
- Font size selector: preset sizes (12px, 16px, 24px, 36px, 48px, 72px, 96px) + custom input
- Background color toggle: White / Black / Custom color picker
- Text color: Auto (contrast with background) or custom
- Line height adjustment
- Letter spacing adjustment (for testing)

### 7.3 Glyph Inspector
- Click on any character in the preview to see:
  - Individual glyph enlarged
  - Metrics overlay (baseline, ascender, descender, left/right sidebearing)
  - Advance width
  - Kerning pairs involving this character

### 7.4 Metrics Overlay Toggle
- Show/hide visual guides for:
  - Baseline
  - x-height
  - Cap height
  - Ascender line
  - Descender line

---

## Phase 8: Font Metadata

### 8.1 Metadata Form
Required fields:
- **Font Family Name**: Text input, validated (no special characters that break fonts)
- **Style Name**: Dropdown or text (Regular, Bold, Italic, Light, etc.) - default "Regular"

Optional fields:
- **Version**: Text input, default "1.0"
- **Author/Designer**: Text input
- **Description**: Textarea
- **License**: Dropdown with common options:
  - SIL Open Font License (OFL)
  - MIT License
  - Creative Commons Zero (CC0)
  - Apache 2.0
  - Custom (shows textarea)
- **Copyright**: Text input, auto-suggest format: "Copyright © 2024 [Author Name]"
- **Vendor URL**: Text input
- **Designer URL**: Text input

### 8.2 Validation
- Font family name is required
- Warn if name contains characters that may cause issues
- Auto-generate font ID from family name

---

## Phase 9: Export & Download

### 9.1 Pre-Export Validation
Before generating, check and warn for:
- Missing font family name (block export)
- Missing commonly expected characters (warning only)
- No glyphs at all (block export)
- Potential issues detected during SVG parsing

### 9.2 Font Generation
- Use opentype.js to construct the font:
  - Create new `opentype.Font` with metadata
  - Add each glyph with paths, metrics, and sidebearings
  - Add kerning table with all pairs
  - Generate TTF binary
  - Generate OTF binary
- Run generation in a Web Worker to prevent UI freezing
- Show progress indicator during generation

### 9.3 Download Package
Generate ZIP file containing:
```
FontFamilyName/
├── FontFamilyName-Regular.ttf
├── FontFamilyName-Regular.otf
└── README.txt
```

README.txt should contain:
- Font name and version
- Author (if provided)
- License text
- Character set included
- Generation date
- "Generated with [App Name] - [URL]"

### 9.4 Download UI
- "Generate & Download" button
- Progress bar during generation
- Auto-download ZIP when complete
- Option to regenerate if user makes changes

---

## Phase 10: User Interface Layout

### 10.1 Overall Structure
Single-page application with clear sections. Suggested layout:

**Header**
- App name/logo
- GitHub link
- Help/Documentation link

**Main Content** (scrollable or tabbed)
1. **Upload Section**
   - Drag-drop zone
   - File list showing uploaded files
   
2. **Character Mapping Section**
   - Grid of parsed glyphs
   - Assignment controls
   
3. **Configuration Section**
   - Case mode toggle (Both / Uppercase Only / Lowercase Only)
   - Character exclusion grid
   - Space width setting
   
4. **Kerning Section**
   - Auto-kerning status
   - Manual adjustment table
   
5. **Metadata Section**
   - Form fields for font info
   
6. **Preview Section** (sticky/persistent)
   - Should be visible while adjusting other settings
   - Consider split-pane layout
   
7. **Export Section**
   - Generate button
   - Download area

### 10.2 Responsive Considerations
- Primary target: Desktop browsers
- Should be usable on tablet (1024px+)
- Mobile: Show warning that desktop is recommended

### 10.3 UX Elements
- Clear section headers
- Collapsible sections for advanced options
- Tooltips explaining technical terms (hover on "UPM", "kerning", "sidebearing", etc.)
- Toast notifications for success/errors
- "Start Over" button to reset everything
- Confirmation dialog before resetting

---

## Phase 11: Help & Documentation

### 11.1 In-App Help
- Help icon (?) next to technical terms with tooltip explanations
- Expandable "How to export from Illustrator" section in upload area
- FAQ modal accessible from header

### 11.2 Illustrator Export Instructions
Include these instructions prominently:

```
### Exporting from Adobe Illustrator

1. Open your character designs in Illustrator
2. Ensure each character is on a separate artboard
3. Name each artboard with the character it represents:
   - Use the literal character for letters/numbers: A, B, a, b, 1, 2
   - Use descriptive names for symbols: period, comma, space, question, etc.
4. IMPORTANT: Convert all strokes to outlines (Object → Expand)
5. Go to File → Export → Export As
6. Choose SVG format
7. Check "Use Artboards"
8. Click Export
9. In SVG Options:
   - Styling: Inline Style
   - Font: Convert to Outlines
   - Images: Embed
   - Object IDs: Layer Names
   - Decimal: 3
   - Minify: unchecked
   - Responsive: unchecked
10. Click OK
11. Upload the resulting SVG file(s) to this app

Alternative: Export each character as a separate SVG file named with the character (A.svg, B.svg, period.svg, etc.)
```

### 11.3 Character Naming Reference
Provide a reference table in the help section listing all supported descriptive names for symbols.

---

## Phase 12: Error Handling & Edge Cases

### 12.1 File Handling Errors
- Invalid file type → Clear message: "Please upload SVG files only"
- Corrupted SVG → "This file couldn't be parsed. Please check it opens correctly in Illustrator"
- No paths found in SVG → "No vector paths found. Make sure your designs are vector shapes, not images"
- Strokes detected → "This design contains strokes. For best results, convert strokes to outlines in Illustrator (Object → Expand)"

### 12.2 Generation Errors
- opentype.js errors → Catch and display meaningful message
- Browser memory issues with large fonts → Suggest reducing complexity

### 12.3 Browser Compatibility
Test and support:
- Chrome (latest) - primary target
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Use feature detection for:
- File System Access API (if used)
- Web Workers
- Blob/URL.createObjectURL

---

## Phase 13: Performance Optimization

### 13.1 Web Workers
- Move SVG parsing to Web Worker
- Move font generation to Web Worker
- Move kerning calculations to Web Worker
- Keep UI responsive during heavy operations

### 13.2 Rendering Optimization
- Debounce preview updates when typing
- Throttle kerning preview updates
- Use canvas for font preview (faster than SVG for many glyphs)
- Lazy-load glyph previews in character grid

---

## Phase 14: Testing Checklist

### 14.1 File Input Testing
- [ ] Single multi-artboard SVG uploads correctly
- [ ] Multiple individual SVG files upload correctly
- [ ] Folder upload works
- [ ] Invalid files are rejected with clear messages
- [ ] Various Illustrator export settings work

### 14.2 Parsing Testing
- [ ] Simple paths parse correctly
- [ ] Complex paths with curves parse correctly
- [ ] Transformed elements are handled
- [ ] Grouped elements are merged appropriately
- [ ] Character auto-detection works for common naming patterns

### 14.3 Font Generation Testing
- [ ] Generated TTF opens in system font viewers
- [ ] Generated OTF opens in system font viewers
- [ ] Font installs correctly on macOS
- [ ] Font installs correctly on Windows
- [ ] Font works in Microsoft Word
- [ ] Font works in Adobe Photoshop/Illustrator
- [ ] Font works in web browsers (@font-face)
- [ ] All characters render correctly
- [ ] Kerning is applied correctly
- [ ] Uppercase-only mode works (typing 'a' shows 'A')
- [ ] Lowercase-only mode works (typing 'A' shows 'a')

### 14.4 Edge Cases
- [ ] Font with only 5 characters generates correctly
- [ ] Font with all 95 characters generates correctly
- [ ] Very complex glyph paths don't crash the app
- [ ] Empty/blank glyphs are handled gracefully

---

## Phase 15: Launch Preparation

### 15.1 Repository Setup
- Complete README.md with:
  - Project description and screenshots
  - Live demo link
  - Feature list
  - Illustrator export guide
  - Character naming conventions
  - Technology stack
  - Contributing guidelines
  - License
- Add CONTRIBUTING.md with development setup instructions
- Add issue templates for bugs and feature requests
- Add pull request template
- Create GitHub Pages deployment workflow

### 15.2 Final Polish
- [ ] All UI text is clear and typo-free
- [ ] Loading states for all async operations
- [ ] Error states are user-friendly
- [ ] Empty states are helpful
- [ ] Favicon and meta tags
- [ ] Open Graph tags for social sharing
- [ ] Analytics (optional, privacy-respecting)

---

## Out of Scope for V1 (Future Roadmap)

Document these as potential future enhancements:
- Ligature support (fi, fl, ff, ffi, ffl)
- Variable font support
- Multiple weights from single source
- Importing existing fonts to modify
- Accented character support (é, ñ, ü, etc.)
- Project save/load functionality
- Undo/redo system
- Batch processing multiple fonts
- WOFF/WOFF2 web font output
- Font subsetting
- OpenType features (small caps, stylistic alternates)

---

## Quick Reference: Key Technical Decisions

| Aspect | Decision |
|--------|----------|
| Framework | React + TypeScript (or Svelte) |
| Build Tool | Vite |
| Font Library | opentype.js |
| SVG Parsing | svg-pathdata |
| ZIP Creation | JSZip |
| Styling | Tailwind CSS or CSS Modules |
| State | Zustand/Jotai/Context |
| Deployment | GitHub Pages or Cloudflare Pages |
| Output Formats | TTF, OTF |
| UPM | 1000 |
| Client-side only | Yes |
| User accounts | No |
| Data persistence | No (session only) |
