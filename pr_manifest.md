PR Title: feat: Clear Status Log Button

The Problem Solved: Users lacked a way to clear out previous status logs between generations, leading to a cluttered console if multiple audiobook generations were run in sequence.

Visuals: [Screenshot of the Clear Button](file:///home/jules/verification/screenshots/clear_status_log_button.png)

Implementation Journey:
* Checked out feature branch `feature/clear-status-log`.
* Added `Trash2` icon to `lucide-react` import.
* Added a clear button next to the "Status Log" title that resets the array when clicked (only visible when not actively loading).
* Verified the layout and button presence locally via Playwright screenshot.

Tradeoffs & Assumptions:
* Assumption: The status log is just an ephemeral array stored in React state, not persistent storage.
* Approaches Brainstormed:
  1. Standard: Add button that clears state array.
  2. Minimalist: Same, but icon-only to avoid visual clutter.
  3. Lateral: Automatically clear log when a new generation begins.
* Chosen Route: Minimalist/Standard hybrid. An icon-only button looks clean and gives the user explicit control over when to clear the history.

Testing Instructions:
1. Run `cd web-ui && npm run dev`
2. Open localhost:3000 in browser.
3. Switch to Text Input, type some text.
4. Click "Start Generation", then click "Stop Generation" to generate some log entries.
5. Observe the Trash icon next to the "Status Log" header.
6. Click it and ensure the logs disappear.

Action Item: git push origin feature/clear-status-log
