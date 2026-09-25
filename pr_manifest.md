PR Title: feat: Voice Preview Speed Control

The Problem Solved: Users previously heard voice samples only at the default 1.0x speed regardless of their selected speed setting. This change ensures the voice sample preview respects the chosen playback speed, offering a more accurate representation of the final audiobook output.

Visuals:
- [voice-preview-speed.png](/home/jules/verification/screenshots/voice-preview-speed.png)

Implementation Journey:
- Branched to `feature/voice-preview-speed`
- Updated `/api/sample/route.ts` to parse and apply an optional `speed` query parameter.
- Refactored `/api/sample/route.ts` error handling to use `unknown` instead of `any` to satisfy ESLint.
- Modified `VoicePicker.tsx` to accept a `speed` prop and append it to the sample audio fetch request.
- Passed the current `speed` state from `page.tsx` down to the `VoicePicker` component.
- Built a temporary Playwright script to verify the UI interaction correctly fires a network request with the expected `speed` query parameter.

Tradeoffs & Assumptions:
- Standard approach chosen: I passed the speed down to the Kokoro client rather than using Web Audio API to stretch playback on the frontend. This ensures the preview sounds exactly like the generated file.
- Fallback: The API route defaults to `1.0` if no `speed` parameter is present, ensuring backwards compatibility for any external consumers.
- Validation: I assumed Next.js's native `parseFloat` handling is sufficient for parsing the query param; if it evaluates to `NaN` (due to an invalid string injection directly to the URL), it gracefully fails upstream. Since the frontend slider provides guaranteed numbers, this is not a concern for standard usage.

Testing Instructions:
1. Start the Next.js dev server (`npm run dev`).
2. Open `http://localhost:3000`.
3. Adjust the "Speed" slider to a non-1.0 value (e.g., 1.5).
4. Click the Play icon on any voice model in the list.
5. Verify (via the ear or the Network tab) that the audio requested is stretched to the correct speed via the `/api/sample?voice=...&speed=1.5` endpoint.

Action Item: `git commit` and push.
