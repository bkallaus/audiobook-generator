PR Title: feat: Autofocus text area when switching to Text Input mode

The Problem Solved: Improves user experience by automatically focusing the textarea when the user toggles from 'File Upload' to 'Text Input' mode, eliminating the need for an extra click before they can start typing or pasting.

Visuals: ![Screenshot](/home/jules/verification/verification.png)

Implementation Journey:
- Created feature branch `feature/autofocus-textarea-when-switching-modes`.
- Added the `autoFocus` prop to the textarea component in `web-ui/src/app/page.tsx`.
- Verified changes locally using Playwright to confirm the textarea receives focus immediately upon mode switch.

Tradeoffs & Assumptions:
- Assumption: When switching to Text Input mode, the primary user intent is to input text immediately.
- Brainstormed Paths: 1) Standard `useRef` + `useEffect`. 2) Minimalist `autoFocus` HTML attribute. 3) Lateral delayed programmatic click/focus.
- Chosen Path: Minimalist. Using the standard `autoFocus` prop on a conditionally rendered React component is the simplest, most performant way to achieve the desired behavior without introducing unnecessary state or refs.

Testing Instructions:
1. Start the Next.js development server.
2. Open the application in a browser.
3. Click the "Text Input" button to switch modes.
4. Verify that the textarea is immediately focused (cursor blinking inside) and you can begin typing without clicking into it first.

Action Item: `git push -u origin HEAD && gh pr create -F pr_manifest.md`
