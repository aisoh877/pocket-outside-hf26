import test from 'node:test';
import assert from 'node:assert/strict';
import { assetPaths } from '../src/paths.js';
test('root and GitHub project paths retain model and WASM prefixes', () => {
  assert.deepEqual(assetPaths('/'), { home: '/', models: '/models/', runtime: '/ort/' });
  assert.deepEqual(assetPaths('/pocket-outside-hf26/'), { home: '/pocket-outside-hf26/', models: '/pocket-outside-hf26/models/', runtime: '/pocket-outside-hf26/ort/' });
});
test('external origins, traversal and incomplete prefixes are rejected', () => {
  for (const value of ['https://example.com/', '//example.com/', '/../', '/name', '/a//', '/%2e/']) assert.throws(() => assetPaths(value));
});
