PR Title: feat: Caching for Voice Sample Endpoint

The Problem Solved: Improves API responsiveness and saves compute power by caching identical, static voice samples requested from the `/api/sample` endpoint.

Visuals: N/A (No UI changes)

Implementation Journey:
* Added an in-memory `Map` to cache previously generated `Buffer` audio arrays.
* Checked for cached buffers before querying the `KokoroClient`.
* Appended `Cache-Control: public, max-age=3600, s-maxage=86400` response headers for CDN and browser-level caching.
* Fixed a new linting alert caused by my changes without modifying the existing codebase footprint.

Tradeoffs & Assumptions:
* **Assumption:** The requested text for samples will remain static ("Hello, this is a sample of my voice.").
* **Tradeoffs/Paths explored:**
  1. *Standard/Redis Cache*: Too heavy and adds external dependencies.
  2. *Minimalist (In-Memory Map)*: Simple, fast, and sufficient for the limited number of voices available. *(Chosen)*
  3. *Lateral (Pre-generation)*: Generate all samples on startup. Would complicate the build and delay boot time unnecessarily.

Testing Instructions:
1. Run `npm run dev`.
2. Open network tools in the browser and select a voice in the UI.
3. Observe the first fetch taking the standard generation time.
4. Select the same voice again; observe near-instant fetch time and the presence of `Cache-Control` headers.

Action Item: Using the `submit` tool to open a PR.
