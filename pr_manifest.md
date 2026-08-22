PR Title: feat: Global Keyboard Shortcut (Cmd/Ctrl + Enter) to Start/Stop Generation

The Problem Solved: Adds a convenient, accessible way for users to quickly trigger or abort audiobook generation without taking their hands off the keyboard, improving the overall user experience during text input.

Visuals:
- [Screenshot](/home/jules/verification/screenshots/verification.png)
- [Video](/home/jules/verification/videos/e95dea119fc65f42479c2d81b73484b0.webm)

Implementation Journey:
- Set up a `useEffect` hook in `web-ui/src/app/page.tsx` that attaches a `keydown` listener to the `window`.
- Added logic to intercept `Cmd/Ctrl + Enter` and either trigger `handleGenerate()` or abort the generation via `abortController` depending on the current `loading` state.
- Updated the primary Generate and Stop action buttons to display the `(⌘/Ctrl + Enter)` shortcut text to expose the functionality to users.
- Wrapped `handleGenerate` in `useCallback` to prevent stale closures and unnecessary re-renders in the effect hook.
- Wrote a Playwright verification script to validate the flow visually and locally.

Tradeoffs & Assumptions:
- **Assumption:** The user did not specify a feature, so a safe, non-invasive UX improvement was chosen that didn't conflict with any existing open branches.
- **Paths Brainstormed:**
  1. *Standard:* `useEffect` on `window` listening for keydown. (Chosen: robust, handles focus anywhere on the page).
  2. *Minimalist:* `onKeyDown` on the `textarea` directly. (Rejected: fails if the user clicks outside the textarea to interact with voice settings).
  3. *Lateral:* Hidden button with `accessKey` attribute. (Rejected: requires Alt+Shift combinations depending on browser, less standard than Cmd+Enter).
- **Tradeoff:** A global listener means the shortcut works anywhere on the page. While this is broadly desirable for this specific app, it could theoretically conflict if other complex text areas were added later. However, for the current scope, it is the simplest and most effective approach.

Testing Instructions:
1. Start the frontend dev server (`cd web-ui && npm run dev`).
2. Navigate to `http://localhost:3000`.
3. Select "Text Input" and type some text.
4. Press `Cmd + Enter` (Mac) or `Ctrl + Enter` (Windows/Linux).
5. Verify the generation starts.
6. Press the shortcut again while generation is active.
7. Verify the generation stops safely.

Action Item: `git push -u origin feature/keyboard-shortcut-start-stop && gh pr create --title "feat: Global Keyboard Shortcut (Cmd/Ctrl + Enter) to Start/Stop Generation" --body-file pr_manifest.md`
