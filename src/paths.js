export function assetPaths(base = '/') {
  if (typeof base !== 'string' || !/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) {
    throw new Error('Site base must be / or a slash-delimited project path.');
  }
  return { home: base, models: `${base}models/`, runtime: `${base}ort/` };
}
