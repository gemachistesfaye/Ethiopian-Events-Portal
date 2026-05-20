# Localization & Accessibility

## Multi-Language Support

The Ethiopian Heritage Portal is built for a global audience with full **multi-language support** powered by `i18next`.

### Supported Languages

| Code | Language | Script |
|---|---|---|
| `en` | English | Latin |
| `am` | Amharic | Ge'ez (Ethiopic) |
| `om` | Afaan Oromoo | Latin |

### How It Works

- Language files are stored in `src/locales/` as JSON files (`en.json`, `am.json`, `om.json`)
- Users switch languages from the **language selector** in the navigation bar
- The selected language is persisted across sessions
- All UI labels, navigation items, and key content strings are translatable

---

## Accessibility

The portal is designed to be welcoming and usable for all users:

- **Semantic HTML:** Proper use of `<header>`, `<nav>`, `<main>`, `<section>`, `<article>` elements
- **Keyboard Navigation:** All interactive elements (buttons, links, tabs) are fully keyboard-accessible
- **ARIA Labels:** Key UI controls include descriptive ARIA attributes
- **Color Contrast:** The warm stone palette maintains WCAG AA contrast ratios
- **Amharic Voice Narration:** Audio playback for AI responses aids users who prefer listening
- **Responsive Design:** Fully functional on mobile, tablet, and desktop breakpoints

---

## Responsive Breakpoints

| Breakpoint | Target |
|---|---|
| `sm` (640px+) | Large phones / small tablets |
| `md` (768px+) | Tablets |
| `lg` (1024px+) | Laptops |
| `xl` (1280px+) | Desktops (full two-column layouts) |

---

*Built by Gemachis Tesfaye — All Rights Reserved © 2026*
