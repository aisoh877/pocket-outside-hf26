# Pocket Outside

**A little less screen. A little more world.**

A new, local-first project for DEV Hacktoberfest Week 1 (Touch Grass), started October 11, 2026. MiniLM sentence embeddings turn a short wish into a human-authored outdoor mission. The screen is a departure point: save a pocket note, head out, and bring back one detail.

## Run locally

Requires Node **24.18+**, npm and Python 3. Network access is needed once for dependencies and the public model download. No account, API key, hosted inference or paid service is used.

```sh
npm ci --ignore-scripts
npm run model:download
npm run lint
npm test
npm run test:model
npm run build
npm run test:wasm
npm run test:server
npm run preview
```

Open **http://127.0.0.1:4317**. Setup downloads a pinned Apache-2.0 MiniLM model (23.7 MB including tokenizer files) and verifies SHA-256 against `model-manifest.json`. The build copies ONNX WASM files into its local assets. Keep the local server running; a laptop setup is not a hosted phone demo. `npm run build && npm run preview` is the supported first-run path. To develop after building once, use `npm run dev`.

No dependency installation scripts are required on the tested macOS arm64 environment. Other platforms remain unverified; do not blindly enable scripts if a native dependency reports a problem.

### Optional project-path build

For a candidate GitHub Pages URL such as `https://aisoh877.github.io/pocket-outside-hf26/`, build and preview with the same base path:

```sh
SITE_BASE_PATH=/pocket-outside-hf26/ npm run build
SITE_BASE_PATH=/pocket-outside-hf26/ npm run test:server
SITE_BASE_PATH=/pocket-outside-hf26/ npm run preview
```

Open `http://127.0.0.1:4317/pocket-outside-hf26/`. This is local preparation only, not a deployed site. An empty `.nojekyll` is included in the built directory for branch-based Pages publication. No publish workflow or automatic push is included. Rebuild without `SITE_BASE_PATH` to restore the default local root URL.

The current build is about 132 MB; its largest WASM exceeds Cloudflare Pages' 25 MiB single-asset limit. Do not assume that provider can host the unchanged build. Source publication should contain only this repository, not any parent task ledger or other projects. Git commit author metadata and the copyright name will become public with repository publication.

## Try the core loop

1. Select **A quiet moment**, 5 minutes, **Stay in one spot**, and **Safe to go outside**.
2. Select **Find my moment**. The first load initializes the local open model. The card should favour listening.
3. Choose **Save pocket note**, or read the three steps, then **I'm heading out**.
4. Return with **I'm back**, record one detail, and reload to see the local note persist.
5. **Clear this moment & start again** removes the saved moment.
6. Select **Not safe to go outside now** and submit. The app declines to recommend an outdoor mission and does not load AI for that request.

## What makes it AI

`src/ai.js` calls Transformers.js with the open-weight `Xenova/all-MiniLM-L6-v2` model, q8, WASM, one thread. Authored mission descriptions and the user's words are mean-pooled into normalized embeddings. Time, movement and shelter are hard filters; cosine similarity ranks only eligible cards. A model failure displays an error and produces no substitute recommendation.

This is semantic retrieval, not generative advice. It does not identify wildlife, know your location, check weather or certify accessible routes. It offers no diagnosis, health benefit guarantee or verified outdoor-time metric. English is the supported demo language. No live camera, microphone, weather, location or analytics are used.

The app is served locally with remote model downloads disabled at runtime. A reflection is stored in browser localStorage; use Clear to remove it. It works without a model service after setup while the local server runs. It is **not** an installed offline PWA, and fresh browser startup without the local server is unsupported.

## Verification, honestly separated

| Check | Evidence |
|---|---|
| Static lint | `npm run lint` |
| Filtering, invalid inputs, persistence, DOM workflow/error | `npm test` — 11 tests |
| Real local q8 inference | `npm run test:model` — `evidence/model-evaluation.json` |
| Production bundle | `npm run build` |
| Actual browser layout, browser WASM, download UX | **Pass** on local Chrome: real model, saved file, reflection persistence/clear, unsafe stop, repeated generation and 390px width |
| Outdoor use and public deployment | **Not performed** |

DOM tests use a mocked AI adapter to isolate UI behaviour. The model tests use real weights with remote access disabled on Node CPU. They are six authored smoke examples, not a broad accuracy claim. Browser and Node inference backends were checked separately. The browser run found a browser-default configuration error: local model loading must be explicitly enabled while remote model loading remains disabled. Two non-blocking Content-Length warnings occurred; no errors remained in the final run. See `evidence/browser-ui.json`.

## Originality and attribution

Application logic, activity cards, CSS landscape and copy were newly written on October 11, 2026 with Codex assistance. No pre-existing application code was reused. This original project is reserved for DEV Week 1. Standard open libraries and a public pretrained model are credited below.

- Application: MIT, see `LICENSE`.
- [MiniLM ONNX model](https://huggingface.co/Xenova/all-MiniLM-L6-v2), based on [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2): Apache-2.0; model revision and hashes in `model-manifest.json`.
- [Transformers.js](https://github.com/huggingface/transformers.js): Apache-2.0; [ONNX Runtime](https://github.com/microsoft/onnxruntime): MIT. See `THIRD_PARTY_NOTICES.md`.

## Submission state

`submission/dev-post.md` and `submission/demo-script.md` are drafts. Source is published at https://github.com/aisoh877/pocket-outside-hf26 with aisoh877 and GitHub noreply commit attribution. Public demo deployment is in progress; no video has been recorded/uploaded and no DEV entry has been submitted. Public demo operation must be verified before submission. The challenge ends **2026-10-12 06:59 UTC / 15:59 JST**. All later commits must be explicitly recorded below; never imply post-deadline improvements existed at submission.

### Post-deadline changes

None as of the initial local build. Add dated entries here for every change made after the deadline.
