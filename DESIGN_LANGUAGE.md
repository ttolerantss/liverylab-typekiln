# LiveryLab Design Language

A comprehensive guide to the visual design system used across LiveryLab products.

---

## Typography

### Font Family
```css
font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

Google Fonts import:
```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
```

### Font Weights
- **400** - Regular (body text)
- **500** - Medium (labels, UI elements)
- **600** - Semibold (headings, emphasis)

### Font Sizes
| Use Case | Size |
|----------|------|
| Section titles | 16px |
| Body text | 13px |
| Labels | 12px |
| Small text / captions | 11px |
| Micro text (badges, keys) | 10px |

---

## Color Palette

### Backgrounds
| Name | Hex | Usage |
|------|-----|-------|
| Deep Black | `#0f0f10` | Login/splash screens |
| Primary BG | `#1a1a1a` | Main app background, modals |
| Sidebar BG | `#151515` | Navigation sidebars |
| Elevated BG | `#222222` | Cards, elevated surfaces |
| Input BG | `#2a2a2a` | Form inputs, dropdowns |
| Hover BG | `#333333` | Hover states |

### Text Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#ffffff` | Headings, important text |
| Secondary | `#cccccc` | Body text |
| Tertiary | `#aaaaaa` | Descriptions |
| Muted | `#888888` | Labels, placeholders |
| Disabled | `#666666` | Disabled states |
| Faint | `#555555` | Help text, hints |

### Brand Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary Blue | `#1868da` | Primary buttons, links, focus states |
| Primary Blue Hover | `#2878ea` | Button hover |
| Accent Blue | `#4a9eff` | Active nav items, version highlights |
| Update Blue | `#3b82f6` | Update notifications, progress bars |

### Borders
| Name | Hex | Usage |
|------|-----|-------|
| Default | `#333333` | Container borders |
| Subtle | `#2a2a2a` | Dividers, separators |
| Input | `#444444` | Form inputs |
| Hover | `#555555` | Hover states |

### Semantic Colors
| Name | Hex | Usage |
|------|-----|-------|
| Success | `#4caf50` / `#28c840` | Status indicators, success states |
| Warning | `#febc2e` | Warning notices |
| Error | `#e74c3c` / `#ff5f57` | Error messages, close buttons |
| Warning Notice BG | `rgba(255, 200, 50, 0.08)` | Warning containers |
| Warning Notice Border | `rgba(255, 200, 50, 0.2)` | Warning container borders |
| Warning Notice Text | `#b89a3a` | Warning text |

### Gradient Backgrounds (Login Screen)
```css
/* Bottom layer - blue glow */
background: radial-gradient(ellipse 100% 100% at center,
  #053473 0%,
  #002351 20%,
  transparent 50%
);

/* Top layer - dark overlay */
background: radial-gradient(ellipse 100% 100% at top right,
  #030E26 0%,
  transparent 70%
);
```

---

## Spacing

### Base Unit
8px grid system

### Common Values
| Size | Value | Usage |
|------|-------|-------|
| xs | 4px | Tight spacing, gaps |
| sm | 8px | Element gaps |
| md | 12px | Component padding |
| lg | 16px | Section spacing |
| xl | 24px | Container padding |
| xxl | 32px | Section margins |

---

## Border Radius

| Size | Value | Usage |
|------|-------|-------|
| Small | 3px | Tags, small badges |
| Default | 4px | Buttons, inputs |
| Medium | 6px | Dropdowns, cards |
| Large | 8px | Control panels, notifications |
| XL | 12px | Modals, containers |

---

## Components

### Buttons

#### Primary Button
```css
background: #1868da;
color: white;
border: none;
padding: 8px 16px;
border-radius: 4px;
font-size: 13px;

/* Hover */
background: #2878ea;
```

#### Secondary Button
```css
background: transparent;
border: 1px solid #444;
color: #888;
padding: 8px 16px;
border-radius: 4px;

/* Hover */
background: #333;
color: #fff;
border-color: #555;
```

#### Icon Button (Small)
```css
width: 28px;
height: 28px;
background: transparent;
border: 1px solid #444;
color: #888;
border-radius: 4px;

/* Hover */
background: #333;
color: #fff;
border-color: #555;
```

### Inputs

#### Text Input
```css
padding: 12px;
border-radius: 4px;
border: 1px solid #444;
background: #2a2a2a;
color: #fff;
font-size: 14px;

/* Focus */
outline: none;
border-color: #1868da;

/* Placeholder */
color: #555;
```

