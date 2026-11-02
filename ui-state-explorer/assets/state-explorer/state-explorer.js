/*!
 * State Explorer - dev/prototype-only UI state switcher.
 * Framework-agnostic, no dependencies. Renders inside a Shadow DOM so it never
 * inherits or leaks product styles.
 *
 * Usage:
 *   StateExplorer.init({
 *     title: 'Tool page',
 *     reset: async () => { ...restore the app to its default state... },
 *     states: [ { id, category, name, trigger, expected, priority, confirm, apply(ctx) } ],
 *   });
 *
 * Variants (compare two designs of the same state, e.g. "as built" vs "as decided"):
 *   { id, name, ..., variants: [ { id: 'rd', label: 'RD', expected }, { id: 'figma', label: 'Figma', expected } ],
 *     apply(ctx) { ...ctx.variant is the selected variant id... } }
 * The detail area shows a switch; the first variant is the default.
 *
 * Isolation: init() refuses to mount when
 *   - <html data-env="production">, or
 *   - window.__STATE_EXPLORER_DISABLED__ === true, or
 *   - options.guard() returns false.
 * Production builds should not include this file at all (see web-workflow.md).
 */
(function () {
  'use strict';
  if (window.StateExplorer) return;

  const CATEGORY_ORDER = [
    'Default', 'Empty', 'Loading', 'Error', 'Disabled', 'Validation', 'Interaction',
    'Edge', 'Permission', 'Responsive', 'Partial', 'Destructive', 'Business',
  ];
  const CATEGORY_ALIASES = {
    DEF: 'Default', EMP: 'Empty', LOAD: 'Loading', ERR: 'Error', DIS: 'Disabled',
    VAL: 'Validation', INT: 'Interaction', EDGE: 'Edge', PERM: 'Permission',
    RESP: 'Responsive', PART: 'Partial', DEST: 'Destructive', BIZ: 'Business',
  };

  let opts = null;
  let host = null;
  let root = null;
  let isOpen = false;
  let activeId = null;
  let activeVariant = null;
  let cleanups = [];
  let applying = Promise.resolve();
  let noteText = '';

  function categoryOf(s) {
    if (s.category) return CATEGORY_ALIASES[s.category] || s.category;
    const code = String(s.id).split('-')[0];
    return CATEGORY_ALIASES[code] || 'Other';
  }

  // ---- ctx helpers handed to each state's apply() ---------------------------
  function makeCtx() {
    return {
      /** Register a function to run when this state is left. */
      onCleanup(fn) { cleanups.push(fn); },
      /** Wait ms. */
      delay(ms) { return new Promise((r) => setTimeout(r, ms)); },
      /** A promise that never settles - useful to hold a loading state. */
      pending() { return new Promise(() => {}); },
      /**
       * Temporarily replace window.fetch. handler(url, init) may return:
       *   a Response / {status, json} object -> mocked response
       *   'pending'        -> never resolves (loading)
       *   'network-error'  -> rejects with TypeError (offline)
       *   undefined        -> pass through to real fetch
       * Restored automatically on cleanup.
       */
      mockFetch(handler) {
        const real = window.fetch;
        window.fetch = async function (input, init) {
          const url = typeof input === 'string' ? input : input && input.url;
          const out = await handler(url, init);
          if (out === undefined) return real.apply(this, arguments);
          if (out === 'pending') return new Promise(() => {});
          if (out === 'network-error') throw new TypeError('Failed to fetch (State Explorer)');
          if (out instanceof Response) return out;
          return new Response(JSON.stringify(out.json ?? {}), {
            status: out.status ?? 200,
            headers: { 'Content-Type': 'application/json' },
          });
        };
        cleanups.push(() => { window.fetch = real; });
      },
      /** Temporarily override a property on an object (e.g. a service method). */
      stub(obj, key, value) {
        const had = Object.prototype.hasOwnProperty.call(obj, key);
        const prev = obj[key];
        obj[key] = value;
        cleanups.push(() => { if (had) obj[key] = prev; else delete obj[key]; });
      },
      /** Add a class to an element for the duration of the state. */
      addClass(el, cls) {
        if (!el) return;
        el.classList.add(cls);
        cleanups.push(() => el.classList.remove(cls));
      },
      /** Show a note in the panel (e.g. "Resize the window below 600px"). */
      note(text) { noteText = text; renderDetail(); },
      /** Query inside the product document. */
      $(sel) { return document.querySelector(sel); },
      $$(sel) { return Array.from(document.querySelectorAll(sel)); },
    };
  }

  async function runCleanups() {
    const list = cleanups.reverse();
    cleanups = [];
    for (const fn of list) {
      try { await fn(); } catch (e) { console.warn('[StateExplorer] cleanup failed', e); }
    }
  }

  async function backToDefault() {
    await runCleanups();
    noteText = '';
    if (opts.reset) {
      try { await opts.reset(); } catch (e) { console.warn('[StateExplorer] reset failed', e); }
    }
  }

  function select(id, variantId) {
    applying = applying.then(async () => {
      await backToDefault();
      const s = opts.states.find((x) => x.id === id);
      activeId = s ? s.id : null;
      activeVariant = s && s.variants && s.variants.length
        ? (s.variants.some((v) => v.id === variantId) ? variantId : s.variants[0].id)
        : null;
      document.documentElement.setAttribute('data-ui-state', activeId || 'DEF-00');
      if (activeVariant) document.documentElement.setAttribute('data-ui-variant', activeVariant);
      else document.documentElement.removeAttribute('data-ui-variant');
      if (s && s.apply) {
        try { await s.apply(Object.assign(makeCtx(), { variant: activeVariant })); } catch (e) {
          console.error('[StateExplorer] apply failed for ' + id, e);
          noteText = 'apply() threw - see console.';
        }
      }
      render();
    });
    return applying;
  }

  function open() { isOpen = true; render(); focusFirst(); }

  function close() {
    isOpen = false;
    applying = applying.then(async () => {
      await backToDefault();
      activeId = null;
      activeVariant = null;
      document.documentElement.removeAttribute('data-ui-state');
      document.documentElement.removeAttribute('data-ui-variant');
      render();
    });
    return applying;
  }

  function focusFirst() {
    const el = root && root.querySelector('.search');
    if (el) el.focus();
  }

  // ---- rendering ------------------------------------------------------------
  const CSS = `
    :host { all: initial; }
    * { box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
    .wrap { position: fixed; right: 16px; bottom: 16px; z-index: 2147483647; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
    .toggle { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 14px; border-radius: 999px;
      border: 1px solid #3a3a44; background: #18181c; color: #f4f4f6; font-size: 13px; font-weight: 600; cursor: pointer;
      box-shadow: 0 6px 20px rgba(0,0,0,.25); }
    .toggle:focus-visible, button:focus-visible, input:focus-visible { outline: 2px solid #7aa7ff; outline-offset: 2px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #6b6b76; }
    .toggle[aria-pressed="true"] .dot { background: #4ade80; }
    .active-chip { font-weight: 500; color: #c9c9d1; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .panel { width: min(360px, calc(100vw - 32px)); max-height: min(70vh, 640px); display: flex; flex-direction: column;
      background: #18181c; color: #ececf1; border: 1px solid #3a3a44; border-radius: 12px; overflow: hidden;
      box-shadow: 0 12px 40px rgba(0,0,0,.35); font-size: 13px; }
    .head { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-bottom: 1px solid #2c2c34; }
    .head strong { font-size: 13px; }
    .head small { color: #9a9aa6; display: block; margin-top: 2px; font-size: 11px; }
    .x { background: none; border: 0; color: #9a9aa6; font-size: 18px; cursor: pointer; padding: 4px 8px; border-radius: 6px; }
    .x:hover { color: #fff; background: #26262d; }
    .search { margin: 10px 14px 4px; padding: 8px 10px; border-radius: 8px; border: 1px solid #34343d; background: #101013; color: #ececf1; font-size: 13px; width: calc(100% - 28px); }
    .list { overflow: auto; padding: 4px 8px 8px; flex: 1; }
    .cat { margin: 10px 6px 4px; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: #8b8b96; }
    .item { width: 100%; display: grid; grid-template-columns: auto 1fr auto; gap: 8px; align-items: center; text-align: left;
      padding: 7px 8px; border: 0; border-radius: 8px; background: none; color: inherit; cursor: pointer; font-size: 13px; }
    .item:hover { background: #24242b; }
    .item[aria-current="true"] { background: #2b3550; }
    .id { font: 600 11px ui-monospace, SFMono-Regular, Menlo, monospace; color: #9fb4ff; }
    .badges { display: inline-flex; gap: 4px; }
    .b { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 999px; background: #2c2c34; color: #c9c9d1; }
    .b.P0 { background: #5a1f24; color: #ffb4b4; } .b.P1 { background: #4d3b14; color: #ffd98a; } .b.P2 { background: #253244; color: #a9c7ff; }
    .b.q { background: #3b2b52; color: #d9c2ff; }
    .b.v { background: #1f3d36; color: #9ee6cf; }
    .seg { display: flex; gap: 4px; margin-bottom: 8px; padding: 3px; border-radius: 8px; background: #101013; border: 1px solid #2c2c34; }
    .seg button { flex: 1; padding: 6px 8px; border: 0; border-radius: 6px; background: none; color: #c9c9d1; font-size: 12px; font-weight: 600; cursor: pointer; }
    .seg button[aria-pressed="true"] { background: #2b3550; color: #fff; }
    .detail { border-top: 1px solid #2c2c34; padding: 10px 14px 12px; color: #c9c9d1; font-size: 12px; line-height: 1.45; }
    .detail dt { color: #8b8b96; font-size: 11px; margin-top: 6px; }
    .detail dd { margin: 0; }
    .note { margin-top: 8px; padding: 6px 8px; border-radius: 6px; background: #2a2a12; color: #f3e9a0; }
    .empty { padding: 16px; color: #8b8b96; }
  `;

  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== undefined && attrs[k] !== null) n.setAttribute(k, attrs[k]);
    }
    (children || []).forEach((c) => c && n.appendChild(c));
    return n;
  }

  let filter = '';

  function render() {
    if (!root) return;
    const prevScroll = root.querySelector('.list')?.scrollTop || 0;
    const hadSearchFocus = root.activeElement && root.activeElement.classList.contains('search');
    root.innerHTML = '';
    root.appendChild(el('style', { text: CSS }));
    const wrap = el('div', { class: 'wrap' });

    if (isOpen) {
      const panel = el('div', { class: 'panel', role: 'dialog', 'aria-label': 'State Explorer' });
      panel.appendChild(el('div', { class: 'head' }, [
        el('div', null, [
          el('strong', { text: 'State Explorer' }),
          el('small', { text: (opts.title ? opts.title + ' \u00b7 ' : '') + opts.states.length + ' states \u00b7 preview only' }),
        ]),
        el('button', { class: 'x', 'aria-label': 'Close State Explorer and return to normal mode', onclick: close, text: '\u00d7' }),
      ]));
      const search = el('input', {
        class: 'search', type: 'search', placeholder: 'Filter by ID, name, category\u2026', 'aria-label': 'Filter states',
        value: filter,
        oninput: (e) => { filter = e.target.value; render(); },
      });
      panel.appendChild(search);

      const list = el('div', { class: 'list' });
      const q = filter.trim().toLowerCase();
      const matches = (s) => !q || [s.id, s.name, categoryOf(s), s.trigger].join(' ').toLowerCase().includes(q);

      const def = { id: 'DEF-00', name: 'Default (original happy path)', category: 'Default' };
      const all = [def].concat(opts.states).filter(matches);
      const groups = {};
      all.forEach((s) => { (groups[categoryOf(s)] ||= []).push(s); });
      const cats = Object.keys(groups).sort((a, b) => {
        const ia = CATEGORY_ORDER.indexOf(a), ib = CATEGORY_ORDER.indexOf(b);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      });
      if (!cats.length) list.appendChild(el('div', { class: 'empty', text: 'No states match.' }));
      cats.forEach((c) => {
        list.appendChild(el('div', { class: 'cat', text: c }));
        groups[c].forEach((s) => {
          const current = (activeId || 'DEF-00') === s.id;
          const badges = el('span', { class: 'badges' }, [
            s.priority ? el('span', { class: 'b ' + s.priority, text: s.priority }) : null,
            s.variants ? el('span', { class: 'b v', title: 'Has variants to compare', text: s.variants.map((v) => v.label).join('/') }) : null,
            s.confirm ? el('span', { class: 'b q', title: 'Needs confirmation: ' + s.confirm, text: '?' }) : null,
          ]);
          list.appendChild(el('button', {
            class: 'item', 'aria-current': current ? 'true' : 'false',
            onclick: () => select(s.id === 'DEF-00' ? null : s.id),
          }, [el('span', { class: 'id', text: s.id }), el('span', { text: s.name }), badges]));
        });
      });
      panel.appendChild(list);
      panel.appendChild(el('div', { class: 'detail' }));
      wrap.appendChild(panel);
      requestAnimationFrame(() => {
        const l = root.querySelector('.list'); if (l) l.scrollTop = prevScroll;
        if (hadSearchFocus) { const s = root.querySelector('.search'); s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
      });
    }

    const active = opts.states.find((s) => s.id === activeId);
    wrap.appendChild(el('button', {
      class: 'toggle', 'aria-pressed': isOpen ? 'true' : 'false',
      'aria-label': isOpen ? 'Close State Explorer' : 'Open State Explorer',
      title: 'State Explorer (Alt+Shift+S)',
      onclick: () => (isOpen ? close() : open()),
    }, [
      el('span', { class: 'dot' }),
      el('span', { text: 'States' }),
      isOpen && active ? el('span', { class: 'active-chip', text: active.id }) : null,
    ]));
    root.appendChild(wrap);
    renderDetail();
  }

  function renderDetail() {
    const box = root && root.querySelector('.detail');
    if (!box) return;
    box.innerHTML = '';
    const s = opts.states.find((x) => x.id === activeId);
    if (!s) {
      box.appendChild(el('div', { text: 'Showing the original default state. Pick a state to preview it; close the panel to return to normal use.' }));
      return;
    }
    const variant = s.variants ? s.variants.find((v) => v.id === activeVariant) : null;
    if (s.variants) {
      box.appendChild(el('div', { class: 'seg', role: 'group', 'aria-label': 'Variant' }, s.variants.map((v) =>
        el('button', { 'aria-pressed': v.id === activeVariant ? 'true' : 'false', text: v.label, onclick: () => select(s.id, v.id) })
      )));
    }
    const dl = el('dl', { style: 'margin:0' });
    [['Trigger', s.trigger], ['Expected UI', (variant && variant.expected) || s.expected], ['Needs confirmation', s.confirm]].forEach(([k, v]) => {
      if (!v) return;
      dl.appendChild(el('dt', { text: k }));
      dl.appendChild(el('dd', { text: v }));
    });
    box.appendChild(dl);
    if (noteText) box.appendChild(el('div', { class: 'note', text: noteText }));
  }

  function onKey(e) {
    if (e.altKey && e.shiftKey && (e.code === 'KeyS')) { e.preventDefault(); isOpen ? close() : open(); }
    else if (e.key === 'Escape' && isOpen && e.composedPath().includes(host)) { close(); }
  }

  const api = {
    init(options) {
      const disabled = document.documentElement.dataset.env === 'production' ||
        window.__STATE_EXPLORER_DISABLED__ === true ||
        (options.guard && options.guard() === false);
      if (disabled) { console.info('[StateExplorer] disabled in this environment'); return false; }
      if (host) api.destroy();
      opts = Object.assign({ states: [] }, options);
      const ids = new Set();
      opts.states.forEach((s) => {
        if (ids.has(s.id)) console.warn('[StateExplorer] duplicate state id ' + s.id);
        ids.add(s.id);
      });
      host = document.createElement('state-explorer-root');
      host.setAttribute('data-state-explorer', '');
      root = host.attachShadow({ mode: 'open' });
      document.body.appendChild(host);
      document.addEventListener('keydown', onKey, true);
      render();
      return true;
    },
    open, close, select,
    get activeId() { return activeId; },
    get activeVariant() { return activeVariant; },
    destroy() {
      runCleanups();
      document.removeEventListener('keydown', onKey, true);
      if (host) host.remove();
      host = root = null; isOpen = false; activeId = null; activeVariant = null;
      document.documentElement.removeAttribute('data-ui-state');
      document.documentElement.removeAttribute('data-ui-variant');
    },
  };
  window.StateExplorer = api;
})();
