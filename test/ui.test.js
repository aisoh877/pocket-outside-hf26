import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
import { JSDOM } from 'jsdom';
import * as engine from '../src/engine.js';
import { missions } from '../src/missions.js';
test('DOM workflow: choose, leave, return, persist a note, clear', async () => {
 const dom = new JSDOM('<div id="app"></div>', { url: 'http://127.0.0.1:4317', runScripts: 'outside-only' });
 try {
  const w = dom.window; Object.assign(w, engine); w.HTMLElement.prototype.scrollIntoView = () => {};
  let calls = 0;
  w.testAI = { loadMatcher: async () => { calls++; return { encode: async () => [1,0], vectors: Object.fromEntries(missions.map((m,i) => [m.id, i === 0 ? [1,0] : [0,1]])) }; } };
  const source = (await readFile(new URL('../src/main.js', import.meta.url), 'utf8')).replace(/^import .*;\n/gm, '').replaceAll('import.meta.env.BASE_URL', '"/pocket-outside-hf26/"').replace("import('./ai.js')", 'Promise.resolve(testAI)');
  new Script(source).runInContext(dom.getInternalVMContext());
  const $ = s => w.document.querySelector(s);
  $('[data-wish]').click(); $('#conditions').value = 'unsafe'; await $('#preferences').onsubmit({ preventDefault() {} });
  assert.equal(calls, 0); assert.match($('#model-status').textContent, /Stay in/); assert.equal($('#result').hidden, true);
  $('#conditions').value = 'ready'; await $('#preferences').onsubmit({ preventDefault() {} });
  assert.equal(w.document.querySelector('.brand').getAttribute('href'), '/pocket-outside-hf26/'); assert.equal(calls, 1); assert.equal($('#result h2').textContent, 'Make a tiny sound map');
  $('#result .primary').click(); assert.equal($('#preferences').hidden, true); assert.equal($('#outside').hidden, false);
  $('#back').click(); $('#note').value = 'A blackbird, and wind in the leaves.'; $('#note').dispatchEvent(new w.Event('input'));
  assert.equal(JSON.parse(w.localStorage.getItem('pocket-outside.session.v1')).phase, 'done');
  assert.match(w.localStorage.getItem('pocket-outside.session.v1'), /blackbird/);
  $('#reset').click(); assert.equal(w.localStorage.getItem('pocket-outside.session.v1'), null); assert.equal($('#preferences').hidden, false);
 } finally { dom.window.close(); }
});
test('DOM reports a model failure without presenting a recommendation', async () => {
 const dom = new JSDOM('<div id="app"></div>', { url: 'http://127.0.0.1:4317', runScripts: 'outside-only' });
 try {
  const w = dom.window; Object.assign(w, engine); w.testAI = { loadMatcher: async () => { throw new Error('Unavailable'); } };
  const source = (await readFile(new URL('../src/main.js', import.meta.url), 'utf8')).replace(/^import .*;\n/gm, '').replaceAll('import.meta.env.BASE_URL', '"/pocket-outside-hf26/"').replace("import('./ai.js')", 'Promise.resolve(testAI)');
  new Script(source).runInContext(dom.getInternalVMContext());
  w.document.querySelector('#wish').value = '<script>alert(1)</script>';
  await w.document.querySelector('#preferences').onsubmit({ preventDefault() {} });
  assert.match(w.document.querySelector('#model-status').textContent, /could not load/);
  assert.equal(w.document.querySelector('#result').hidden, true);
  assert.equal(w.document.querySelectorAll('script').length, 0);
 } finally { dom.window.close(); }
});
