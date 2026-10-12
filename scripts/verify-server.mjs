import { preview } from 'vite';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
try {
 const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
 const base = server.config.base;
 const entries = [];
 const check = async (path, type, expectedHash) => {
  const r = await fetch(origin + path); const data = new Uint8Array(await r.arrayBuffer());
  const hash = createHash('sha256').update(data).digest('hex');
  const passed = r.ok && new RegExp(type).test(r.headers.get('content-type')) && (!expectedHash || hash === expectedHash);
  entries.push({ path, status: r.status, type: r.headers.get('content-type'), bytes: data.length, passed });
  return new TextDecoder().decode(data);
 };
 const html = await check(base, 'text/html');
 for (const path of html.matchAll(/(?:src|href)="([^\"]*\/assets\/[^\"]+)"/g)) await check(path[1], path[1].endsWith('.css') ? 'text/css' : 'javascript');
 await check(base + 'ort/ort-wasm-simd-threaded.asyncify.mjs', 'javascript');
 await check(base + 'ort/ort-wasm-simd-threaded.asyncify.wasm', 'application/wasm');
 const manifest = JSON.parse(await readFile('model-manifest.json', 'utf8'));
 for (const file of manifest.files) await check(base + 'models/' + manifest.repo + '/' + file.file, file.file.endsWith('.json') ? 'json' : '^$|application/octet-stream', file.sha256);
 await check(base + 'licenses/ONNX-Runtime-MIT.txt', 'text/plain');
 await check(base + 'licenses/Pocket-Outside-MIT.txt', 'text/plain');
 await check(base + 'licenses/THIRD_PARTY_NOTICES.md', 'text/markdown|text/plain|^$');
 await check(base + 'licenses/ONNX-ThirdPartyNotices.txt', 'text/plain');
 const report = { checkedAt: new Date().toISOString(), base, test: 'Actual Vite production preview over loopback HTTP; no browser', passed: entries.length >= 11 && entries.every(e => e.passed), entries };
 await writeFile(base === '/' ? 'evidence/http-smoke.json' : 'evidence/http-smoke-project-path.json', JSON.stringify(report, null, 2) + '\n');
 console.log(JSON.stringify({ test: report.test, passed: report.passed, resources: entries.length }));
 if (!report.passed) process.exitCode = 1;
} finally { await new Promise(resolve => server.httpServer.close(resolve)); }