#### Select / Dropdown Trigger
```css
padding: 10px 12px;
background: #2a2a2a;
border: 1px solid #444;
border-radius: 6px;
font-size: 13px;
color: #fff;

/* Hover */
background: #333;
border-color: #555;

/* Open/Focus */
border-color: #1868da;
background: #333;
```

#### Range Slider
```css
/* Track */
height: 4px;
background: #333;
border-radius: 2px;

/* Thumb */
width: 14px;
height: 14px;
background: #fff;
border-radius: 50%;

/* Thumb Hover */
transform: scale(1.15);
```

#### Color Picker
```css
width: 48px;
height: 32px;
border: none;
border-radius: 4px;

/* Swatch */
border: 1px solid #555;
border-radius: 4px;
```

### Modals

#### Overlay
```css
background: rgba(0, 0, 0, 0.7); /* Error modal */
background: rgba(0, 0, 0, 0.75); /* Help modal */
```

#### Modal Container
```css
background: #1a1a1a;
border: 1px solid #333;
border-radius: 12px;
padding: 24px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
```

#### Modal with Sidebar
```css
.modal {
  display: flex;
  width: 720px;
  height: 520px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

.sidebar {
  width: 180px;
  background: #151515;
  border-right: 1px solid #2a2a2a;
}
```

### Cards / Containers

#### Floating Panel
```css
background: rgba(0, 0, 0, 0.7);
padding: 16px;
border-radius: 8px;
```

#### Login Container
```css
background: rgba(0, 0, 0, 0.4);
border-radius: 12px;
border: 1px solid #333;
padding: 40px;
min-width: 360px;
```

### Navigation

#### Sidebar Nav Item
```css
padding: 10px 12px;
font-size: 13px;
color: #888;
border-radius: 6px;

/* Hover */
background: rgba(255, 255, 255, 0.05);
color: #bbb;

/* Active */
background: rgba(24, 104, 218, 0.15);
color: #4a9eff;
```

### Progress Bars

```css
/* Container */
height: 6px;
background: rgba(255, 255, 255, 0.1);
border-radius: 3px;

/* Fill */
background: linear-gradient(90deg, #1868da, #2878ea);
border-radius: 3px;
transition: width 0.3s;
```

### Notifications / Toasts

```css
position: fixed;
bottom: 20px;
right: 20px;
background: rgba(30, 30, 30, 0.95);
border: 1px solid #444;
border-radius: 8px;
padding: 16px;
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);

/* Slide-in animation */
@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

### Keyboard Shortcuts Display

```css
.shortcut-key {
  display: inline-block;
  padding: 3px 6px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  color: #888;
}
```

### Status Indicators

```css
/* Dot indicator */
width: 8px;
height: 8px;
border-radius: 50%;
background: #666; /* Inactive */
background: #4caf50; /* Active/Watching */

/* Pulse animation for active state */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
animation: pulse 2s infinite;
```

---

## Title Bar (macOS Style)

```css
.titlebar {
  height: 36px;
  background: transparent; /* or #1a1a1a when solid */
}

.titlebar-btn {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.close { background: #ff5f57; }
.minimize { background: #febc2e; }
.maximize { background: #28c840; }

/* Icons appear on hover */
.titlebar-controls:hover .titlebar-btn svg {
  opacity: 1;
}
```

---

## Scrollbars

```css
::-webkit-scrollbar {
  width: 6px; /* or 8px for larger areas */
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

---

## Transitions

Standard transition timing:
```css
transition: all 0.15s;      /* Quick interactions */
transition: all 0.2s;       /* Modal fade */
transition: all 0.3s;       /* Progress bars, larger movements */
```

---

## Footer

```css
.footer {
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.5);
}

.footer-copyright {
  font-size: 11px;
  color: #E9EDF5;
}

.footer-branding {
  font-size: 10px;
  color: #E9EDF5;
  letter-spacing: 0.5px;
}

.footer-link {
  font-size: 11px;
  color: #E9EDF5;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}
```

---

## Branding Elements

### Logo Placement
- Login screen: 48px height
- Control panel header: 24px height
- Footer branding (DW mark): 10px height

### Branding Line Format
```
A [DW logo] PROJECT
```

### Copyright Format
```
LiveryLab · © 2026 All rights reserved
```

---

## Z-Index Scale

| Layer | Value | Usage |
|-------|-------|-------|
| Base | 100 | Control panels, footers |
| Dropdown | 1000 | Custom select dropdowns |
| Title bar | 10000 | Window controls |
| Notifications | 10000 | Update toasts |
| Help modal | 15000 | Help overlay |
| Error modal | 20000 | Error dialogs |
