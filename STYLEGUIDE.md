# Scriptorium — Theme Guideline

A personal blog theme for writing on **technology / software** and **theology**.
This document is the source of truth while building the theme: every color,
font, spacing value and component should trace back to something here.

---

## 1. Concept

**"A library after hours."** Lamplight on old paper, oxblood leather, tarnished
gold leaf, a stone cloister outside the window. Gothic in its *structure*
(pointed arches, rubrication, manuscript conventions), academic in its *temper*
(footnotes, marginalia, careful typography).

The unifying idea: **both subjects are exegesis.** Theology is close reading
of scripture and tradition; software is close reading of source code. The
theme treats both as *texts to be studied* — the code listing and the
scripture quotation get equal typographic care.

### Principles

1. **Reading first.** This is a long-form blog. Atmosphere never costs legibility.
2. **Restraint over costume.** One or two gothic gestures per screen
   (a drop cap, a fleuron, a blackletter wordmark) — not skulls, candles and
   cobwebs everywhere. Tasteful, not Halloween.
3. **Manuscript conventions, used honestly.** Rubrics, marginalia, colophons,
   catchwords — each one does a real job (headings, sidenotes, footer, "next post").
4. **Fast and quiet.** No JS frameworks, no heavy images. Texture comes from
   CSS and typography, not photos of libraries.

### Words to aim for / avoid

| Aim for | Avoid |
|---|---|
| scholarly, nocturnal, warm, weathered, reverent, precise | spooky, edgy, grungy, kitsch, cluttered, "vampire" |

---

## 2. Color

Dark mode is the **default** ("Nocturne"). A light mode ("Vellum") follows
`prefers-color-scheme` and can be toggled manually. All colors are CSS custom
properties on `:root`; nothing in templates hard-codes a hex value.

### 2.1 Nocturne (dark, default)

| Token | Hex | Role |
|---|---|---|
| `--ink-0` | `#14110F` | Page background (warm near-black, never pure `#000`) |
| `--ink-1` | `#1C1815` | Raised surfaces: code blocks, cards, header |
| `--ink-2` | `#28211C` | Borders, rules, table stripes |
| `--parchment` | `#E6DCC6` | Body text |
| `--parchment-dim` | `#A8997E` | Metadata, captions, sidenotes |
| `--gold` | `#C2A066` | Ornaments, drop caps, focus rings, active nav |
| `--rubric` | `#CC6F5C` | Links, rubricated headings — *theology accent* |
| `--oxblood` | `#7A2626` | Fills only (buttons, selection bg, badges) — never text on dark |
| `--verdigris` | `#7FA894` | *Technology accent* |
| `--lapis` | `#8FA6CC` | *Miscellanea accent* (lapis blue, the manuscript partner of rubric red) |

### 2.2 Vellum (light)

| Token | Hex | Role |
|---|---|---|
| `--ink-0` | `#F2EADA` | Page background (aged paper, not white) |
| `--ink-1` | `#E9DFC9` | Raised surfaces |
| `--ink-2` | `#D6C8AC` | Borders, rules |
| `--parchment` | `#2A211B` | Body text (iron-gall ink brown) |
| `--parchment-dim` | `#65564A` | Metadata |
| `--gold` | `#8A6A2F` | Ornaments |
| `--rubric` | `#8B2E2E` | Links / theology accent |
| `--oxblood` | `#7A2626` | Fills |
| `--verdigris` | `#3D6B57` | Technology accent |
| `--lapis` | `#34508A` | Miscellanea accent |

