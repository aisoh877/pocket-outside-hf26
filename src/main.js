import './style.css';
import { eligibleMissions, rankMissions, makeTakeaway, readSession } from './engine.js';
const key = 'pocket-outside.session.v1';
const $ = s => document.querySelector(s);
const app = $('#app');
const homePath = import.meta.env.BASE_URL;
app.innerHTML = `
<header><a class="brand" href="${homePath}" aria-label="Pocket Outside home"><span class="mark">↗</span> pocket outside</a><span class="edition">FIELD NOTES / 001</span></header>
<main>
 <section class="intro"><p class="eyebrow">A SMALL INVITATION TO GO OUTSIDE</p><h1>A little less screen.<br><em>A little more world.</em></h1><p class="lede">Tell us what you need. Get one small outdoor mission.<br>Then put this away and make it yours.</p>
 <div class="landscape" aria-hidden="true"><div class="sun"></div><div class="hill back"></div><div class="hill front"></div><div class="stem one"></div><div class="stem two"></div><span>THERE'S SOMETHING OUT THERE.</span></div>
 <div class="principles"><span>01 &nbsp; Say a little</span><span>02 &nbsp; Take a moment</span><span>03 &nbsp; Bring back a detail</span></div></section>
 <section class="workspace" aria-label="Choose your outdoor mission">
 <form id="preferences"><div class="card-top"><span class="eyebrow">YOUR NEXT SMALL ADVENTURE</span><span class="dot" aria-hidden="true"></span></div>
 <h2>What would feel good?</h2><label for="wish">A thought, a mood, a curiosity</label><textarea id="wish" maxlength="240" rows="3" placeholder="My head is full. I'd like a quiet moment listening to birds." required></textarea>
 <div class="examples"><button type="button" data-wish="I need a quiet moment listening to birds and sounds">A quiet moment</button><button type="button" data-wish="I want to look at plants and do a little gardening">Visit a plant</button><button type="button" data-wish="I feel restless and want an energetic walk to stretch my legs">Stretch my legs</button></div>
 <div class="fields"><div><label for="minutes">Time to spare</label><select id="minutes"><option value="5">5 minutes</option><option value="10" selected>10 minutes</option><option value="15">15 minutes</option><option value="20">20 minutes</option></select></div><div><label for="movement">Movement</label><select id="movement"><option value="any">A familiar walk or a pause</option><option value="still">Stay in one spot</option></select></div></div>
 <label for="conditions">Your conditions, checked by you</label><select id="conditions"><option value="ready">Safe to go outside</option><option value="sheltered">A sheltered spot only</option><option value="unsafe">Not safe to go outside now</option></select>
 <button class="primary" id="find" type="submit">Find my moment <span>↗</span></button>
 <p class="model-status" id="model-status" role="status" aria-live="polite">Local AI loads when you ask. No account, no API key.</p><p class="fine">The model matches your words to human-written missions. It cannot check weather, paths or accessibility. You choose a familiar, suitable place.</p></form>
 <section id="result" hidden aria-live="polite"></section>
 <section id="outside" hidden></section>
 </section>
</main><footer><span>Made for the part of your day beyond the screen.</span><details><summary>How the open AI works</summary><p>MiniLM sentence embeddings run on this device through Transformers.js and ONNX Runtime. The app filters time, movement and conditions first, then ranks eligible cards by semantic similarity. Similarity is not a safety or confidence score. Your words are not sent to a model service. Setup downloads public model files; the running app serves them locally. Local reflection notes stay in this browser until cleared.</p><p><a href="${homePath}licenses/THIRD_PARTY_NOTICES.md">Open model credits and licenses</a></p></details></footer>`;
let ranked = [], current = 0, session = null, interval, savedLocally = true;
const setStatus = text => { $('#model-status').textContent = text; };
function storeSession() { try { localStorage.setItem(key, JSON.stringify({ missionId: session.mission.id, startedAt: session.startedAt, phase: session.phase, note: session.note || '' })); savedLocally = true; } catch { savedLocally = false; } }
function showCard() {
 const m = ranked[current];
 $('#result').hidden = false;
 $('#result').replaceChildren();
 const eyebrow = document.createElement('p'); eyebrow.className = 'eyebrow'; eyebrow.textContent = `${m.minutes} MINUTES · ${m.movement === 'still' ? 'STAY IN ONE SPOT' : 'A FAMILIAR WALK'}`;
 const title = document.createElement('h2'); title.textContent = m.title;
 const place = document.createElement('p'); place.className = 'place'; place.textContent = m.setting;
 const steps = document.createElement('ol'); m.steps.forEach(step => { const li = document.createElement('li'); li.textContent = step; steps.append(li); });
 const reason = document.createElement('p'); reason.className = 'fine'; reason.textContent = `Open-model match ${current + 1} of ${ranked.length}. Time, movement and shelter limits applied before ranking.`;
 const actions = document.createElement('div'); actions.className = 'actions';
 const start = document.createElement('button'); start.className = 'primary'; start.textContent = "I'm heading out ↗"; start.onclick = () => { session = { mission: m, startedAt: Date.now(), phase: 'outside', note: '' }; storeSession(); renderOutside(); };
 const another = document.createElement('button'); another.textContent = 'Another idea'; another.onclick = () => { current = (current + 1) % ranked.length; showCard(); };
 const take = document.createElement('button'); take.textContent = 'Save pocket note'; take.onclick = () => { const url = URL.createObjectURL(new Blob([makeTakeaway(m)], { type: 'text/plain' })); const a = document.createElement('a'); a.href = url; a.download = 'my-outside-moment.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
 actions.append(start, another, take); $('#result').append(eyebrow, title, place, steps, reason, actions); $('#result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function renderOutside() {
 clearInterval(interval); $('#preferences').hidden = true; $('#result').hidden = true; $('#outside').hidden = false;
 $('#outside').innerHTML = `<p class="eyebrow">${session.phase === 'done' ? 'A DETAIL BROUGHT HOME' : 'THE SCREEN CAN WAIT'}</p><h2></h2><p class="place"></p><ol></ol><p id="elapsed" class="elapsed"></p><p class="fine">No countdown to finish. Stop whenever you want. This records your own check-in, not verified outdoor time.</p><button class="primary" id="back">I'm back — keep a detail</button><div id="reflection" hidden><label for="note"></label><textarea id="note" maxlength="240" rows="3" placeholder="One little thing I noticed…"></textarea><p id="note-status" role="status">Saved only in this browser.</p></div><button id="reset" class="text-button">Clear this moment & start again</button>`;
 $('#outside h2').textContent = session.mission.title; $('#outside .place').textContent = session.mission.setting;
 session.mission.steps.forEach(s => { const li = document.createElement('li'); li.textContent = s; $('#outside ol').append(li); });
 const tick = () => { $('#elapsed').textContent = session.phase === 'done' ? 'Thanks for noticing.' : `${Math.floor(Math.max(0, Date.now() - session.startedAt) / 60000)} min since your check-in`; }; tick(); if (session.phase !== 'done') interval = setInterval(tick, 1000);
 $('#back').hidden = session.phase === 'done'; $('#reflection').hidden = session.phase !== 'done'; $('#reflection label').textContent = session.mission.reflection; $('#note').value = session.note || '';
 const noteStatus = () => { $('#note-status').textContent = savedLocally ? 'Saved only in this browser.' : 'Browser storage is unavailable. This note only lasts in this open tab; copy it before leaving.'; }; noteStatus();
 $('#note').oninput = () => { session.note = $('#note').value; storeSession(); noteStatus(); };
 $('#back').onclick = () => { session.phase = 'done'; storeSession(); renderOutside(); $('#note').focus(); };
 $('#reset').onclick = () => { clearInterval(interval); try { localStorage.removeItem(key); } catch { /* No storage access. */ } session = null; $('#outside').hidden = true; $('#preferences').hidden = false; $('#wish').focus(); };
}
document.querySelectorAll('[data-wish]').forEach(b => b.onclick = () => { $('#wish').value = b.dataset.wish; $('#wish').focus(); });
$('#preferences').onsubmit = async event => {
 event.preventDefault(); $('#find').disabled = true; $('#result').hidden = true;
 try {
  const p = { wish: $('#wish').value, minutes: Number($('#minutes').value), movement: $('#movement').value, conditions: $('#conditions').value };
  const candidates = eligibleMissions(p);
  if (!candidates.length) { setStatus('Stay in for now. Your next outdoor moment can wait for safe conditions.'); return; }
  setStatus('Loading the open model on this device… First use can take a moment.');
  const { loadMatcher } = await import('./ai.js'); const matcher = await loadMatcher();
  setStatus('Matching your words locally…'); const query = await matcher.encode(p.wish);
  ranked = rankMissions(candidates, query, matcher.vectors); current = 0; showCard(); setStatus('Local AI ready · MiniLM q8 · no model service contacted');
 } catch (error) { console.error('Pocket Outside local model failed:', error instanceof Error ? error.message : 'Unknown model error'); setStatus('The local AI could not load or match. Check the model setup in README, then retry. No pretend AI result was substituted.'); }
 finally { $('#find').disabled = false; }
};
try { session = readSession(localStorage.getItem(key)); if (session) renderOutside(); } catch { /* Storage optional. */ }
