PR Title: feat: Terminal-Style Status History Log

The Problem Solved: Improves the UX of the "Output Console" by retaining and displaying a history of generation events (e.g., from Initialization to Uploading to Chunk Processing) instead of blindly overwriting a single status string, giving users more transparency into the background processes.

Visuals:
- Success Log: `/home/jules/verification/screenshots/status_log.png`
- Error Log: `/home/jules/verification/screenshots/status_error_log.png`

Implementation Journey:
- Scanned repository to ensure feature is completely net-new and doesn't duplicate existing branches.
- Identified that `status` in `page.tsx` was just a string.
- Replaced the string rendering logic with an array `statusLog` mapped over in reverse with proper timestamps and dimming effects for older logs.
- Added `setStatusLog` at all call-sites for `setStatus` in the `handleGenerate` flow (success, progress chunks, and error catch blocks).
- Discovered through visual verification and code review that the UI was hiding the raw `error` string when logs were present; fixed the conditional logic to show the error string directly below the status log array.
- Cleaned up artifacts and verified tests locally.

Tradeoffs & Assumptions:
- **Lateral Path Brainstorming:**
  1. Standard: Add `statusLog` array, map last 5.
  2. Minimalist: Concatenate raw text with `\n` to a string state.
  3. Lateral: Hide logs in a `<details>` tag.
- **Decision:** I chose the Standard path (an array limited to the last 6 entries) because it allows for robust CSS styling (highlighting the newest message in bright blue typing effect while dimming older messages), creating a very polished "Terminal" aesthetic.
- **Assumption:** Assumed that the most useful view is the last 6 messages rather than an infinitely scrolling container, which prevents the console from growing indefinitely and breaking layout constraints.

Testing Instructions:
1. Start the web UI (`npm run dev`).
2. Navigate to `http://localhost:3000`.
3. Input any text and click "Start Generation".
4. Observe the Output Console as it retains older events with timestamps (e.g. `[10:04 AM] Uploading and processing...`) instead of flashing only the newest status.
5. If an error is thrown, verify that the red error text prints securely below the terminal logs.
Action Item: git push origin HEAD

## feat: Privacy Mode for Text Input

**The Problem Solved**: Added a privacy toggle allowing users to obscure highly sensitive information in the text area when sharing screens or in public environments, ensuring sensitive text remains hidden yet copyable/selectable.

**Visuals**:
- The Playwright tests generated images `text_hidden.png` and `text_visible.png` previously to verify UI changes in headless mode.

**Implementation Journey**:
- Added the `isTextHidden` state initialized to false.
- Imported `Eye` and `EyeOff` lucide-react icons for visual feedback.
- Placed an interactive button positioned in the lower-right corner of the relative container.
- Applied robust CSS Tailwind utility classes (`blur-sm opacity-50 select-none`) conditionally.
- Solved an unhandled UI state edge case preventing the EyeOff button from disappearing incorrectly when text length hits 0 while hidden state is active.

**Tradeoffs & Assumptions**:
- *Approaches considered*: (1) Completely mask input using `type="password"` (but it doesn't support multiline). (2) Overriding rendering using font size tricks (causes layout shifts). (3) CSS Blur filter logic. I assumed standard blurred obfuscation combined with `opacity-50` provides the ideal UX balance by showing content exists without being readable, while `select-none` prevents accidental selection revealing text boundaries.

**Testing Instructions**:
1. Run `cd web-ui && npm run dev`
2. Open localhost:3000
3. Switch to 'Text Input' Mode
4. Type any text.
5. Click the "Hide Text" icon. Verify the text becomes blurred.
6. Clear the text. Verify the "Hide Text" (EyeOff) button remains visible, so privacy mode can be toggled off at any point before typing new content.

**Action Item**:
Push branch 'feature/privacy-mode-text-input' and open PR via GH CLI.
