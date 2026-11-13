// Lux in Tenebris: theme toggle, copy buttons, Giscus. Everything here is optional;
// the site reads fine without JavaScript.

const root = document.documentElement;
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function currentTheme() {
  const set = root.getAttribute('data-theme');
  if (set === 'dark' || set === 'light') return set;
  return darkQuery.matches ? 'dark' : 'light';
}

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  try { localStorage.setItem('theme', theme); } catch (e) { /* storage blocked */ }
  syncGiscus();
  syncScriptTagger();
}

document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => setTheme(currentTheme() === 'dark' ? 'light' : 'dark'));
});
darkQuery.addEventListener('change', () => { syncGiscus(); syncScriptTagger(); });

// Blue Letter Bible ScriptTagger pop-ups follow the site theme.
function syncScriptTagger() {
  if (window.BLB && window.BLB.Tagger) window.BLB.Tagger.DarkTheme = currentTheme() === 'dark';
}

// ── Phone menu ───────────────────────────────────────
const menuBtn = document.querySelector('[data-menu-toggle]');
const siteNav = document.getElementById('site-nav');
if (menuBtn && siteNav) {
  const setOpen = (open) => {
    siteNav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? menuBtn.dataset.labelClose : menuBtn.dataset.labelOpen);
  };
  menuBtn.addEventListener('click', () => setOpen(!siteNav.classList.contains('open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteNav.classList.contains('open')) { setOpen(false); menuBtn.focus(); }
  });
}

// ── Copy buttons on code blocks ──────────────────────
document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.hidden = false;
  btn.addEventListener('click', async () => {
    const block = btn.closest('.codeblock');
    const code = block?.querySelector('.lntd:last-child pre code, pre code');
    if (!code) return;
    // Copy only the code lines, never the line numbers.
    const lines = block.querySelectorAll('.cl');
    const text = lines.length ? Array.from(lines, (l) => l.textContent).join('') : code.textContent;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied';
    } catch (e) {
      btn.textContent = 'Press Ctrl+C';
      const range = document.createRange();
      range.selectNodeContents(code);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    setTimeout(() => { btn.textContent = 'Copy'; }, 1800);
  });
});

// ── Giscus ───────────────────────────────────────────
function giscusTheme(mount) {
  return currentTheme() === 'dark' ? mount.dataset.themeDark : mount.dataset.themeLight;
}

function syncGiscus() {
  const mount = document.querySelector('.giscus-mount');
  const frame = document.querySelector('iframe.giscus-frame');
  if (!mount || !frame) return;
  frame.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme(mount) } } }, 'https://giscus.app');
}

const mount = document.querySelector('.giscus-mount');
if (mount) {
  const s = document.createElement('script');
  s.src = 'https://giscus.app/client.js';
  s.async = true;
  s.crossOrigin = 'anonymous';
  const attrs = {
    repo: mount.dataset.repo,
    'repo-id': mount.dataset.repoId,
    category: mount.dataset.category,
    'category-id': mount.dataset.categoryId,
    mapping: mount.dataset.mapping,
    ...(mount.dataset.term ? { term: mount.dataset.term } : {}),
    strict: '1',
    'reactions-enabled': '1',
    'emit-metadata': '0',
    'input-position': 'top',
    theme: giscusTheme(mount),
    lang: mount.dataset.lang,
    loading: 'lazy',
  };
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(`data-${k}`, v);
  mount.appendChild(s);
}

// ── Search ───────────────────────────────────────────
// Press "/" anywhere to jump to search (or focus the box when already there).
document.addEventListener('keydown', (e) => {
  if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target;
  if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
  const box = document.querySelector('[data-search-input]');
  const link = document.querySelector('[data-search-link]');
  if (box) { e.preventDefault(); box.focus(); box.select(); }
  else if (link) { e.preventDefault(); window.location.href = link.href; }
});

const searchForm = document.querySelector('[data-search-form]');
if (searchForm && searchForm.dataset.index) initSearch(searchForm);

// Lowercase and strip accents, so "theos" matches "θεὸς"-style text typed without
// breathings, "eco" matches "Écô", and so on. Keeps a map back to the original
// string so excerpts and highlights land on the right characters.
function fold(s) {
  let out = '';
  const map = [];
  for (let i = 0; i < s.length;) {
    const ch = String.fromCodePoint(s.codePointAt(i));
    const n = ch.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
    for (let k = 0; k < n.length; k++) { out += n[k]; map.push(i); }
    i += ch.length;
  }
  map.push(s.length);
  return { out, map };
}

