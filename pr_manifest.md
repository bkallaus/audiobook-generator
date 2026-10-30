PR Title: feat: Clear Status Log

The Problem Solved: Adds a clear button to the Status Log section, allowing users to manually reset their status history without needing to start a new generation.

Visuals: Screen verification automated; UI now displays a trash can icon next to the Status Log label when logs are present.

Implementation Journey:
- Created the feature branch `feature/clear-status-log`.
- Updated `web-ui/src/app/page.tsx` to conditionally render a `<button>` with a `Trash2` icon from `lucide-react`.
- Ensured the button only appears when `statusLog.length > 0` and the app is not actively `loading`.
- Clicking the button sets `statusLog` to an empty array.
- Tested UI with Playwright, verifying logs are populated on starting a generation and cleared successfully on clicking the trash icon.

Tradeoffs & Assumptions:
- I assumed a visual icon (Trash2) was preferable to text like "Clear" for minimalism.
- The button is disabled/hidden during active generation (`!loading`) to prevent user from accidentally losing active status updates.

Testing Instructions:
- Start the application using `cd web-ui && npm run dev`.
- Type some text into the Text Input area.
- Click "Start Generation" to populate the status log.
- (If it errors, that's fine, the log will populate with an error).
- Observe the new trash icon button next to "Status Log".
- Click it.
- Verify the status log clears and displays "Waiting for job...".

Action Item: git push origin feature/clear-status-log && gh pr create --title "feat: Clear Status Log" --body-file pr_manifest.md
