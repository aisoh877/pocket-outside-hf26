import { pipeline, env } from '@huggingface/transformers';
import { missions } from './missions.js';
import { assetPaths } from './paths.js';
const paths = assetPaths(import.meta.env.BASE_URL);
// Transformers disables local models by default in browsers; this build serves its own assets.
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = paths.models;
env.backends.onnx.wasm.wasmPaths = paths.runtime;
env.backends.onnx.wasm.numThreads = 1;
let ready;
export function loadMatcher(onProgress = () => {}) {
  if (!ready) ready = (async () => {
    const encoder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { dtype: 'q8', device: 'wasm', progress_callback: onProgress });
    const encode = async text => Array.from((await encoder(text, { pooling: 'mean', normalize: true })).data);
    const vectors = {};
    for (const mission of missions) vectors[mission.id] = await encode(`${mission.title}. ${mission.cue}. ${mission.setting}`);
    return { vectors, encode };
  })().catch(error => { ready = null; throw error; });
  return ready;
}
