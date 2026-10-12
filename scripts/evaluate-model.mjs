import { pipeline, env } from '@huggingface/transformers';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { missions } from '../src/missions.js';
import { rankMissions, eligibleMissions } from '../src/engine.js';
env.allowRemoteModels = false;
env.localModelPath = resolve('public/models') + '/';
env.cacheDir = resolve('.cache');
const start = performance.now();
const encoder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { dtype: 'q8', device: 'cpu', session_options: { intraOpNumThreads: 1, interOpNumThreads: 1 } });
const encode = async text => Array.from((await encoder(text, { pooling: 'mean', normalize: true })).data);
const vectors = {};
for (const m of missions) vectors[m.id] = await encode(`${m.title}. ${m.cue}. ${m.setting}`);
const cases = [
 ['I want to hear the birds and nearby sounds in a quiet place', ['sound-map', 'bird-watch']],
 ['I want to tend the plants in my balcony pots', ['garden-check']],
 ['I need to stretch my legs and go for an energetic walk', ['small-stride']],
 ['I want to watch clouds drift across the sky', ['sky-frame']],
 ['I want to find beautiful colours in flowers and leaves', ['colour-hunt']],
 ['I want a gentle conversation with a friend while walking', ['companion-loop']]
];
const results = [];
for (const [query, expected] of cases) {
 const ranked = rankMissions(eligibleMissions({ wish: query, minutes: 20, movement: 'any', conditions: 'ready' }), await encode(query), vectors);
 results.push({ query, expected, selected: ranked[0].id, passed: expected.includes(ranked[0].id), top3: ranked.slice(0,3).map(m => ({ id: m.id, similarity: Number(m.similarity.toFixed(4)) })) });
}
await mkdir('evidence', { recursive: true });
const report = { checkedAt: new Date().toISOString(), inference: 'real local ONNX q8 / CPU / one thread / remote models disabled', model: 'Xenova/all-MiniLM-L6-v2', milliseconds: Math.round(performance.now() - start), passed: results.filter(r => r.passed).length, total: results.length, limitation: 'Six authored smoke cases, not a general accuracy benchmark. Browser WASM is a separate verification.', results };
await writeFile('evidence/model-evaluation.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (results.some(r => !r.passed)) process.exitCode = 1;
