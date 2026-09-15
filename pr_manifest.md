PR Title: feat: Retry Generation Button

The Problem Solved: When a generation fails, the main call-to-action button now explicitly morphs into a "Retry Generation" button with a clear warning color and an appropriate icon, signaling to the user that the previous attempt failed and they can try again.

Visuals:
- Before/After Video: [92a9cea861745c02a93f63f95b670063.webm](/home/jules/verification/videos/92a9cea861745c02a93f63f95b670063.webm)
- Screenshot: [retry-button.png](/home/jules/verification/screenshots/retry-button.png)

Implementation Journey:
- Brainstormed and selected a new autonomous feature since no specific feature was requested.
- Added conditional rendering in `page.tsx` for the main button to check `error`.
- Used `RotateCcw` from `lucide-react` for the retry icon.
- Applied a red/orange Tailwind gradient for the error state to distinguish it from the normal blue start state.
- Verified the UI behavior locally using a custom Playwright script simulating an SSE stream error.

Tradeoffs & Assumptions:
- Brainstormed 3 paths (Standard, Minimalist, Lateral). Chose the Standard path because reusing the main call-to-action button for retrying is idiomatic and keeps the interface clean, rather than adding a second disjoint button.
- Assumed it's safe to use the existing `handleGenerate` for retry since it reinitializes the necessary state.

Testing Instructions:
1. Start the UI: `cd web-ui && npm run dev`
2. Enter text in the Text Input area.
3. Turn off your local backend/Docker container to force a generation error (or mock it as done in verification).
4. Click Start Generation and observe it fail.
5. Notice the button turns orange/red and says "Retry Generation" with the rotate icon.
6. Click it again to retry.

Action Item: git push origin feature/retry-generation-button && gh pr create --title "feat: Retry Generation Button" --body-file pr_manifest.md