function highlight(text, terms) {
  const frag = document.createDocumentFragment();
  const { out, map } = fold(text);
  const hits = [];
  for (const t of terms) {
    let i = out.indexOf(t);
    while (i !== -1) { hits.push([map[i], map[i + t.length]]); i = out.indexOf(t, i + t.length); }
  }
  hits.sort((a, b) => a[0] - b[0]);
  let pos = 0;
  for (const [s, e] of hits) {
    if (s < pos) continue;
    frag.append(text.slice(pos, s));
    const m = document.createElement('mark');
    m.textContent = text.slice(s, e);
    frag.append(m);
    pos = e;
  }
  frag.append(text.slice(pos));
  return frag;
}

function excerpt(doc, terms) {
  let at = -1;
  for (const t of terms) {
    const i = doc._body.out.indexOf(t);
    if (i !== -1 && (at === -1 || i < at)) at = i;
  }
  if (at === -1) return '';
  const body = doc.body;
  const center = doc._body.map[at];
  let start = Math.max(0, center - 90);
  let end = Math.min(body.length, center + 160);
  if (start > 0) start = body.indexOf(' ', start) + 1;
  if (end < body.length) end = body.lastIndexOf(' ', end);
  return (start > 0 ? '… ' : '') + body.slice(start, end).trim() + (end < body.length ? ' …' : '');
}

function initSearch(form) {
  const input = form.querySelector('[data-search-input]');
  const status = document.querySelector('[data-search-status]');
  const list = document.querySelector('[data-search-results]');
  let docs = null;
  let timer;

  async function load() {
    if (docs) return docs;
    const res = await fetch(form.dataset.index);
    if (!res.ok) throw new Error(res.status);
    docs = (await res.json()).map((d) => ({
      ...d,
      _title: fold(d.title).out,
      _dek: fold(d.dek).out,
      _tags: fold(d.tags.join(' ')).out,
      _body: fold(d.body),
    }));
    return docs;
  }

  function score(d, terms) {
    let total = 0;
    for (const t of terms) {
      let s = 0;
      if (d._title.includes(t)) s += 10;
      if (d._tags.includes(t)) s += 6;
      if (d._dek.includes(t)) s += 4;
      let n = 0;
      for (let i = d._body.out.indexOf(t); i !== -1 && n < 10; i = d._body.out.indexOf(t, i + t.length)) n++;
      s += n;
      if (!s) return 0; // every word must appear somewhere
      total += s;
    }
    return total;
  }

  function render(results, terms) {
    list.replaceChildren(...results.map(({ d }) => {
      const li = document.createElement('li');
      li.className = `entry topic-${d.section}`;
      li.style.setProperty('--accent', `var(--${d.accent})`);
      const no = Object.assign(document.createElement('span'), { className: 'no', textContent: d.no });
      const glyph = Object.assign(document.createElement('span'), {
        className: `glyph${d.mono ? ' glyph-mono' : ''}`, textContent: d.glyph,
      });
      glyph.setAttribute('aria-hidden', 'true');
      const label = Object.assign(document.createElement('span'), { className: 'visually-hidden', textContent: `${d.label}:` });
      const line = Object.assign(document.createElement('span'), { className: 'line' });
      const a = Object.assign(document.createElement('a'), { href: d.url });
      a.append(highlight(d.title, terms));
      const leader = Object.assign(document.createElement('span'), { className: 'leader' });
      leader.setAttribute('aria-hidden', 'true');
      const time = Object.assign(document.createElement('time'), { className: 'date', textContent: d.dateHuman });
      time.dateTime = d.date;
      line.append(a, leader, time);
      li.append(no, glyph, label, line);
      if (d.dek) {
        const dek = Object.assign(document.createElement('p'), { className: 'entry-dek' });
        dek.append(highlight(d.dek, terms));
        li.append(dek);
      }
      const ex = excerpt(d, terms);
      if (ex) {
        const p = Object.assign(document.createElement('p'), { className: 'search-excerpt' });
        p.append(highlight(ex, terms));
        li.append(p);
      }
      return li;
    }));
  }

  async function run() {
    const q = input.value.trim();
    const url = new URL(window.location.href);
    if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    if (!q) { list.replaceChildren(); status.textContent = ''; return; }
    try {
      await load();
    } catch (err) {
      status.textContent = form.dataset.msgError;
      return;
    }
    const terms = fold(q).out.split(/\s+/).filter(Boolean);
    const results = docs
      .map((d) => ({ d, s: score(d, terms) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || b.d.date.localeCompare(a.d.date));
    const msg = results.length === 0 ? form.dataset.msgNone
      : results.length === 1 ? form.dataset.msgOne : form.dataset.msgMany;
    status.textContent = msg.replace('{n}', results.length).replace('{q}', q);
    render(results, terms);
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); run(); });
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 150); });

  const initial = new URLSearchParams(window.location.search).get('q');
  if (initial) { input.value = initial; run(); }
  input.focus();
}