> Token names stay the same across modes (`--parchment` is "the text color"
> even when it's dark brown) so components never need mode-specific CSS.

### 2.3 Rules

- **Contrast:** body text and links must meet WCAG AA (≥ 4.5 : 1) against
  `--ink-0` and `--ink-1`. Checked results:

  | Pair (on `--ink-0` / `--ink-1`) | Nocturne | Vellum |
  |---|---|---|
  | `--parchment` | 13.8 / 12.9 | 13.2 / 11.9 |
  | `--parchment-dim` | 6.7 / 6.3 | 5.9 / 5.3 |
  | `--rubric` | 5.4 / 5.0 | 6.9 / 6.3 |
  | `--verdigris` | 7.1 / 6.7 | 5.1 / 4.6 |
  | `--lapis` | 7.6 / 7.1 | 6.6 / 6.0 |
  | `--gold` | 7.6 / 7.2 | 4.2 / 3.8 ⚠ |

  Vellum gold is below 4.5, so in light mode gold stays decorative / large
  text only (drop caps, ornaments, focus rings all need just 3 : 1).
- **Accent by topic:** posts in the theology section use `--rubric` as their
  accent; tech posts use `--verdigris`; general writing uses `--lapis`. Set once via `--accent` on `<article>`
  so components just use `var(--accent)`.
- **Gold is decoration**, not information. Never the only signal for state.
- **Selection:** `--oxblood` background, `--parchment` text.

---

## 3. Typography

All fonts **self-hosted** (WOFF2, subset) in `static/fonts`. EB Garamond is subset
from the original release, because the Google Fonts build drops small caps
and old-style figures — no Google Fonts
requests, for privacy and speed.

| Role | Typeface | Notes |
|---|---|---|
| Wordmark only | **UnifrakturMaguntia** (blackletter) | Site title in header + favicon. *Never* for headings or body. |
| Display / headings | **Cormorant Garamond** (500–600) | High-contrast; only at ≥ 1.5rem. Italic for subtitles. |
| Body | **EB Garamond** (400, 400i, 500) | Real small caps (`smcp`), old-style figures, ligatures. Covers Greek. |
| Code | **JetBrains Mono** (400, 400i) | Programming ligatures **off**. Sized ~0.85em to match Garamond x-height. |
| Hebrew fallback | **Frank Ruhl Libre** | Only loaded via `unicode-range` for Hebrew text. |

### 3.1 Scale (fluid, ~1.25 ratio)

| Token | Size | Use |
|---|---|---|
| `--step--1` | ~0.85rem | Sidenotes, captions, metadata |
| `--step-0` | `clamp(1.15rem, 1rem + 0.5vw, 1.3rem)` | Body |
| `--step-1` | ~1.45rem | h4, dek/subtitle |
| `--step-2` | ~1.8rem | h3 |
| `--step-3` | ~2.25rem | h2 |
| `--step-4` | ~2.8rem | h1 / post title |
| `--step-5` | ~3.5rem+ | Wordmark, home hero |

### 3.2 Details

- Body `line-height: 1.6`; headings `1.15`. Measure: **62–68ch**.
- Enable `font-variant-numeric: oldstyle-nums` in prose, `lining-nums tabular-nums` in tables and code.
- **Metadata in small caps** with letter-spacing `0.06em` (dates, tags, reading time, nav).
- `hyphens: auto` + `text-wrap: pretty` on paragraphs; `text-wrap: balance` on headings.
- Body text is slightly lighter weight than you'd use on white — light-on-dark
  looks bolder; check EB Garamond 400 vs 500 on real screens before committing.
- Greek/Hebrew: wrap in `<span lang="grc">` / `<span lang="he" dir="rtl">`
  (via shortcodes) so fonts, hyphenation and direction are correct.

---

## 4. Layout & spacing

- **Single reading column**, centered, max ~68ch.
- **Margin column** on wide screens (≥ 1100px): sidenotes/marginalia sit in a
  right margin, Tufte-style. Below that breakpoint they collapse into
  toggleable inline notes.
- **Spacing scale:** `--space-1 … --space-8` = 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4.5 rem.
  Vertical rhythm driven by `--space-*`, not ad-hoc margins.
- **Corners:** square or very subtle (`2px`). The one exception is the
  **pointed arch** (see §5) used sparingly as a frame motif.
- **Mobile:** 16px side gutter minimum, no horizontal page scroll; code blocks
  scroll *inside* their box.

---

## 5. Ornament & texture

Use from this kit only; each has a defined job.

| Element | Job | Implementation |
|---|---|---|
| **Drop cap** | Opens each post's first paragraph | `::first-letter`, Cormorant, `--gold`, ~3 lines tall |
| **Rubrication** | First few words of a post in small caps, accent color | `.lede` / first-line styling |
| **Fleuron** `❦` | Section break (`<hr>`) | `hr::after { content: "❦" }`, `--gold` |
| **Asterism** `⁂` | End-of-post mark | Appended after content |
| **Double rule** | Header/footer separators | `border` thin–thick–thin in `--ink-2`/`--gold` |
| **Pointed arch** | Frame for home hero / epigraph | CSS `clip-path` or SVG, 1px gold stroke |
| **Margin art** | Fills the empty side margins on wide screens (≥ 1440px) | A line drawing repeated down each margin as a CSS mask in `--gold` (16% opacity dark / 22% light), fading at top and bottom, right side mirrored. Motif by place: **home** rose windows, **Theologia** Gothic window tracery (also the default for other pages), **Machina** circuit traces, **Miscellanea** vine scroll. Off with `params.marginArt = false` |
| **Paper grain** | Subtle surface noise | Inline SVG `feTurbulence` as background, ≤ 4% opacity |
| **Vignette** | Lamplight falloff at viewport edges | Radial gradient on `body`, very faint |

**Topic glyphs** (used in post lists and badges):
- Theology: ✠ (cross pattée)
- Technology: ⌘ or `{ }` — decide during build

Do **not** use: skull/raven/candle clip-art, distressed/blurred fonts,
blood-drip effects, heavy background photography.

---

## 6. Components

### Global
- **Header:** blackletter wordmark left, nav right in small caps
  (*Writings · Theologia · Machina · Index · About* — names TBD).
  Double rule beneath. Theme toggle as a small ☾ / ☀ glyph button.
- **Footer → "Colophon":** short note on fonts/tools, year in Roman numerals
  (`MMXXVI`), RSS link.

### Home
- **Epigraph** in a pointed-arch frame (a rotating quote from `data/epigraphs.yaml`).
- **Post list as a Table of Contents:** title · dotted leader · date, with a
  topic glyph and the topic's accent color. Optional Roman-numeral numbering.

### Post (single)
- Title (h1), italic **dek/subtitle** from front matter.
- Metadata line in small caps: *date · reading time · topic · tags*.
- Drop cap + rubricated lede.
- Optional **table of contents** for long posts (front matter `toc: true`).
- **Footnotes** styled as academic notes; **sidenotes** via shortcode.
- End with asterism ⁂, then **"Catchword"** navigation (prev/next post, named
  after the manuscript practice of printing the next page's first word).
- Related posts by tag.

### Lists / taxonomies
- Section pages (`/theology/`, `/tech/`) with their accent color and an intro.
- Tags page as an **"Index"**: alphabetical, grouped by letter, with counts.
- Archive as a **"Catalogue"**: grouped by year.

### Search
- `/search/` (from `content/search.md`): a box with live results as you type,
  drawn as the same contents entries as the home page, with matches marked
  and a short excerpt. Press `/` on any page to get there.
- Hugo writes `/search/index.json` at build time (titles, subtitles, tags and
  plain body text of every post). The search runs in the browser with no
  library or outside service. It ignores case and accents, and every word
  in the query has to match. Without JavaScript the form searches the site on
  DuckDuckGo instead.

### 404
- "*Lacuna.*" — a short line about a missing leaf in the manuscript, link home.

---

## 7. Content-specific elements

### For theology
- `{{</* scripture ref="John 1:1–2" version="ESV" */>}}[1] In the beginning…{{</* /scripture */>}}`:
  block quote with the reference as a small-caps attribution. `[n]` becomes a
  superscript verse number in `--accent`. Optional `link="…"`.
- `{{</* greek */>}}…{{</* /greek */>}}` / `{{</* hebrew */>}}…{{</* /hebrew */>}}`: language-tagged
  inline spans (Hebrew is right-to-left).
- Patristic/confessional quotes: standard blockquote, attribution as a final
  `<cite>` line.
- **Blue Letter Bible ScriptTagger** links every plain-text reference
  (`John 3:16`, `Rom 8:28`, ranges with hyphen or en dash) to BLB with a
  verse pop-up, in the translation set by `params.scriptTagger.translation`.
  It loads only on posts and tags only the post body: title, subtitle, tags,
  neighbouring-post links, related posts, comments, header and footer are
  skipped, as are headings and code inside the body. To keep a reference untagged, wrap
  it in `<span class="noTag">…</span>`; to turn it off for a whole page, set
  `scripttagger = false` in front matter. The pop-up switches to BLB's dark
  theme with the site toggle.

### Notes (both topics)
- `{{</* sidenote */>}}…{{</* /sidenote */>}}` inside a paragraph: margin note on wide
  screens, inline note below 1100px. Lettered *a, b, c* so they never clash
  with numbered footnotes (`[^1]`), which collect under "Notes" at the end.

### For technology
- **Code blocks:** `--ink-1` background, thin `--ink-2` border, filename/lang
  label as a small-caps tab on top, copy button. Custom **Chroma** theme built
  from the palette (gold keywords, verdigris strings, rubric numbers,
  `--parchment-dim` italic comments).
- Inline `code`: subtle `--ink-1` background, no bright colors.
- Callouts use GitHub-style alert syntax, relabelled in Latin:
  `> [!NB]` (also NOTE, IMPORTANT) → **Nota Bene**; `> [!CAVEAT]` (also
  WARNING, CAUTION) → **Caveat**; `> [!ERGO]` (also TIP, SUMMARY) → **Ergo**.
- Code fences take a filename: ` ```rust {title="src/lexer.rs"} `.

---

## 8. Interaction & motion

- Links: accent color, underline offset `0.2em`, thickness grows on hover.
- Focus: 2px `--gold` outline with offset — always visible.
- Motion is minimal: fades ≤ 200ms. Everything respects `prefers-reduced-motion`.
- No scroll-jacking, parallax, or flicker effects.

---

## 9. Technical conventions

- **Hugo** (extended not required). Layouts use the current template system
  (`baseof`, `home`, `page`, `section`, `taxonomy`, `term`, partials).
- **CSS:** plain modern CSS with custom properties, split into files
  (`tokens.css`, `base.css`, `layout.css`, `components/*.css`), bundled with
  `resources.Concat | minify | fingerprint`.
- **JS:** none required to read. Small vanilla scripts only for the theme
  toggle and copy-code button.
- **Theme config** via `[params]`: `tagline`, `author`, `colophon`,
  `wordmarkLight`, `postSections`, `topics.<section>.{label,glyph}`, `giscus.*`.
  Epigraphs rotate daily from `data/epigraphs.yaml`; a page can set its own
  `epigraph = {text, source}`.
- **Front matter** for posts: `dek`, `tags`, `toc`, `numbered` (Roman h2s),
  `dropcap = false`, `comments = false`, `number` (override the post number).
- Hugo ignores `[markup]` in a theme, so the site's `hugo.toml` must set
  `goldmark.renderer.unsafe = true` and `highlight.noClasses = false`.
- **Accessibility:** semantic landmarks, skip link, AA contrast, `lang`
  attributes on non-English text, alt text required by the image render hook.
- **Performance budget:** < 150 KB total on a text post (fonts included), no
  layout shift from font loading (`font-display: swap` + size-adjusted fallbacks).

---

## 10. Reference site

Scriptorium was designed for *Lux in Tenebris* (https://lux.prinke.dev). The choices made for that site, as a worked example:


- [x] Site title: **Lux in Tenebris** (John 1:5; provisional), "Lux" set in gold. Tagline: *Notes on God, grammar, and the machines we write.* Lives at lux.prinke.dev for now
- [x] Sections: **Theologia** (`/theologia/`, ✠, rubric), **Machina** (`/machina/`, `{ }`, verdigris) and **Miscellanea** (`/miscellanea/`, ¶, lapis) for general writing. Post numbers run across all three.
- [x] Roman numerals: post numbers (*No. XII*) and footer year (*MMXXVI*); dates stay Arabic
- [x] Comments: **Giscus**, under the heading *Responsa*, with a custom theme CSS built from the tokens
