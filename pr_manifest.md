PR Title: feat: Copy Status Logs to Clipboard

The Problem Solved: Improves debugging and sharing capabilities by allowing users to easily copy their generation logs (including error states) to their clipboard with a single click, eliminating the need to select text manually or download a file.

Visuals:
- Copy Logs Feature: `/home/jules/verification/screenshots/copy_logs.png`

Implementation Journey:
- Scanned repository and PR branches to ensure feature is completely net-new and doesn't duplicate existing work.
- Brainstormed and implemented an elegant `Copy Logs` button in the Output Console header.
- Handled the formatting of the status logs (appending timestamps) and correctly integrated the Clipboard API.
- Replaced the standard `Copy` icon with a `Check` icon for 2 seconds after a successful copy to provide positive visual feedback.
- Ensured it integrates properly with the pre-existing error states.
- Cleaned up internal testing scripts.

Tradeoffs & Assumptions:
- **Lateral Path Brainstorming:**
  1. Standard: Add a copy button in the header that invokes `navigator.clipboard.writeText`.
  2. Minimalist: Make the log text container itself clickable to copy to clipboard.
  3. Lateral: Add a floating action button on hover over the terminal window.
- **Decision:** I chose the Standard path. A dedicated icon button in the header is a very common UI pattern for "code/terminal" blocks (similar to GitHub code blocks). It is discoverable and doesn't interfere with users who just want to manually select a portion of the text.
- **Assumption:** Assuming the user wants to copy the entire raw string representation of the logs (including timestamps) rather than just the last 6 truncated logs visible in the terminal view. I mapped over the entire `statusLog` array to capture the complete history.

Testing Instructions:
1. Start the web UI (`npm run dev`).
2. Navigate to `http://localhost:3000`.
3. Enter text and click "Start Generation".
4. When logs appear in the Output Console, look for the "Copy logs to clipboard" icon in the header.
5. Click it, verify the checkmark appears briefly, and paste the clipboard contents somewhere to verify the full text log is captured.

Action Item: git push origin HEAD
