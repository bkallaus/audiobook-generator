PR Title: feat: Real-Time Character Processing Stats and Processing Speed

The Problem Solved: Previously, long audio generation tasks provided no visibility into the actual workload size or processing speed. This change adds real-time character processing statistics (e.g., "25,000 / 50,000 chars") and instantaneous processing speed (chars/sec) to the Progress Console, giving users precise insight into generation progress and performance. It also fixes a stale closure bug that broke ETA calculations.

Visuals: [stats_screenshot.png]

Implementation Journey:
- Added `charStats` state to the `Home` component to track `processed`, `total`, and `speed`.
- Fixed a stale closure bug on `startTime` inside the `handleGenerate` async loop by capturing `currentStartTime`.
- Calculated real-time characters per second using the elapsed time and `processedCharacters` event data.
- Updated the Output Console's progress bar header to display the new statistics alongside the percentage.
- Verified rendering with a mocked SSE Playwright test.

Tradeoffs & Assumptions:
- *Assumption*: The server's `processedCharacters` stream is reliable and accurate.
- *Standard vs Minimalist vs Creative*: I chose a *Creative* approach. While standard would just show "Chars Processed: X", calculating the actual speed (chars/sec) reusing the existing `elapsed` time provides significantly higher value with zero extra backend load.
- *Tradeoff*: Kept the UI clean by only showing the stats while loading/generating. Once complete, the stats disappear to keep the terminal uncluttered.

Testing Instructions:
1. Start the backend and frontend (`npm run dev`).
2. Upload a large text file or paste significant text into the Text Input mode.
3. Click "Start Generation".
4. Observe the Output Console next to the Progress percentage; it should display the processed/total characters and the chars/sec speed dynamically.

Action Item: `git push origin feature/realtime-processing-stats-nova && gh pr create --title "feat: Real-Time Character Processing Stats and Processing Speed" --body-file pr_manifest.md`
