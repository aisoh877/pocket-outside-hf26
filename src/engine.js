import { missions } from './missions.js';
export function validatePreferences(p) {
  if (typeof p?.wish !== 'string' || !p.wish.trim() || p.wish.length > 240) throw new Error('Tell us what you need in 1–240 characters.');
  if (![5, 10, 15, 20].includes(p.minutes)) throw new Error('Choose a time from the list.');
  if (!['still', 'any'].includes(p.movement)) throw new Error('Choose a movement preference.');
  if (!['ready', 'sheltered', 'unsafe'].includes(p.conditions)) throw new Error('Choose your conditions.');
  return { ...p, wish: p.wish.trim() };
}
export function eligibleMissions(preferences) {
  const p = validatePreferences(preferences);
  if (p.conditions === 'unsafe') return [];
  return missions.filter(m => m.minutes <= p.minutes && (p.movement !== 'still' || m.movement === 'still') && (p.conditions !== 'sheltered' || m.sheltered));
}
export function dot(a, b) {
  if (!a.length || a.length !== b.length || [...a, ...b].some(v => !Number.isFinite(v))) throw new Error('Invalid embedding.');
  return a.reduce((sum, x, i) => sum + x * b[i], 0);
}
export function rankMissions(candidates, queryVector, vectors) {
  return candidates.map(m => ({ ...m, similarity: dot(queryVector, vectors[m.id]) })).sort((a, b) => b.similarity - a.similarity || a.id.localeCompare(b.id));
}
export function makeTakeaway(mission) {
  return `${mission.title}\n${mission.minutes} minutes · ${mission.setting}\n\n${mission.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nBring back: ${mission.reflection}\n\nChoose a place and conditions you know are safe and accessible. Stop whenever you want.\nPocket Outside — local semantic matching, human-authored missions.`;
}
export function readSession(value) {
  try {
    const s = JSON.parse(value);
    const mission = missions.find(m => m.id === s?.missionId);
    if (!mission || !Number.isFinite(s.startedAt) || s.startedAt <= 0 || s.startedAt > Date.now() || (s.phase === 'outside' && s.startedAt < Date.now() - 86400000) || !['outside', 'done'].includes(s.phase)) return null;
    return { mission, startedAt: s.startedAt, phase: s.phase, note: typeof s.note === 'string' ? s.note.slice(0, 240) : '' };
  } catch { return null; }
}
