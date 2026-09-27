PR Title: feat: Auto-Save Text Draft

The Problem Solved: Users pasting long texts into the "Text Input" field would lose their entire draft if they accidentally refreshed the page, closed the tab, or the browser crashed. This feature seamlessly saves the drafted text and input mode in the background so it is restored automatically upon returning.

Visuals:
- [Screenshot: Restored Text Draft](file:///home/jules/verification/screenshots/draft_restored.png)

Implementation Journey:
- Verified no existing branch or PR duplicated this functionality using `git branch -a`.
- Brainstormed approaches in internal logs and opted for a minimalist React `useEffect` + `localStorage` integration over an explicit "Save Draft" button or heavy `useLocalStorage` abstractions.
- Added a `useRef` flag to safely track initial mount, bypassing the immediate overwrite of restored drafts.
- Hooked up `localStorage.getItem` on mount, and `localStorage.setItem` for dependencies `textInput` and `inputMode`.
- Verified UI functionality by writing and successfully running a Playwright script that validated text survival across page reloads.
- Adjusted strict React linting rule violations seamlessly.

Tradeoffs & Assumptions:
- Standard approach: Write a full wrapper hook `useLocalStorage` (Rejected: Unnecessarily abstracted for a single-use case).
- Minimalist approach: Raw `localStorage` access wrapped tightly in `useEffect` (Chosen: Safe, robust, surgical).
- Lateral approach: A manual "Save/Load Draft" button (Rejected: Worse UX compared to passive auto-save).
- Assumption: Only client-side local storage is needed because no user auth accounts exist. Handled perfectly with `useEffect` to prevent hydration mismatches during Next.js SSR.

Testing Instructions:
1. Start the dev server (`npm run dev`).
2. Switch to the "Text Input" tab.
3. Type any block of text.
4. Refresh the page (F5 or browser reload).
5. Verify the "Text Input" tab is automatically selected and your text is intact.
