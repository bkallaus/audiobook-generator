PR Title: feat: Show Generated File Size

The Problem Solved: Previously, users were given a link to download their generated audiobook without knowing how large the resulting file was. This feature adds a small, inline indicator to the download UI displaying the exact file size (in MB) of the generated audio file.

Visuals:
![File Size Indicator](/home/jules/verification/screenshots/file_size_display.png)

Implementation Journey:
* Checked git branches to ensure no duplicate PR exists for this feature.
* Brainstormed architectural paths (HTTP HEAD vs Backend `stat`).
* Elected the simplest and most performant "Minimalist" path: having the backend `/api/generate` endpoint stat the file path it just merged and return `fileSize` in the final `result` SSE payload.
* Added `fileSize` state to `page.tsx` that captures and formats this byte payload into Megabytes.
* Added formatting logic to the "Download Card" component to conditionally display the file size if present.
* Implemented a Playwright verification script to mock SSE chunk responses (`JSON.parse` compliant) and verify the DOM correctly renders "1.18 MB" from a mocked 1234567 byte response.
* Verified that TypeScript syntax and existing ESLint protocols were maintained perfectly via the "Surgical Changes" rule.

Tradeoffs & Assumptions:
* Assumption: Users want to know the file size before downloading large Audiobooks over potentially constrained connections.
* Standard Approach: The frontend initiates an HTTP HEAD request against the download URL when generation completes. (Rejected: Requires an extra round-trip network request and additional frontend logic).
* Minimalist Approach (Chosen): The backend already knows the exact path of the generated file immediately after generation. It simply uses `fs.promises.stat` to get the size in bytes and includes it in the existing `result` event payload.
* Lateral Approach: Estimate the file size based on duration and bitrate. (Rejected: Not accurate enough, especially for variable bitrate M4B/MP3 encoding).

Testing Instructions:
1. Run `npm run dev` in the `web-ui` directory.
2. Go to `http://localhost:3000`.
3. Switch to "Text Input" and paste some text.
4. Click "Start Generation".
5. When the process finishes and the Download Card appears, observe the text "Audiobook successfully generated • [XX.XX] MB".

Action Item: git push origin feature/show-generated-file-size && gh pr create -F pr_manifest.md
