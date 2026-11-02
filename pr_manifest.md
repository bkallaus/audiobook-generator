PR Title: feat: Advanced Metadata Settings (Title/Author)

The Problem Solved: Previously, generated M4B/MP3 audiobooks hardcoded the output title to the original filename and did not include author metadata, despite the backend explicitly supporting these properties. This change exposes an "Advanced Settings" configuration that allows users to seamlessly define custom Title and Author attributes prior to generation, ensuring accurate ID3 tags in the downloaded artifact.

Visuals:
- [Screenshot](/home/jules/verification/screenshots/verification.png)
- [Video](/home/jules/verification/videos/verification.webm)

Implementation Journey:
- Brainstormed and explored features (tested voice previews which were already implemented).
- Evaluated `AudioProcessor.mergeAudio` to discover unexposed Title and Author metadata arguments.
- Added `ChevronDown` and `ChevronUp` icons and standard React state in `web-ui/src/app/page.tsx`.
- Appended `title` and `author` safely to FormData in `handleGenerate`.
- Implemented a collapsible "Advanced Settings (Metadata)" UI section to retain interface simplicity while providing the new inputs.
- Modified `web-ui/src/app/api/generate/route.ts` to extract `title`/`author` strings and funnel them into the `AudioProcessor.mergeAudio` method, defaulting to `filename` for title.
- Confirmed UI logic correctly submits these properties via Playwright integration scripts.

Tradeoffs & Assumptions:
- *Interpretation*: I assumed an explicit "Advanced Settings" section is better than always exposing these inputs, to keep the UI clean and minimalist (Tradeoff Bias: Caution and Simplicity).
- *Paths Brainstormed*:
  1. *Extract Text from EPUB for editing* (Rejected: High complexity, involves EPUB parsing library in-browser).
  2. *Add clear buttons for inputs* (Rejected: Not meaningful or net-new enough).
  3. *Expose Title/Author metadata configuration* (Chosen: Meaningful impact on output, leverages existing backend, straightforward frontend integration).
- *Assumptions*: If `title` is empty, the backend defaults to the `filename` just like it previously did. If `author` is empty, no artist metadata is injected, which is safe.

Testing Instructions:
1. Run `docker-compose up` or start backend + Next.js UI locally.
2. Select a text input or upload a file.
3. Click "Advanced Settings (Metadata)" below the Output Format options.
4. Input a custom "Title" and "Author".
5. Click "Start Generation".
6. Download the generated m4b/mp3 and check its metadata (e.g. via VLC or file properties). It should reflect your inputs.

Action Item: `git push origin feature/metadata-settings && gh pr create --title "feat: Advanced Metadata Settings (Title/Author)" --body "$(cat pr_manifest.md)"`
