+++
title = 'Hello, Scriptorium'
date = '2026-11-12T09:00:00-05:00'
dek = 'Code blocks, callouts and tables.'
tags = ['hugo', 'css', 'demo']
toc = true
numbered = true
+++

Every code block gets a header with its language, an optional filename and a copy button.

## Configuration

```toml {title="hugo.toml"}
[params.topics.code]
  label = 'Code'
  glyph = '{ }'
  accent = 'verdigris'   # rubric, verdigris, lapis, gold, oxblood, parchment
  art = 'circuit'        # tracery, rose, circuit, vine, none
```

## Styles

```css {title="assets/css/custom.css" linenos=true hl_lines=[3]}
/* Your site's assets/css/custom.css loads after the theme. */
:root {
  --rubric: #B5523B;
}
```

> [!CAVEAT]
> Hugo ignores `[markup]` settings in a theme, so copy them into your site's `hugo.toml`.

## Tables

| Accent token | Used for |
|---|---|
| `--rubric` | Links, first section |
| `--verdigris` | Second section |
| `--lapis` | Third section |

> [!ERGO]
> Callouts come from GitHub-style alerts: `> [!NB]`, `> [!CAVEAT]` and `> [!ERGO]`.
