/*
 * Template for a project's state registry. Copy to <project>/state-explorer/states.js
 * and replace every entry with states from this project's ui-states-checklist.md.
 *
 * Contract:
 *  - The state UI itself lives in PRODUCT code (it must also appear in real use).
 *  - This file only FORCES conditions: it sets app state / stubs data, never edits
 *    product markup by hand and never writes to real storage or real APIs.
 *  - reset() must return the app to exactly the original default (DEF-00).
 *
 * `app` below stands for whatever seam the project exposes (see web-workflow.md
 * "B3. Choose the seam"): a store, a setState function, a service object, etc.
 */
(function () {
  const app = window.__APP_STATE__; // dev-only seam exposed by the project (example)

  StateExplorer.init({
    title: document.title,

    // Restore the default happy path. Prefer the app's own reset; fall back to a
    // snapshot taken when the explorer loaded.
    reset: () => app.reset(),

    states: [
      {
        id: 'LOAD-01',
        category: 'Loading',
        name: 'Result — processing',
        trigger: 'User submits; request pending',
        expected: 'Primary button in loading variant; result area skeleton',
        priority: 'P0',
        confirm: 'RD: is progress % available?',
        apply: (ctx) => {
          ctx.mockFetch((url) => (url.includes('/api/') ? 'pending' : undefined));
          app.submit(); // trigger the real flow so the real loading UI renders
        },
      },
      {
        id: 'ERR-01',
        category: 'Error',
        name: 'Result — request failed',
        trigger: 'API returns 5xx or times out',
        expected: 'Inline error in result area, inputs preserved, Try again button',
        priority: 'P0',
        confirm: 'PM: error copy',
        apply: (ctx) => {
          ctx.mockFetch((url) => (url.includes('/api/') ? { status: 500, json: { error: 'server' } } : undefined));
          app.submit();
        },
      },
      {
        id: 'EMP-01',
        category: 'Empty',
        name: 'History — first use',
        trigger: 'User has no saved items',
        expected: 'Empty state with one-line message and primary CTA',
        priority: 'P0',
        apply: () => app.set({ history: [] }),
      },
      {
        id: 'RESP-01',
        category: 'Responsive',
        name: 'Toolbar — narrow width',
        trigger: 'Viewport < 600px',
        expected: 'Secondary actions collapse into More menu',
        priority: 'P1',
        apply: (ctx) => ctx.note('Resize the window below 600px to preview this state.'),
      },
    ],
  });
})();
