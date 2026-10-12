# Third-party notices

Application source is MIT; third-party libraries and model weights retain their own licenses. No third-party logos, photos or music are included.

- Transformers.js 4.3.1 — Hugging Face, Apache-2.0. https://github.com/huggingface/transformers.js
- MiniLM / Xenova all-MiniLM-L6-v2 — sentence-transformers model, ONNX conversion by Xenova, Apache-2.0. https://huggingface.co/Xenova/all-MiniLM-L6-v2 and https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2 . Exact revision and hashes are in model-manifest.json. Weights are not committed; the downloader obtains them without modification.
- ONNX Runtime — Microsoft contributors, MIT. https://github.com/microsoft/onnxruntime
- Hugging Face Jinja 0.5.10 — MIT. https://github.com/huggingface/huggingface.js/tree/main/packages/jinja
- Hugging Face Tokenizers 0.2.0 — Apache-2.0. https://github.com/huggingface/tokenizers.js
- Vite — Vite contributors, MIT. https://github.com/vitejs/vite
- ESLint — OpenJS Foundation and contributors, MIT. https://github.com/eslint/eslint
- jsdom — jsdom contributors, MIT. https://github.com/jsdom/jsdom

Copies of the inference runtime licenses and ONNX third-party notices are in licenses/. SOURCES.json records the exact upstream source for the ONNX WASM build notices. The Apache-2.0 terms also cover the unmodified MiniLM model named above. Build copies this notice, the application MIT license, dependency licenses, and model manifest into the static site's licenses/ directory. Publishing the static build redistributes the downloaded model and runtime files under their respective licenses; the source repository itself does not commit the model weights. Full dependency metadata remains in package-lock.json, and transitive package licenses remain in node_modules after npm ci.
